import { logActivity } from '../utils/activityLogger.js';

let universeStarsStore = [
  {
    id: "star-1",
    title: "The Beginning Spark",
    date: "2024-02-14",
    category: "BEGINNING",
    description: "The moment our story started. A simple spark in an infinite universe.",
    imageUrl: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=800&auto=format&fit=crop",
    positionX: 20,
    positionY: 25,
    size: 1.4,
    brightness: 1.0,
    featured: true,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-2",
    title: "First Conversation Under Midnight Sky",
    date: "2024-03-28",
    category: "MEMORY",
    description: "Hours flew by like seconds as we talked under the stars.",
    positionX: 42,
    positionY: 18,
    size: 1.0,
    brightness: 0.9,
    featured: false,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-3",
    title: "Until I Found You - Our Anthem",
    date: "2024-05-10",
    category: "SONG",
    description: "The song that became the quiet backdrop to every late night call.",
    positionX: 65,
    positionY: 35,
    size: 1.2,
    brightness: 1.0,
    featured: true,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-4",
    title: "Open When You Miss Me",
    date: "2024-06-01",
    category: "LETTER",
    description: "A letter written across the distance for when you need a hug.",
    positionX: 30,
    positionY: 60,
    size: 1.1,
    brightness: 0.85,
    featured: false,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "star-5",
    title: "Her Favorite Color & Quiet Spot",
    date: "2024-07-20",
    category: "LITTLE_THING",
    description: "Ocean Blue and that lake bench where time slows down.",
    positionX: 75,
    positionY: 70,
    size: 1.0,
    brightness: 0.9,
    featured: true,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
];

export const getUniverseStars = async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.admin);

    let list = universeStarsStore;
    if (!isAdmin) {
      list = universeStarsStore.filter((s) => s.status === 'PUBLISHED');
    }

    return res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

export const getUniverseStarById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const star = universeStarsStore.find((s) => String(s.id) === String(id));

    if (!star) {
      return res.status(404).json({ success: false, message: 'Universe star not found' });
    }

    const isAdmin = Boolean(req.admin);
    if (!isAdmin && star.status !== 'PUBLISHED') {
      return res.status(403).json({ success: false, message: 'Star is not published' });
    }

    return res.json({ success: true, data: star });
  } catch (err) {
    next(err);
  }
};

export const createUniverseStar = async (req, res, next) => {
  try {
    const {
      title,
      date,
      category,
      description,
      imageUrl,
      positionX,
      positionY,
      size,
      brightness,
      featured,
      memoryId,
      songId,
      letterId,
      littleThingId,
      storyEventId,
      status,
    } = req.body;

    if (!title || !date) {
      return res.status(400).json({ success: false, message: 'Title and date are required' });
    }

    const newStar = {
      id: 'star-' + Date.now(),
      title,
      date,
      category: category ? category.toUpperCase() : 'MEMORY',
      description: description || '',
      imageUrl: imageUrl || null,
      positionX: positionX !== undefined ? Number(positionX) : 50,
      positionY: positionY !== undefined ? Number(positionY) : 50,
      size: size !== undefined ? Number(size) : 1.0,
      brightness: brightness !== undefined ? Number(brightness) : 1.0,
      featured: Boolean(featured),
      memoryId: memoryId || null,
      songId: songId || null,
      letterId: letterId || null,
      littleThingId: littleThingId || null,
      storyEventId: storyEventId || null,
      status: status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };

    universeStarsStore.push(newStar);
    await logActivity('CREATE_UNIVERSE_STAR', 'UniverseStar', newStar.id);

    return res.status(201).json({ success: true, data: newStar });
  } catch (err) {
    next(err);
  }
};

export const updateUniverseStar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = universeStarsStore.findIndex((s) => String(s.id) === String(id));

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Universe star not found' });
    }

    const updated = { ...universeStarsStore[index], ...req.body, updatedAt: new Date().toISOString() };
    universeStarsStore[index] = updated;

    await logActivity('UPDATE_UNIVERSE_STAR', 'UniverseStar', String(id));
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteUniverseStar = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Safety check: Deleting a star removes the UniverseStar ONLY and does NOT delete linked Memory/Song/Letter/LittleThing!
    universeStarsStore = universeStarsStore.filter((s) => String(s.id) !== String(id));

    await logActivity('DELETE_UNIVERSE_STAR', 'UniverseStar', String(id));
    return res.json({ success: true, message: 'Universe star deleted successfully' });
  } catch (err) {
    next(err);
  }
};
