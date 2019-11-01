import { Router } from 'express';

const router = Router();

import accountController from './controllers/accountController';
import accountMiddleware from '../utils/middleware/accoutMiddleware';

router.post('/sign-up',
    accountMiddleware.createValidationData,
    accountController.createAccount
);
router.post('/sign-in',
    accountMiddleware.loginValidationData,
    accountMiddleware.passwordMatch,
    accountController.getAccountById
);
router.get('/token',
    accountMiddleware.tokenViability,
    accountController.getAccountById
);

export default router;
