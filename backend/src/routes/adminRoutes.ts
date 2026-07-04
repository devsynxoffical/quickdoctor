import { Router } from 'express';
import {
  getAllUsers,
  getDoctors,
  getSystemStats,
  listAllAppointments,
  listAllPayments,
} from '../controllers/adminController';
import {
  approveApplication,
  getApplication,
  listApplications,
  rejectApplication,
} from '../controllers/adminApplicationController';
import {
  adminCreateSpecialty,
  adminListSpecialties,
  adminUpdateSpecialty,
} from '../controllers/specialtyController';
import {
  listCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();
const admin = [authenticate, authorize(['ADMIN'])] as const;

router.get('/users', ...admin, getAllUsers);
router.get('/doctors', ...admin, getDoctors);
router.get('/stats', ...admin, getSystemStats);
router.get('/appointments', ...admin, listAllAppointments);
router.get('/payments', ...admin, listAllPayments);

router.get('/applications', ...admin, listApplications);
router.get('/applications/:id', ...admin, getApplication);
router.patch('/applications/:id/approve', ...admin, approveApplication);
router.patch('/applications/:id/reject', ...admin, rejectApplication);

router.get('/categories', ...admin, adminListSpecialties);
router.post('/categories', ...admin, adminCreateSpecialty);
router.patch('/categories/:id', ...admin, adminUpdateSpecialty);

router.get('/coupons', ...admin, listCoupons);
router.post('/coupons', ...admin, createCoupon);
router.patch('/coupons/:id', ...admin, updateCoupon);
router.delete('/coupons/:id', ...admin, deleteCoupon);

export default router;
