import { Router } from 'express';
import { getSongs, getTodaySong, getUnlockedSongs, getSongById, createSong, updateSong, deleteSong } from '../controllers/songsController.js';
import { requireAdminAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/today', getTodaySong);
router.get('/unlocked', getUnlockedSongs);
router.get('/', getSongs);
router.get('/:id', getSongById);
router.post('/', requireAdminAuth, createSong);
router.put('/:id', requireAdminAuth, updateSong);
router.delete('/:id', requireAdminAuth, deleteSong);

export default router;
