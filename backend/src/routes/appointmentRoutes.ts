import { Router } from 'express';
import {
  cancelPendingAppointment,
  completeConsultation,
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  updateClinicalNotes,
} from '../controllers/appointmentController';
import { createZoomMeeting, getAppointmentJoin } from '../controllers/zoomController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/', authenticate, authorize(['PATIENT']), createAppointment);
router.get('/', authenticate, getAppointments);
router.get('/:id/join', authenticate, getAppointmentJoin);
router.post('/:id/zoom', authenticate, authorize(['ADMIN', 'DOCTOR']), createZoomMeeting);
router.patch('/:id/notes', authenticate, authorize(['DOCTOR', 'ADMIN']), updateClinicalNotes);
router.post('/:id/complete', authenticate, authorize(['DOCTOR', 'ADMIN']), completeConsultation);
router.patch('/:id/status', authenticate, authorize(['DOCTOR', 'ADMIN']), updateAppointmentStatus);
router.delete('/:id/pending', authenticate, authorize(['PATIENT']), cancelPendingAppointment);
router.get('/:id', authenticate, getAppointmentById);

export default router;
