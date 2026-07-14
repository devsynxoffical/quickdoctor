import { Router } from 'express';
import {
  issuePrescription,
  issueCertificate,
  getMyPrescriptions,
  getMyCertificates,
  getDoctorPrescriptions,
  getDoctorCertificates,
  markPrescriptionSentToPharmacy,
} from '../controllers/medicalController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/prescription', authenticate, authorize(['DOCTOR']), issuePrescription);
router.post(
  '/prescription/:id/send-to-pharmacy',
  authenticate,
  authorize(['DOCTOR', 'ADMIN']),
  markPrescriptionSentToPharmacy
);
router.post('/certificate', authenticate, authorize(['DOCTOR']), issueCertificate);
router.get('/prescriptions/doctor', authenticate, authorize(['DOCTOR']), getDoctorPrescriptions);
router.get('/certificates/doctor', authenticate, authorize(['DOCTOR']), getDoctorCertificates);
router.get('/prescriptions/me', authenticate, authorize(['PATIENT']), getMyPrescriptions);
router.get('/certificates/me', authenticate, authorize(['PATIENT']), getMyCertificates);

export default router;
