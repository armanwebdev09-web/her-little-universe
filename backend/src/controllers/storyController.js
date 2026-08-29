import { logActivity } from '../utils/activityLogger.js';

let storyEventsStore = [
  {
    id: "story-1",
    title: "The Day We First Met",
    date: "2024-05-12",
    category: "BEGINNING",
    description: "The first time we met was the beginning of everything. A simple moment that slowly became the start of our story.",
    imageUrl: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=800&auto=format&fit=crop",
    featured: true,
    position: 1,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "story-2",
    title: "The Bus Ride",
    date: "2024-08-14",
    category: "MILESTONE",
    description: "Travelling together in the bus when you laid your head on my shoulder. Sometimes the smallest, quietest moments become the biggest memories.",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
    featured: true,
    position: 2,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "story-3",
    title: "The Little Jealous & Angry Moments",
    date: "2024-11-02",
    category: "FUNNY",
    description: "Those tiny moments when you get angry or jealous over small things. I secretly find them so adorable because they show how much you care.",
    imageUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop",
    featured: true,
    position: 3,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "story-4",
    title: "Everything Still Ahead",
    date: "2026-12-31",
    category: "FUTURE",
    description: "All the unwritten chapters, quiet mornings, and future adventures waiting for Kashish and me.",
    imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop",
    featured: true,
    position: 4,
    status: "PUBLISHED",
    createdAt: new Date().toISOString(),
  },
];

export const getStoryEvents = async (req, res, next) => {
  try {
    const isAdmin = Boolean(req.admin);

    let list = storyEventsStore;
    if (!isAdmin) {
      list = storyEventsStore.filter((s) => s.status === 'PUBLISHED');
    }

    // Sort chronologically ascending by date, then position
    const sorted = [...list].sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return (a.position || 0) - (b.position || 0);
    });

    return res.json({
      success: true,
      data: sorted,
      totalCount: sorted.length,
    });
  } catch (err) {
    next(err);
  }
};

export const getStoryEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = storyEventsStore.find((s) => s.id === id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Story event not found' });
    }

    const isAdmin = Boolean(req.admin);
    if (!isAdmin && event.status !== 'PUBLISHED') {
      return res.status(403).json({ success: false, message: 'Story event is not published' });
    }

    return res.json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};

export const createStoryEvent = async (req, res, next) => {
  try {
    const { title, date, category, description, imageUrl, memoryId, featured, position, status } = req.body;

    if (!title || !date || !description) {
      return res.status(400).json({ success: false, message: 'Title, date, and description are required' });
    }

    const newEvent = {
      id: 'story-' + Date.now(),
      title,
      date,
      category: category ? category.toUpperCase() : 'MILESTONE',
      description,
      imageUrl: imageUrl || '',
      memoryId: memoryId || null,
      featured: Boolean(featured),
      position: position || storyEventsStore.length + 1,
      status: status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };

    storyEventsStore.push(newEvent);
    await logActivity('CREATE_STORY_EVENT', 'StoryEvent', newEvent.id);

    return res.status(201).json({ success: true, data: newEvent });
  } catch (err) {
    next(err);
  }
};

export const updateStoryEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = storyEventsStore.findIndex((s) => s.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Story event not found' });
    }

    const updated = { ...storyEventsStore[index], ...req.body, updatedAt: new Date().toISOString() };
    storyEventsStore[index] = updated;

    await logActivity('UPDATE_STORY_EVENT', 'StoryEvent', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteStoryEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    storyEventsStore = storyEventsStore.filter((s) => s.id !== id);

    await logActivity('DELETE_STORY_EVENT', 'StoryEvent', id);
    return res.json({ success: true, message: 'Story event deleted successfully' });
  } catch (err) {
    next(err);
  }
};
