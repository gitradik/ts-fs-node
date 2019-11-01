const { Account } = require('../../models/');

const createAccount = async (req, res, next) => {
    try {
        const acc = new Account(req.body);
        const newAccount = await acc.save();
        const tokens = await newAccount.getTokensPair();
        const { _id, firstName, lastName, email, avatarPath, role, album } = newAccount;
        const currentAccount = {
            _id, firstName, lastName, email, avatarPath, role, album
        };
        res.send({
            account: currentAccount,
            tokens
        });
    } catch (err) {
        res.send(err);
    }
};

export default {
    createAccount,
}
