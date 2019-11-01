import { Router } from 'express';

const router = Router();

import accountController from './controllers/accountController';
import accountMiddleware from '../utils/middleware/accoutMiddleware';

router.post('/sign-up',
    accountMiddleware.createValidationData,
    accountController.createAccount
);
router.get('/sign-in',
    accountMiddleware.loginValidationData,
    accountMiddleware.tokenVerification,
);

export default router;
