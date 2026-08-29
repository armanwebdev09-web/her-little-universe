import { Router } from 'express';
import { getUniverseStars, getUniverseStarById, createUniverseStar, updateUniverseStar, deleteUniverseStar } from '../controllers/universeController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getUniverseStars);
router.get('/:id', getUniverseStarById);
router.post('/', requireAdminAuth, createUniverseStar);
router.put('/:id', requireAdminAuth, updateUniverseStar);
router.delete('/:id', requireAdminAuth, deleteUniverseStar);

export default router;
