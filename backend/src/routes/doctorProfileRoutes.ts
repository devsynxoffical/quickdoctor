import { Router } from 'express';
import {
  getMyProfile,
  updateAvailability,
  updateMyProfile,
  updateServices,
} from '../controllers/doctorProfileController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
router.use(authenticate, authorize(['DOCTOR']));

router.get('/profile', getMyProfile);
router.patch('/profile', updateMyProfile);
router.put('/availability', updateAvailability);
router.put('/services', updateServices);

export default router;
