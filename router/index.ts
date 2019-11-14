import { Router } from 'express';

const router = Router();

import accountController from './controllers/accountController';
import accountMiddleware from '../utils/middleware/accoutMiddleware';

router.post('/sign-up',
    accountMiddleware.createValidationData,
    accountController.createAccount,
);
router.post('/sign-in',
    accountMiddleware.loginValidationData,
    accountMiddleware.passwordMatch,
    accountController.getAccountById,
);
router.get('/token',
    accountMiddleware.tokenViability,
    accountController.getAccountById,
);
router.put('/upload-avatar',
    accountMiddleware.tokenViability,
    accountController.uploadAvatar,
);
router.put('/update-account',
    accountMiddleware.tokenViability,
    accountMiddleware.updateValidationData,
    accountController.updateAccount,
);
router.post('/verify',
    accountMiddleware.tokenViability,
    accountMiddleware.verifyAccount,
    accountController.getAccountById,
);

export default router;
