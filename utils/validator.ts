import * as yup from 'yup';
import { ROLE_TYPE } from '../utils/constants';

const createAccountSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().trim().min(8).required(),
    role: yup.number().min(ROLE_TYPE.ADMIN).max(ROLE_TYPE.PREMIUM_USER).default(ROLE_TYPE.USER),
    avatarPath: yup.string(),
});

const updateAccountSchema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    email: yup.string().email().required(),
});

const loginSchema =  yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().trim().min(8).required(),
});

export {
    createAccountSchema,
    updateAccountSchema,
    loginSchema,
};
