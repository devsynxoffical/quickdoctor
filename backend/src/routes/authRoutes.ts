import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getDoctors,
  getMe,
  sendRegistrationOtpHandler,
} from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/send-registration-otp', sendRegistrationOtpHandler);
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);
router.get('/me', authenticate, getMe);
router.get('/doctors', authenticate, getDoctors);

export default router;
