import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getDoctors, getMe } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticate, getMe);
router.get('/doctors', authenticate, getDoctors);

export default router;
