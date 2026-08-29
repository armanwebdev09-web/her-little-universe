import { Router } from 'express';
import { getActivityLogs } from '../controllers/activityController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', requireAdminAuth, getActivityLogs);

export default router;
