import { Account } from '../../models';
import { MONGO_ERROR_CODES } from '../../utils/constants';
import PublicAccountInterface from '../../utils/interfaces/publicAccount.interface';
import TokensInterface from '../../utils/interfaces/tokens.interface';

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
        }
        next({type: 'conflictAccountData'});
    }
};

const getAccountById = async (req, res, next): Promise<void> => {
    try {
        const acc = await Account.findById({_id: req.headers.accountUid});
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

export default {
    createAccount,
    getAccountById,
}
