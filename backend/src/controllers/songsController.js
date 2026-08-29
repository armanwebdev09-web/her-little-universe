import { getTodayDateString, getDaysDiffFromToday } from '../utils/dateUtils.js';
import { logActivity } from '../utils/activityLogger.js';

let songsStore = [
  {
    id: "song-1",
    dayNumber: 1,
    title: "Until I Found You",
    artist: "Stephen Sanchez",
    coverUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    message: "I picked this one because it reminded me of the way you make ordinary moments feel special.",
    date: getTodayDateString(),
    status: "PUBLISHED",
  },
  {
    id: "song-2",
    dayNumber: 2,
    title: "Lover",
    artist: "Taylor Swift",
    coverUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    message: "Can I go where you go? Can we always be this close?",
    date: "2024-02-15",
    status: "PUBLISHED",
  },
];

/**
 * Public Endpoint: Returns today's unlocked song ONLY
 */
export const getTodaySong = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString();
    const song = songsStore.find(
      (s) => s.date === todayStr && s.status === 'PUBLISHED'
    );

    return res.json({
      success: true,
      data: song ? sanitizePublicSong(song) : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Public Endpoint: Returns unlocked past soundtrack ONLY (date <= today & status === PUBLISHED)
 */
export const getUnlockedSongs = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString();
    const unlocked = songsStore
      .filter((s) => s.status === 'PUBLISHED' && s.date <= todayStr)
      .map(sanitizePublicSong);

    return res.json({
      success: true,
      data: unlocked,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * All Songs Endpoint: Admin gets full list with countdowns; Public gets unlocked only
 */
export const getSongs = async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.admin);
    const todayStr = getTodayDateString();

    if (!isAdmin) {
      const publicSongs = songsStore
        .filter((s) => s.status === 'PUBLISHED' && s.date <= todayStr)
        .map(sanitizePublicSong);

      return res.json({ success: true, data: publicSongs });
    }

    // Admin view includes scheduling countdowns and status indicators
    const adminSongs = songsStore.map((s) => {
      const diff = getDaysDiffFromToday(s.date);
      let countdownText = 'Available today';
      if (diff > 0) countdownText = `Releases in ${diff} day${diff > 1 ? 's' : ''}`;
      else if (diff < 0) countdownText = 'Released past';

      return {
        ...s,
        daysDiff: diff,
        countdownText,
      };
    });

    return res.json({ success: true, data: adminSongs });
  } catch (err) {
    next(err);
  }
};

/**
 * Single Song Endpoint: Enforces date protection on unauthenticated requests
 */
export const getSongById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const song = songsStore.find((s) => s.id === id);

    if (!song) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    const isAdmin = Boolean(req.admin);
    const todayStr = getTodayDateString();

    // Security Enforcement: Rejects unauthenticated requests for future songs
    if (!isAdmin && (song.status !== 'PUBLISHED' || song.date > todayStr)) {
      return res.status(403).json({
        success: false,
        message: 'This song is locked until its release date',
      });
    }

    return res.json({
      success: true,
      data: isAdmin ? song : sanitizePublicSong(song),
    });
  } catch (err) {
    next(err);
  }
};

export const createSong = async (req, res, next) => {
  try {
    const { title, artist, date, dayNumber, coverUrl, cover, audioUrl, audio, message, status } = req.body;

    if (!title || !artist || !date) {
      return res.status(400).json({ success: false, message: 'Title, artist, and date are required' });
    }

    const validStatus = ['DRAFT', 'SCHEDULED', 'PUBLISHED'].includes(status?.toUpperCase())
      ? status.toUpperCase()
      : 'PUBLISHED';

    const newSong = {
      id: 'song-' + Date.now(),
      title,
      artist,
      date,
      dayNumber: dayNumber || songsStore.length + 1,
      coverUrl: coverUrl || cover || 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop',
      audioUrl: audioUrl || audio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      message: message || '',
      status: validStatus,
      createdAt: new Date().toISOString(),
    };

    songsStore.unshift(newSong);
    await logActivity('CREATE_SONG', 'Song', newSong.id);

    return res.status(201).json({ success: true, data: newSong });
  } catch (err) {
    next(err);
  }
};

export const updateSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = songsStore.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Song not found' });
    }

    const updated = { ...songsStore[index], ...req.body, updatedAt: new Date().toISOString() };
    songsStore[index] = updated;

    await logActivity('UPDATE_SONG', 'Song', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteSong = async (req, res, next) => {
  try {
    const { id } = req.params;
    songsStore = songsStore.filter((s) => s.id !== id);

    await logActivity('DELETE_SONG', 'Song', id);
    return res.json({ success: true, message: 'Song deleted successfully' });
  } catch (err) {
    next(err);
  }
};

function sanitizePublicSong(song) {
  return {
    id: song.id,
    date: song.date,
    dayNumber: song.dayNumber,
    title: song.title,
    artist: song.artist,
    coverUrl: song.coverUrl || song.cover,
    audioUrl: song.audioUrl || song.audio,
    message: song.message,
  };
}
