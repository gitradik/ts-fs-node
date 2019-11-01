import { Account } from '../../models';
import { MONGO_ERROR_CODES } from '../../utils/constants';

const createAccount = async (req, res, next) => {
    try {
        const acc = new Account(req.body);
        const newAccount = await acc.save();
        const tokens = await newAccount.getTokensPair();
        const { _id, firstName, lastName, email, avatarPath, role, album } = newAccount;
        const currentAccount = {
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
        if(typeof typeError !== 'undefined') {
            next({ type: typeError.errorType });
        }
        next({ type: 'conflictAccountData' });
    }
};

export default {
    createAccount,
}
