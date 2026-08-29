import { Router } from 'express';
import {
  unlockSecret,
  lockSecret,
  getSecretItems,
  getSecretItemById,
  createSecretItem,
  updateSecretItem,
  deleteSecretItem,
} from '../controllers/secretController.js';
import { uploadPrivateImage, uploadPrivateVideo, getPrivateMediaAsset } from '../controllers/mediaController.js';
import { requireSecretAuth, requireAdminAuth } from '../middleware/authMiddleware.js';
import { uploadImageMiddleware, uploadVideoMiddleware } from '../middleware/uploadMiddleware.js';

const router = Router();

router.post('/unlock', unlockSecret);
router.post('/lock', lockSecret);

// Protected Secret Reader Endpoints (Requires Secret Auth)
router.get('/items', requireSecretAuth, getSecretItems);
router.get('/items/:id', requireSecretAuth, getSecretItemById);

// Admin Secret Management Endpoints (Requires Admin Auth)
router.post('/items', requireAdminAuth, createSecretItem);
router.put('/items/:id', requireAdminAuth, updateSecretItem);
router.delete('/items/:id', requireAdminAuth, deleteSecretItem);

// Private Media Uploads (Requires Admin Auth)
router.post('/media/images', requireAdminAuth, uploadImageMiddleware, uploadPrivateImage);
router.post('/media/videos', requireAdminAuth, uploadVideoMiddleware, uploadPrivateVideo);

// Protected Private Media Access (Requires Secret Auth)
router.get('/media/:id', requireSecretAuth, getPrivateMediaAsset);

export default router;
