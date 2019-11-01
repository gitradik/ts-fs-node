import { createAccountSchema, loginSchema } from '../../utils/validator';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
const { TOKEN_SALT, TYPE_TOKEN_ACCESS, TYPE_TOKEN_REFRESH } = process.env;
import { Account } from '../../models';
import TokensInterface from '../interfaces/tokens.interface';

const createValidationData = async (req, res, next): Promise<void> => {
    const isValidData = await createAccountSchema.isValid(req.body);
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

const tokenVerification = async (req, res, next): Promise<void> => {
    const accessToken = req.headers[TYPE_TOKEN_ACCESS];
    const refreshToken = req.headers[TYPE_TOKEN_REFRESH];

    try {
        const decode = await jwt.verify(accessToken, TOKEN_SALT);

        if (decode.exp > Date.now() / 1000) {
            req.headers.accountUid = decode.uid;
            next();
        } else {
            res.send('decode.exp > Date.now() / 1000 = no true')
        }

    } catch (err) {
        const result: TokensInterface | null = await refresh(refreshToken);
        if (result) {
            const decode = await jwt.verify(result.access, TOKEN_SALT);
            req.headers.accountUid = decode.uid;
            req.headers.tokens = {
                access: result.access,
                refresh: result.refresh,
            };
            next();
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
    loginValidationData,
    tokenVerification,
};
