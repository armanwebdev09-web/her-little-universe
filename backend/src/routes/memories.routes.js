import { Router } from 'express';
import { getMemories, getMemoryById, createMemory, updateMemory, deleteMemory } from '../controllers/memoriesController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getMemories);
router.get('/:id', getMemoryById);
router.post('/', requireAdminAuth, createMemory);
router.put('/:id', requireAdminAuth, updateMemory);
router.delete('/:id', requireAdminAuth, deleteMemory);

export default router;
