import { Router } from 'express';
import {
  getStoryEvents,
  getStoryEventById,
  createStoryEvent,
  updateStoryEvent,
  deleteStoryEvent,
} from '../controllers/storyController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getStoryEvents);
router.get('/:id', getStoryEventById);
router.post('/', requireAdminAuth, createStoryEvent);
router.put('/:id', requireAdminAuth, updateStoryEvent);
router.delete('/:id', requireAdminAuth, deleteStoryEvent);

export default router;
