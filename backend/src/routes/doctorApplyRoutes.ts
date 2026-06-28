import { Router } from 'express';
import { applyAsDoctor, checkApplicationStatus, getMyApplicationStatus } from '../controllers/doctorApplyController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.post('/apply', applyAsDoctor);
router.post('/application/status', checkApplicationStatus);
router.get('/application/status', authenticate, authorize(['DOCTOR']), getMyApplicationStatus);
export default router;
