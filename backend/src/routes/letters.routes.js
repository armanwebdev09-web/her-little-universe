import { Router } from 'express';
import {
  getLetters,
  getLetterById,
  createLetter,
  updateLetter,
  duplicateLetter,
  deleteLetter,
} from '../controllers/lettersController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getLetters);
router.get('/:id', getLetterById);
router.post('/', requireAdminAuth, createLetter);
router.post('/:id/duplicate', requireAdminAuth, duplicateLetter);
router.put('/:id', requireAdminAuth, updateLetter);
router.delete('/:id', requireAdminAuth, deleteLetter);

export default router;
