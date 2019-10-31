import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { ROLE_TYPE } from '../utils/constants';
import PhotoSchema from './photo.model';
import RefreshToken from './refresh.token.model';

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
    .set(function (password) {
        this.hashPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(8));
    })
    .get(function () {
        return this.hashPassword;
    });

AccountSchema.methods.comparePassword = function (password) {
    return password === bcrypt.compareSync(password, this.hashPassword);
};

AccountSchema.methods.generateAccessToken = function() {
    return jwt.sign({uid: this._id, type: 'access'}, 'shhhhh', {expiresIn: '2h'});
};
AccountSchema.methods.generateRefreshToken = function() {
    return jwt.sign({uid: this._id, type: 'refresh'}, 'shhhhh', {expiresIn: '30d'});
};

AccountSchema.methods.getTokensPair = function() {
    const access_token = this.generateAccessToken();
    const refresh_token = this.generateRefreshToken();
    const token = new RefreshToken({ _id: refresh_token, used: false });
    return token.save().then(() => ({ access_token, refresh_token }));
};

AccountSchema.statics.authByRefresh = function(refreshToken) {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, 'shhhhh', (err, decoded) => {
            if (err) return reject(err);
            if (decoded.type !== 'refresh') {
                return reject(new Error('Invalid refresh token type.'));
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
