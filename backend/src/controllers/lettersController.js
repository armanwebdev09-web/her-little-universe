import { getTodayDateString } from '../utils/dateUtils.js';
import { logActivity } from '../utils/activityLogger.js';

let lettersStore = [
  {
    id: "let-1",
    title: "Open When You Miss Me",
    type: "OPEN_WHEN",
    date: "2024-06-01",
    unlockDate: "2024-06-01",
    preview: "Only open this when you really need a warm hug across the distance...",
    openingLine: "My dearest,",
    content: "Whenever you feel like distance is getting too hard, remember that every single second brings us closer to being together again. Look up at the sky; we share the exact same moon.",
    closing: "Forever & always yours,",
    signature: "Me",
    locked: false,
    isPrivate: false,
    featured: true,
    position: 1,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "let-2",
    title: "Open When You Need A Smile",
    type: "OPEN_WHEN",
    date: "2024-07-15",
    unlockDate: "2024-07-15",
    preview: "A little reminder of why you make every day bright...",
    openingLine: "Hey gorgeous,",
    content: "If today was tough, take a deep breath. You are the strongest, sweetest person I know, and your smile is literally my favorite thing in the universe.",
    closing: "With all my love,",
    signature: "Me",
    locked: false,
    isPrivate: false,
    featured: false,
    position: 2,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "let-3",
    title: "Open On Our Anniversary",
    type: "SPECIAL",
    date: "2026-10-10",
    unlockDate: "2026-10-10",
    preview: "A special milestone letter waiting for our special day...",
    openingLine: "My love,",
    content: "THIS CONTENT MUST REMAIN LOCKED UNTIL THE ANNIVERSARY DATE.",
    closing: "Yours eternally,",
    signature: "Me",
    locked: true,
    isPrivate: false,
    featured: true,
    position: 3,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "let-4",
    title: "A Private Secret Letter",
    type: "SECRET",
    date: "2024-09-01",
    unlockDate: "2024-09-01",
    preview: "Strictly for your eyes inside the secret space...",
    openingLine: "Only for you,",
    content: "This is a private letter protected inside our secret room.",
    closing: "Sealed with love,",
    signature: "Me",
    locked: false,
    isPrivate: true,
    featured: false,
    position: 4,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
];

export const getLetters = async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.admin);
    const hasSecretAuth = Boolean(req.secretAuth);
    const todayStr = getTodayDateString();

    let list = lettersStore;

    // Filter secret & draft items if not authorized
    if (!isAdmin) {
      list = list.filter((l) => {
        if (l.status !== 'PUBLISHED') return false;
        if (l.isPrivate && !hasSecretAuth) return false;
        return true;
      });
    }

    // Sanitize locked letters to withhold sensitive content server-side!
    const sanitized = list.map((l) => {
      const isLocked = !isAdmin && (l.locked || (l.unlockDate && l.unlockDate > todayStr));

      if (isLocked) {
        return {
          id: l.id,
          title: l.title,
          type: l.type,
          date: l.date,
          unlockDate: l.unlockDate,
          preview: l.preview || 'This letter is locked until its release date.',
          locked: true,
          isPrivate: l.isPrivate,
          featured: l.featured,
          position: l.position,
          // Content, openingLine, closing, signature, and attached IDs are strictly withheld!
        };
      }

      return l;
    });

    return res.json({ success: true, data: sanitized });
  } catch (err) {
    next(err);
  }
};

export const getLetterById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const letter = lettersStore.find((l) => l.id === id);

    if (!letter) {
      return res.status(404).json({ success: false, message: 'Letter not found' });
    }

    const isAdmin = Boolean(req.admin);
    const hasSecretAuth = Boolean(req.secretAuth);
    const todayStr = getTodayDateString();

    // Security Check: Secret letters require Secret Auth or Admin
    if (letter.isPrivate && !hasSecretAuth && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Secret authentication required to access this letter' });
    }

    // Security Check: Locked letters reject content retrieval via direct ID lookup!
    const isLocked = !isAdmin && (letter.locked || (letter.unlockDate && letter.unlockDate > todayStr));
    if (isLocked) {
      return res.status(403).json({
        success: false,
        message: 'This letter is locked until its unlock date',
      });
    }

    return res.json({ success: true, data: letter });
  } catch (err) {
    next(err);
  }
};

export const createLetter = async (req, res, next) => {
  try {
    const { title, type, date, unlockDate, preview, openingLine, content, closing, signature, locked, isPrivate, featured, position, songId, memoryId, littleThingId } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }

    const newLetter = {
      id: 'let-' + Date.now(),
      title,
      type: type ? type.toUpperCase() : 'OPEN_WHEN',
      date: date || getTodayDateString(),
      unlockDate: unlockDate || date || getTodayDateString(),
      preview: preview || (content ? content.slice(0, 60) + '...' : ''),
      openingLine: openingLine || 'My dearest,',
      content,
      closing: closing || 'Always yours,',
      signature: signature || 'Me',
      locked: Boolean(locked),
      isPrivate: Boolean(isPrivate),
      featured: Boolean(featured),
      position: position || lettersStore.length + 1,
      songId: songId || null,
      memoryId: memoryId || null,
      littleThingId: littleThingId || null,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };

    lettersStore.unshift(newLetter);
    await logActivity('CREATE_LETTER', 'Letter', newLetter.id);

    return res.status(201).json({ success: true, data: newLetter });
  } catch (err) {
    next(err);
  }
};

export const duplicateLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const original = lettersStore.find((l) => l.id === id);

    if (!original) {
      return res.status(404).json({ success: false, message: 'Letter not found' });
    }

    const duplicated = {
      ...original,
      id: 'let-' + Date.now(),
      title: `${original.title} (Copy)`,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
    };

    lettersStore.unshift(duplicated);
    await logActivity('DUPLICATE_LETTER', 'Letter', duplicated.id);

    return res.status(201).json({ success: true, data: duplicated });
  } catch (err) {
    next(err);
  }
};

export const updateLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = lettersStore.findIndex((l) => l.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Letter not found' });
    }

    const updated = { ...lettersStore[index], ...req.body, updatedAt: new Date().toISOString() };
    lettersStore[index] = updated;

    await logActivity('UPDATE_LETTER', 'Letter', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteLetter = async (req, res, next) => {
  try {
    const { id } = req.params;
    lettersStore = lettersStore.filter((l) => l.id !== id);

    await logActivity('DELETE_LETTER', 'Letter', id);
    return res.json({ success: true, message: 'Letter deleted successfully' });
  } catch (err) {
    next(err);
  }
};
