import { logActivity } from '../utils/activityLogger.js';

let memoriesStore = [
  {
    id: "mem-1",
    title: "The Evening We Walked By The River",
    date: "14 AUG 2024",
    category: "SPECIAL DAYS",
    description: "The streetlights were reflected in the water, and we talked until midnight.",
    imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop",
    favorite: true,
    featured: true,
  },
  {
    id: "mem-2",
    title: "Our Rainy Afternoon Coffee",
    date: "28 SEP 2024",
    category: "MOMENTS",
    description: "Warm latte, soft rain outside, and zero rush to be anywhere.",
    imageUrl: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop",
    favorite: false,
    featured: false,
  },
];

export const getMemories = async (req, res, next) => {
  try {
    return res.json({ success: true, data: memoriesStore });
  } catch (err) {
    next(err);
  }
};

export const getMemoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const memory = memoriesStore.find((m) => m.id === id);

    if (!memory) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }

    return res.json({ success: true, data: memory });
  } catch (err) {
    next(err);
  }
};

export const createMemory = async (req, res, next) => {
  try {
    const { title, date, category, description, imageUrl, image, favorite, featured } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and date are required' });
    }

    const newMemory = {
      id: 'mem-' + Date.now(),
      title,
      date,
      category: category || 'MOMENTS',
      description: description || '',
      imageUrl: imageUrl || image || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop',
      favorite: Boolean(favorite),
      featured: Boolean(featured),
      createdAt: new Date().toISOString(),
    };

    memoriesStore.unshift(newMemory);
    await logActivity('CREATE_MEMORY', 'Memory', newMemory.id);

    return res.status(201).json({ success: true, data: newMemory });
  } catch (err) {
    next(err);
  }
};

export const updateMemory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = memoriesStore.findIndex((m) => m.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Memory not found' });
    }

    const updated = { ...memoriesStore[index], ...req.body, updatedAt: new Date().toISOString() };
    memoriesStore[index] = updated;

    await logActivity('UPDATE_MEMORY', 'Memory', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteMemory = async (req, res, next) => {
  try {
    const { id } = req.params;
    memoriesStore = memoriesStore.filter((m) => m.id !== id);

    await logActivity('DELETE_MEMORY', 'Memory', id);
    return res.json({ success: true, message: 'Memory deleted successfully' });
  } catch (err) {
    next(err);
  }
};
