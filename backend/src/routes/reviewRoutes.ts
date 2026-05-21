import { Router } from 'express';
import { createReview, getDoctorReviews } from '../controllers/reviewController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/doctor/:doctorId', getDoctorReviews);
router.post('/', authenticate, authorize(['PATIENT']), createReview);

export default router;
