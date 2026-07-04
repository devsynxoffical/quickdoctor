import { Router } from 'express';
import {
  createCheckoutSession,
  devConfirmPayment,
  getCheckoutStatus,
} from '../controllers/paymentController';
import { validateCoupon } from '../controllers/couponController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/checkout', authenticate, authorize(['PATIENT']), createCheckoutSession);
router.post('/validate-coupon', authenticate, authorize(['PATIENT']), validateCoupon);
router.get('/status', authenticate, authorize(['PATIENT']), getCheckoutStatus);
router.post(
  '/dev-confirm/:appointmentId',
  authenticate,
  authorize(['PATIENT']),
  devConfirmPayment
);

export default router;
