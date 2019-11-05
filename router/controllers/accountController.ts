import { Account } from '../../models';
import { MONGO_ERROR_CODES } from '../../utils/constants';
import PublicAccountInterface from '../../utils/interfaces/publicAccount.interface';
import TokensInterface from '../../utils/interfaces/tokens.interface';
import uploadAvatarImg from '../../utils/multer/avatar';

const createAccount = async (req, res, next): Promise<void> => {
    try {
        const acc = new Account(req.body);
        const newAccount = await acc.save();
        const tokens = await newAccount.getTokensPair();
        const {_id, firstName, lastName, email, avatarPath, role, album}: PublicAccountInterface = newAccount;
        const currentAccount: PublicAccountInterface = {
            _id, firstName, lastName, email, role, avatarPath, album
        };
        res.send({
            account: currentAccount,
            tokens
        });
    } catch (err) {
        const typeError = MONGO_ERROR_CODES.find(
            type => type.code === err.code && err.keyValue.hasOwnProperty(type.keyValue)
        );
        if (typeof typeError !== 'undefined') {
            next({type: typeError.errorType});
        } else {
            next({type: 'conflictAccountData'});
        }
    }
};

const getAccountById = async (req, res, next): Promise<void> => {
    try {
        const acc = await Account.findById({_id: req.headers.accountId});
        const {_id, firstName, lastName, email, avatarPath, role, album}: PublicAccountInterface = acc;
        const currentAccount: PublicAccountInterface = {
            _id, firstName, lastName, email, role, avatarPath, album
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

const uploadAvatar = (req, res, next) => {
    uploadAvatarImg(req, res, async (err) => {
        if (err) {
            const typeError = MONGO_ERROR_CODES.find(
                type => type.code === err.code
            );
            if (typeof typeError !== 'undefined') {
                next({type: typeError.errorType});
            } else {
                next({type: 'unsupportedMediaType'});
            }
        } else {
            // If file is not selected
            if (typeof req.file === 'undefined') {
                res.end();
            } else {
                const newAcc = await Account.findByIdAndUpdate(
                    { _id: req.headers.accountid },
                    { avatarPath: req.file.filename },
                    { new: true }
                );
                res.send(newAcc);
            }
        }
    });
};

export default {
    createAccount,
    getAccountById,
    uploadAvatar,
}
