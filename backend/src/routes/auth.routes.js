import { Router } from 'express';
import { loginAdmin, logoutAdmin, getAdminMe } from '../controllers/authController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.get('/me', requireAdminAuth, getAdminMe);

export default router;
