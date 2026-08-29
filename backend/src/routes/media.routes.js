import { Router } from 'express';
import { uploadPublicImage, uploadAudio, deleteMediaAsset } from '../controllers/mediaController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';
import { uploadImageMiddleware, uploadAudioMiddleware } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/images', requireAdminAuth, uploadImageMiddleware, uploadPublicImage);
router.post('/audio', requireAdminAuth, uploadAudioMiddleware, uploadAudio);
router.delete('/:id', requireAdminAuth, deleteMediaAsset);

export default router;
