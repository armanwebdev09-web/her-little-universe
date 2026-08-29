import { Router } from 'express';
import { getQuotes, createQuote, updateQuote, deleteQuote } from '../controllers/quotesController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getQuotes);
router.post('/', requireAdminAuth, createQuote);
router.put('/:id', requireAdminAuth, updateQuote);
router.delete('/:id', requireAdminAuth, deleteQuote);

export default router;
