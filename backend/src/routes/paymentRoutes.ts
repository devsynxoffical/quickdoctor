import { Router } from 'express';
import {
  createCheckoutSession,
  createGuestCheckoutSession,
  createServiceCheckout,
  devConfirmPayment,
  getCheckoutStatus,
} from '../controllers/paymentController';
import { validateCoupon } from '../controllers/couponController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/checkout', authenticate, authorize(['PATIENT']), createCheckoutSession);
router.post('/guest-checkout', createGuestCheckoutSession);
router.post('/service-checkout', authenticate, authorize(['PATIENT']), createServiceCheckout);
router.post('/validate-coupon', validateCoupon);
router.get('/status', authenticate, authorize(['PATIENT']), getCheckoutStatus);
router.post(
  '/dev-confirm/:appointmentId',
  authenticate,
  authorize(['PATIENT']),
  devConfirmPayment
);

export default router;
