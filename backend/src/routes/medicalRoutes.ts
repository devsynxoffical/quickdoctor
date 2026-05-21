import { Router } from 'express';
import { issuePrescription, issueCertificate, getMyPrescriptions, getMyCertificates } from '../controllers/medicalController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/prescription', authenticate, authorize(['DOCTOR']), issuePrescription);
router.post('/certificate', authenticate, authorize(['DOCTOR']), issueCertificate);
router.get('/prescriptions/me', authenticate, authorize(['PATIENT']), getMyPrescriptions);
router.get('/certificates/me', authenticate, authorize(['PATIENT']), getMyCertificates);

export default router;
