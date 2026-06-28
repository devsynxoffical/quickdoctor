import { Router } from 'express';
import { register, login, forgotPassword, resetPassword, getDoctors } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/doctors', authenticate, getDoctors);

export default router;
