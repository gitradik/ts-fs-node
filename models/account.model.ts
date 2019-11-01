import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ROLE_TYPE } from '../utils/constants';
import PhotoSchema from './photo.model';
import RefreshToken from './refresh.token.model';
import 'dotenv/config';
const { TOKEN_SALT, TYPE_TOKEN_ACCESS, TYPE_TOKEN_REFRESH } = process.env;

const AccountSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    hashPassword: {
        type: String,
        required: true,
        select: false,
    },
    role: {
        type: Number,
        required: true,
        enum: ROLE_TYPE,
        default: ROLE_TYPE.USER
    },
    avatarPath: {
        type: String
    },
    album: {
        type: [PhotoSchema]
    }
});

AccountSchema.virtual('password')
    .set(function (password): void {
        this.hashPassword = password && bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    })
    .get(function (): string {
        return this.hashPassword;
    });

AccountSchema.methods.comparePassword = function (password): boolean {
    return password === bcrypt.compareSync(password, this.hashPassword);
};

AccountSchema.methods.generateAccessToken = function() {
    return jwt.sign({uid: this._id, type: TYPE_TOKEN_ACCESS}, TOKEN_SALT, {expiresIn: '2h'});
};

AccountSchema.methods.generateRefreshToken = function() {
    return jwt.sign({uid: this._id, type: TYPE_TOKEN_REFRESH}, TOKEN_SALT, {expiresIn: '30d'});
};

AccountSchema.methods.getTokensPair = function(): Promise<object> {
    const access_token = this.generateAccessToken();
    const refresh_token = this.generateRefreshToken();
    const token = new RefreshToken({ _id: refresh_token, used: false });
    return token.save()
        .then(() => ({
            access: access_token,
            refresh: refresh_token
        }));
};

AccountSchema.statics.authByRefresh = function(refreshToken): Promise<object> {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, TOKEN_SALT, (err, decoded) => {
            if (err) return reject(err);
            if (decoded.type !== TYPE_TOKEN_REFRESH) {
                return reject(new Error(`Invalid ${TYPE_TOKEN_REFRESH} token type.`));
            }
            RefreshToken.findOne({ _id: refreshToken, used: false })
                .then(token => resolve({ decoded, token }))
                .catch(reject);
        });
    }).then(({ decoded, token }) => {
        if (!token) throw new Error('Token is already used.');
        return RefreshToken.update({ _id: refreshToken }, { used: true })
            .then(() => Account.findById(decoded.uid));

    }).then(account => {
        if (!account) throw new Error('Account not found.');
        return account.getTokensPair();
    });
};

const Account = mongoose.model('Account', AccountSchema);
export default Account;
