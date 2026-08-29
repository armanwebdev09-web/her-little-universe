import jwt from 'jsonwebtoken';
import { logActivity } from '../utils/activityLogger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-jwt-super-secret-key-change-me-in-production';

// Development accepted secret keys
const DEV_SECRET_KEYS = ['secret', 'love', 'universe', 'sofia', 'kashish', 'kashii'];

const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);

const secretCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 24 * 60 * 60 * 1000,
};

let secretItemsStore = [
  {
    id: "secret-1",
    type: "PHOTO",
    title: "Late Night Laughs",
    date: "14 AUG 2025",
    caption: "A candid moment taken right when we couldn't stop laughing.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    locked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "secret-2",
    type: "PHOTO",
    title: "Quiet Morning Coffee",
    date: "28 SEP 2025",
    caption: "Warm tea, morning sunlight, and slow conversations.",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    locked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "secret-3",
    type: "VIDEO",
    title: "Our Trip to the Beach",
    date: "05 OCT 2025",
    caption: "The sound of the ocean and your laughter on a quiet evening.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    locked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "secret-4",
    type: "LETTER",
    title: "A Letter for Midnight",
    date: "12 NOV 2025",
    caption: "For when the world gets quiet and you need a reminder of how loved you are.",
    content: "If you are reading this in the quiet hours of the night, know that somewhere under this same sky, someone is holding you in their softest thoughts. You have brought so much light into my life.",
    locked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "secret-5",
    type: "NOTE",
    title: "Things I Never Said",
    date: "01 JAN 2026",
    caption: "Small thoughts that slipped past my lips, but stayed in my heart.",
    content: "I catch myself smiling whenever your name pops up on my phone. It's the small things about you that make everything feel right.",
    locked: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "secret-6",
    type: "MEMORY",
    title: "Hidden Star under the Starlight",
    date: "14 FEB 2026",
    caption: "A private memory under the quiet night sky.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
    locked: false,
    createdAt: new Date().toISOString(),
  },
];

export const unlockSecret = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== 'string') {
      return res.status(401).json({
        success: false,
        message: "Not quite. Try again ❤️",
      });
    }

    const sanitized = password.trim().toLowerCase();

    if (DEV_SECRET_KEYS.includes(sanitized)) {
      const token = jwt.sign(
        { role: 'secret_guest', unlockedAt: Date.now() },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('secret_token', token, secretCookieOptions);

      return res.json({
        success: true,
        message: 'Secret Space unlocked',
      });
    }

    return res.status(401).json({
      success: false,
      message: "Not quite. Try again ❤️",
    });
  } catch (error) {
    next(error);
  }
};

export const lockSecret = async (req, res) => {
  res.clearCookie('secret_token', {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
  });

  return res.json({
    success: true,
    message: 'Secret Space locked',
  });
};

export const getSecretItems = async (req, res, next) => {
  try {
    // SECURITY CACHE CONTROL: Prevent browser or CDN caching of private secret items
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const { type } = req.query;
    let filtered = secretItemsStore;

    if (type) {
      filtered = secretItemsStore.filter((item) => item.type === type.toUpperCase());
    }

    return res.json({
      success: true,
      items: filtered,
    });
  } catch (err) {
    next(err);
  }
};

export const getSecretItemById = async (req, res, next) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');

    const { id } = req.params;
    const item = secretItemsStore.find((i) => i.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Secret item not found' });
    }

    return res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const createSecretItem = async (req, res, next) => {
  try {
    const { type, title, caption, content, date, image, videoUrl } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and date are required' });
    }

    const newItem = {
      id: 'secret-' + Date.now(),
      type: type ? type.toUpperCase() : 'PHOTO',
      title,
      caption: caption || '',
      content: content || '',
      date,
      image: image || '',
      videoUrl: videoUrl || '',
      locked: false,
      createdAt: new Date().toISOString(),
    };

    secretItemsStore.unshift(newItem);
    await logActivity('CREATE_SECRET_ITEM', 'SecretItem', newItem.id);

    return res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

export const updateSecretItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = secretItemsStore.findIndex((i) => i.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Secret item not found' });
    }

    const updated = { ...secretItemsStore[index], ...req.body, updatedAt: new Date().toISOString() };
    secretItemsStore[index] = updated;

    await logActivity('UPDATE_SECRET_ITEM', 'SecretItem', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteSecretItem = async (req, res, next) => {
  try {
    const { id } = req.params;
    secretItemsStore = secretItemsStore.filter((i) => i.id !== id);

    await logActivity('DELETE_SECRET_ITEM', 'SecretItem', id);
    return res.json({ success: true, message: 'Secret item deleted successfully' });
  } catch (err) {
    next(err);
  }
};
