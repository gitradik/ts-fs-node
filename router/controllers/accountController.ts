import { Account } from '../../models';
import { MONGO_ERROR_CODES, UPLOAD_AVATAR_ERRORS } from '../../utils/constants';
import PublicAccountInterface from '../../utils/interfaces/publicAccount.interface';
import TokensInterface from '../../utils/interfaces/tokens.interface';
import uploadAvatarImg from '../../utils/multer/avatar';
import 'dotenv/config';

const createAccount = async (req, res, next): Promise<void> => {
    try {
        const acc = new Account(req.body);
        const newAccount = await acc.save();
        const tokens = await newAccount.getTokensPair();
        const { confirmLink } = await newAccount.getConfirmLink();
        console.log('<><><>', confirmLink);
        const { _id, firstName, lastName, email, avatarPath, role, album, confirmed }: PublicAccountInterface = newAccount;
        const currentAccount: PublicAccountInterface = {
            _id, firstName, lastName, email, role, avatarPath, album, confirmed
        };
        res.send({
            account: currentAccount,
            tokens
        });
    } catch (err) {
        const mongoError = MONGO_ERROR_CODES.find(
            type => type.code === err.code && err.keyValue.hasOwnProperty(type.keyValue)
        );
        if (typeof mongoError !== 'undefined') {
            next({type: mongoError.errorType});
        } else {
            next({type: 'conflictAccountData'});
        }
    }
};

const updateAccount = async (req, res, next): Promise<void> => {
    try {
        const acc = await Account.findByIdAndUpdate(
            { _id: req.headers.accountId },
            req.body,
            { new: true }
        );

        const { _id, firstName, lastName, email, avatarPath, role, album, confirmed }: PublicAccountInterface = acc;
        const currentAccount: PublicAccountInterface = {
            _id, firstName, lastName, email, role, avatarPath, album, confirmed
        };

        res.send({ account: currentAccount });
    } catch (err) {
        const mongoError = MONGO_ERROR_CODES.find(
            type => type.code === err.code && err.keyValue.hasOwnProperty(type.keyValue)
        );
        if (typeof mongoError !== 'undefined') {
            next({type: mongoError.errorType});
        } else {
            next({type: 'conflictAccountData'});
        }
    }
};

const getAccountById = async (req, res, next): Promise<void> => {
    try {
        const acc = await Account.findById({_id: req.headers.accountId});
        const { _id, firstName, lastName, email, avatarPath, role, album, confirmed }: PublicAccountInterface = acc;
        const currentAccount: PublicAccountInterface = {
            _id, firstName, lastName, email, role, avatarPath, album, confirmed
        };

        const tokens: TokensInterface = {...req.headers.tokens};
        delete req.headers.tokens;

        res.send({
            account: currentAccount,
            tokens
        });

    } catch (err) {
        next({type: 'accountNotFound'});
    }
};

const uploadAvatar = async (req, res, next): Promise<void> => {
    uploadAvatarImg(req, res, async (err): Promise<void> => {
        if (err) {
            const avatarError = UPLOAD_AVATAR_ERRORS.find(
                type => type.code === err.code
            );
            if (typeof avatarError !== 'undefined') {
                next({type: avatarError.errorType});
            } else {
                next({type: 'unsupportedMediaType'});
            }
        } else {
            if (typeof req.file === 'undefined') {
                next({type: 'unsupportedMediaType'});
            } else {
                const acc = await Account.findByIdAndUpdate(
                    { _id: req.headers.accountId },
                    { avatarPath: req.file.filename },
                    { new: true }
                );

                const { _id, firstName, lastName, email, avatarPath, role, album, confirmed }: PublicAccountInterface = acc;
                const currentAccount: PublicAccountInterface = {
                    _id, firstName, lastName, email, role, avatarPath, album, confirmed
                };

                res.send({ account: currentAccount });
            }
        }
    });
};

export default {
    createAccount,
    getAccountById,
    uploadAvatar,
    updateAccount,
}
