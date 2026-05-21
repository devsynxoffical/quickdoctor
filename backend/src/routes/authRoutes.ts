import { Router } from 'express';
import { register, login, getDoctors } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/doctors', authenticate, getDoctors);

export default router;
