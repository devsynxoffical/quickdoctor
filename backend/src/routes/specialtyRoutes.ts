import { Router } from 'express';
import { listSpecialties } from '../controllers/specialtyController';

const router = Router();
router.get('/', listSpecialties);
export default router;
