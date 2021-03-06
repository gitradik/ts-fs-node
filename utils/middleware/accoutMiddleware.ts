import { createAccountSchema, updateAccountSchema, loginSchema } from '../../utils/validator';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
const { TOKEN_SALT, TYPE_TOKEN_ACCESS, TYPE_TOKEN_REFRESH } = process.env;
import { Account } from '../../models';
import TokensInterface from '../interfaces/tokens.interface';
import * as bcrypt from 'bcrypt';

const createValidationData = async (req, res, next): Promise<void> => {
    const isValidData = await createAccountSchema.isValid(req.body);
    if(isValidData) {
        next();
    } else {
        next({ type: 'conflictAccountData' });
    }
};

const updateValidationData = async (req, res, next): Promise<void> => {
    const isValidData = await updateAccountSchema.isValid(req.body);
    if(isValidData) {
        next();
    } else {
        next({ type: 'conflictAccountData' });
    }
};

const loginValidationData = async (req, res, next): Promise<void> => {
    const isValidData = await loginSchema.isValid(req.body);
    if(isValidData) {
        await next();
    } else {
        next({ type: 'conflictAccountData' });
    }
};

const passwordMatch = async (req, res, next): Promise<void> => {
    const {email, password} = req.body;
    const acc = await Account.findOne({email});
    if (acc && acc.comparePassword(password)) {
        const tokensPair: TokensInterface = await acc.getTokensPair();
        req.headers.accountId = acc._id;
        req.headers.tokens = {
            access: tokensPair.access,
            refresh: tokensPair.refresh,
        };
        next();
    } else {
        next({type: 'accountNotFound'});
    }
};

const verifyAccount = async (req, res, next): Promise<void> => {
    try {
        const hashId = req.query['hashId'];
        await Account.verifyByHashId(hashId, req.headers.accountId);
        next();
    } catch (err) {
        console.log('>>>>>>>>>>>>>>>>', err.message);
        next({type: 'unregistered'});
    }
};

const tokenViability = async (req, res, next): Promise<void> => {
    const accessToken = req.headers[TYPE_TOKEN_ACCESS];
    const refreshToken = req.headers[TYPE_TOKEN_REFRESH];

    try {
        const decode = await jwt.verify(accessToken, TOKEN_SALT);

        if (decode.exp > Date.now() / 1000) {
            req.headers.accountId = decode.uid;
            await next();
        } else {
            throw new Error('Access token expired');
        }
    } catch (err) {
        const result: TokensInterface | null = await refresh(refreshToken);
        if (result) {
            const decode = await jwt.verify(result.access, TOKEN_SALT);
            req.headers.accountId = decode.uid;
            req.headers.tokens = {
                access: result.access,
                refresh: result.refresh,
            };
            await next();
        } else {
            next({type: 'unregistered'});
        }
    }
};

async function refresh(refreshToken: string): Promise<TokensInterface | null> {
    try {
        return await Account.authByRefresh(refreshToken);
    } catch (err) {
        return null;
    }
}

export default {
    createValidationData,
    updateValidationData,
    loginValidationData,
    tokenViability,
    passwordMatch,
    verifyAccount,
};
