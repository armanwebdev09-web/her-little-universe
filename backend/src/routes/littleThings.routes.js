import { Router } from 'express';
import {
  getLittleThings,
  getRandomLittleThing,
  getLittleThingById,
  createLittleThing,
  updateLittleThing,
  deleteLittleThing,
} from '../controllers/littleThingsController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/random', getRandomLittleThing);
router.get('/', getLittleThings);
router.get('/:id', getLittleThingById);
router.post('/', requireAdminAuth, createLittleThing);
router.put('/:id', requireAdminAuth, updateLittleThing);
router.delete('/:id', requireAdminAuth, deleteLittleThing);

export default router;
