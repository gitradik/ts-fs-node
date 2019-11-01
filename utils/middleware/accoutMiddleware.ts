import { createAccountSchema, loginSchema } from '../../utils/validator';
import * as jwt from 'jsonwebtoken';
import 'dotenv/config';
const { TOKEN_SALT, TYPE_TOKEN_ACCESS, TYPE_TOKEN_REFRESH } = process.env;

const createValidationData = async (req, res, next) => {
    const isValidData = await createAccountSchema.isValid(req.body);
    if(isValidData) {
        next();
    } else {
        next({ type: 'conflictAccountData' });
    }
};

const loginValidationData = async (req, res, next) => {
    const isValidData = await loginSchema.isValid(req.body);
    if(isValidData) {
        await next();
    } else {
        next({ type: 'conflictAccountData' });
    }
};

const tokenVerification = async (req, res, next) => {
    try {
        const accessToken = req.headers[TYPE_TOKEN_ACCESS];
        const decode = await jwt.verify(accessToken, TOKEN_SALT);




        res.send({decode});
    } catch (err) {
        next({ type: 'unregistered' });
    }
};

export default {
    createValidationData,
    loginValidationData,
    tokenVerification,
};
