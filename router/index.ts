import { Router } from 'express';

const router = Router();

import accountController from './controllers/accountController';
import accountMiddleware from '../utils/middleware/accoutMiddleware';

router.get('/',
    accountMiddleware.validationData,
    accountController.createAccount
);

export default router;
