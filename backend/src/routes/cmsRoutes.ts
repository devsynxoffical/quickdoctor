import { Router } from 'express';
import {
  adminGetRegistry,
  adminSyncPages,
  adminAuditLogs,
  adminCreatePage,
  adminDeletePage,
  adminGetSettings,
  adminListNavigation,
  adminListPages,
  adminUpdatePage,
  adminResetPageTemplate,
  adminUpdateSettings,
  adminUpsertNavigation,
  getPublicNavigation,
  getPublicPage,
  getPublicSettings,
  listPublicBlogPosts,
} from '../controllers/cmsController';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/pages/:slug', getPublicPage);
router.get('/blog', listPublicBlogPosts);
router.get('/navigation', getPublicNavigation);
router.get('/settings', getPublicSettings);

router.get('/admin/pages', authenticate, authorize(['ADMIN']), adminListPages);
router.get('/admin/registry', authenticate, authorize(['ADMIN']), adminGetRegistry);
router.post('/admin/pages/sync', authenticate, authorize(['ADMIN']), adminSyncPages);
router.post('/admin/pages', authenticate, authorize(['ADMIN']), adminCreatePage);
router.patch('/admin/pages/:id', authenticate, authorize(['ADMIN']), adminUpdatePage);
router.post('/admin/pages/:id/reset-template', authenticate, authorize(['ADMIN']), adminResetPageTemplate);
router.delete('/admin/pages/:id', authenticate, authorize(['ADMIN']), adminDeletePage);
router.get('/admin/navigation', authenticate, authorize(['ADMIN']), adminListNavigation);
router.put('/admin/navigation', authenticate, authorize(['ADMIN']), adminUpsertNavigation);
router.get('/admin/settings', authenticate, authorize(['ADMIN']), adminGetSettings);
router.put('/admin/settings', authenticate, authorize(['ADMIN']), adminUpdateSettings);
router.get('/admin/audit-logs', authenticate, authorize(['ADMIN']), adminAuditLogs);

export default router;
