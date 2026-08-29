import { getTodayDateString } from '../utils/dateUtils.js';
import { logActivity } from '../utils/activityLogger.js';

let surprisesStore = [
  {
    id: "surprise-1",
    date: getTodayDateString(),
    type: "MESSAGE",
    title: "A Small Thought For You Today",
    message: "I hope today brings you as many smiles as you bring into my life every single day.",
    buttonText: "Open Surprise ❤️",
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "surprise-2",
    date: "2024-02-14",
    type: "QUESTION",
    title: "A Little Riddle For You",
    question: "Do you remember the very first place we sat down and talked for hours?",
    answer: "The quiet coffee shop corner near the park on that rainy Tuesday afternoon.",
    buttonText: "Reveal Answer",
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
];

export const getTodaySurprise = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString();
    const surprise = surprisesStore.find(
      (s) => s.date === todayStr && s.status === 'PUBLISHED'
    );

    return res.json({
      success: true,
      data: surprise || null,
    });
  } catch (err) {
    next(err);
  }
};

export const getSurpriseArchive = async (req, res, next) => {
  try {
    const todayStr = getTodayDateString();
    const archive = surprisesStore.filter(
      (s) => s.status === 'PUBLISHED' && s.date < todayStr
    );

    return res.json({
      success: true,
      data: archive,
    });
  } catch (err) {
    next(err);
  }
};

export const getSurprises = async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.admin);
    const todayStr = getTodayDateString();

    if (!isAdmin) {
      const publicSurprises = surprisesStore.filter(
        (s) => s.status === 'PUBLISHED' && s.date <= todayStr
      );
      return res.json({ success: true, data: publicSurprises });
    }

    return res.json({ success: true, data: surprisesStore });
  } catch (err) {
    next(err);
  }
};

export const getSurpriseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const surprise = surprisesStore.find((s) => s.id === id);

    if (!surprise) {
      return res.status(404).json({ success: false, message: 'Surprise not found' });
    }

    const isAdmin = Boolean(req.admin);
    const todayStr = getTodayDateString();

    // Security Enforcement: Rejects unauthenticated requests for future surprises
    if (!isAdmin && (surprise.status !== 'PUBLISHED' || surprise.date > todayStr)) {
      return res.status(403).json({
        success: false,
        message: 'This surprise is locked until its release date',
      });
    }

    return res.json({ success: true, data: surprise });
  } catch (err) {
    next(err);
  }
};

export const createSurprise = async (req, res, next) => {
  try {
    const { date, type, title, message, imageUrl, songId, memoryId, letterId, question, answer, buttonText, status } = req.body;

    if (!date || !title) {
      return res.status(400).json({ success: false, message: 'Date and title are required' });
    }

    // Duplicate check for active published surprise on the same date
    const existingPublished = surprisesStore.find((s) => s.date === date && s.status === 'PUBLISHED');
    if (existingPublished && status === 'PUBLISHED') {
      return res.status(400).json({
        success: false,
        message: `A published surprise already exists for ${date}. Save as DRAFT or edit existing.`,
      });
    }

    const newSurprise = {
      id: 'surprise-' + Date.now(),
      date,
      type: type ? type.toUpperCase() : 'MESSAGE',
      title,
      message: message || '',
      imageUrl: imageUrl || '',
      songId: songId || null,
      memoryId: memoryId || null,
      letterId: letterId || null,
      question: question || '',
      answer: answer || '',
      buttonText: buttonText || 'Open Surprise ❤️',
      status: status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };

    surprisesStore.unshift(newSurprise);
    await logActivity('CREATE_SURPRISE', 'DailySurprise', newSurprise.id);

    return res.status(201).json({ success: true, data: newSurprise });
  } catch (err) {
    next(err);
  }
};

export const updateSurprise = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = surprisesStore.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Surprise not found' });
    }

    const updated = { ...surprisesStore[index], ...req.body, updatedAt: new Date().toISOString() };
    surprisesStore[index] = updated;

    await logActivity('UPDATE_SURPRISE', 'DailySurprise', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteSurprise = async (req, res, next) => {
  try {
    const { id } = req.params;
    surprisesStore = surprisesStore.filter((s) => s.id !== id);

    await logActivity('DELETE_SURPRISE', 'DailySurprise', id);
    return res.json({ success: true, message: 'Surprise deleted successfully' });
  } catch (err) {
    next(err);
  }
};
