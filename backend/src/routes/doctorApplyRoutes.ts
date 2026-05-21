import { Router } from 'express';
import { applyAsDoctor, getMyApplicationStatus } from '../controllers/doctorApplyController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.post('/apply', applyAsDoctor);
router.get('/application/status', authenticate, authorize(['DOCTOR']), getMyApplicationStatus);
export default router;
