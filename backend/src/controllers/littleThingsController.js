import { logActivity } from '../utils/activityLogger.js';

let littleThingsStore = [
  {
    id: "thing-1",
    category: "FAVORITE",
    title: "Favorite Color",
    value: "Ocean Blue",
    description: "Because according to you, everything looks infinitely calmer in this shade.",
    imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    icon: "🎨",
    featured: true,
    position: 1,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "thing-2",
    category: "NICKNAME",
    title: "Favorite Name For You",
    value: "Sunshine",
    description: "The name that somehow fits every quiet morning.",
    icon: "☀️",
    featured: true,
    position: 2,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "thing-3",
    category: "LITTLE_HABIT",
    title: "Tiny Habit I Notice",
    value: "The subtle nose twitch when you laugh really hard",
    description: "You probably don't realize you do it, but it's my favorite part of any conversation.",
    icon: "😊",
    featured: false,
    position: 3,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "thing-4",
    category: "INSIDE_JOKE",
    title: "That One Joke",
    value: "You know exactly which one",
    description: "We can't say it out loud without both of us bursting out laughing.",
    icon: "🤫",
    featured: false,
    position: 4,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "thing-5",
    category: "PLACE",
    title: "Our Quiet Spot",
    value: "The park bench by the lake",
    description: "Where time always seems to slow down just for us.",
    icon: "📍",
    featured: true,
    position: 5,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
];

export const getLittleThings = async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.admin);

    let list = littleThingsStore;
    if (!isAdmin) {
      list = littleThingsStore.filter((t) => t.status === 'PUBLISHED');
    }

    const sorted = [...list].sort((a, b) => (a.position || 0) - (b.position || 0));

    return res.json({
      success: true,
      data: sorted,
      totalCount: sorted.length,
    });
  } catch (err) {
    next(err);
  }
};

export const getRandomLittleThing = async (req, res, next) => {
  try {
    const published = littleThingsStore.filter((t) => t.status === 'PUBLISHED');
    if (published.length === 0) {
      return res.json({ success: true, data: null });
    }

    const randomIndex = Math.floor(Math.random() * published.length);
    const item = published[randomIndex];

    return res.json({
      success: true,
      data: item,
    });
  } catch (err) {
    next(err);
  }
};

export const getLittleThingById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const item = littleThingsStore.find((t) => t.id === id);

    if (!item) {
      return res.status(404).json({ success: false, message: 'Little thing not found' });
    }

    const isAdmin = Boolean(req.admin);
    if (!isAdmin && item.status !== 'PUBLISHED') {
      return res.status(403).json({ success: false, message: 'Item is not published' });
    }

    return res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

export const createLittleThing = async (req, res, next) => {
  try {
    const { category, title, value, description, imageUrl, icon, songId, memoryId, storyEventId, favorite, featured, position, status } = req.body;

    if (!title || !value) {
      return res.status(400).json({ success: false, message: 'Title and value are required' });
    }

    const newThing = {
      id: 'thing-' + Date.now(),
      category: category ? category.toUpperCase() : 'FAVORITE',
      title,
      value,
      description: description || '',
      imageUrl: imageUrl || '',
      icon: icon || '🌷',
      songId: songId || null,
      memoryId: memoryId || null,
      storyEventId: storyEventId || null,
      favorite: Boolean(favorite),
      featured: Boolean(featured),
      position: position || littleThingsStore.length + 1,
      status: status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };

    littleThingsStore.push(newThing);
    await logActivity('CREATE_LITTLE_THING', 'LittleThing', newThing.id);

    return res.status(201).json({ success: true, data: newThing });
  } catch (err) {
    next(err);
  }
};

export const updateLittleThing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = littleThingsStore.findIndex((t) => t.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Little thing not found' });
    }

    const updated = { ...littleThingsStore[index], ...req.body, updatedAt: new Date().toISOString() };
    littleThingsStore[index] = updated;

    await logActivity('UPDATE_LITTLE_THING', 'LittleThing', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteLittleThing = async (req, res, next) => {
  try {
    const { id } = req.params;
    littleThingsStore = littleThingsStore.filter((t) => t.id !== id);

    await logActivity('DELETE_LITTLE_THING', 'LittleThing', id);
    return res.json({ success: true, message: 'Little thing deleted successfully' });
  } catch (err) {
    next(err);
  }
};
