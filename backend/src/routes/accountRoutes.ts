import { Router } from 'express';
import {
  deleteMyAccount,
  exportMyData,
  recordConsent,
} from '../controllers/accountController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);
router.get('/export', exportMyData);
router.post('/delete', deleteMyAccount);
router.post('/consent', recordConsent);

export default router;
