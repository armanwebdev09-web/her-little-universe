import { Router } from 'express';
import {
  getTodaySurprise,
  getSurpriseArchive,
  getSurprises,
  getSurpriseById,
  createSurprise,
  updateSurprise,
  deleteSurprise,
} from '../controllers/surpriseController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/today', getTodaySurprise);
router.get('/archive', getSurpriseArchive);
router.get('/', getSurprises);
router.get('/:id', getSurpriseById);
router.post('/', requireAdminAuth, createSurprise);
router.put('/:id', requireAdminAuth, updateSurprise);
router.delete('/:id', requireAdminAuth, deleteSurprise);

export default router;
