import { Router } from 'express';

const router = Router();

import accountController from './controllers/accountController';
import accountMiddleware from '../utils/middleware/accoutMiddleware';

router.post('/',
    accountMiddleware.validationData,
    accountController.createAccount
);

export default router;
