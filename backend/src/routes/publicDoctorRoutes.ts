import { Router } from 'express';
import {
  getDoctorPublic,
  getDoctorSlots,
  listApprovedDoctors,
} from '../controllers/publicDoctorController';

const router = Router();
router.get('/', listApprovedDoctors);
router.get('/:id', getDoctorPublic);
router.get('/:id/slots', getDoctorSlots);
export default router;
