import { Router } from 'express';
import {
  getBirthdayConfig,
  updateBirthdayConfig,
  getBirthdayStatus,
  getBirthdayContent,
  getTodayCountdownItem,
  getReleasedCountdownArchive,
  getAllCountdownItemsAdmin,
  updateCountdownScheduleAdmin,
} from '../controllers/birthdayController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

// Public Countdown Routes
router.get('/status', getBirthdayStatus);
router.get('/content', getBirthdayContent);
router.get('/countdown/today', getTodayCountdownItem);
router.get('/countdown/archive', getReleasedCountdownArchive);

// Admin Configuration & Countdown Planner Routes
router.get('/', getBirthdayConfig);
router.put('/', requireAdminAuth, updateBirthdayConfig);
router.get('/countdown/all', requireAdminAuth, getAllCountdownItemsAdmin);
router.put('/countdown', requireAdminAuth, updateCountdownScheduleAdmin);

export default router;
