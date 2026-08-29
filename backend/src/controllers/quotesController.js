import { logActivity } from '../utils/activityLogger.js';

let quotesStore = [
  {
    id: "quote-1",
    quote: "Some people make the world beautiful simply by being in it.",
    subtext: "You are the brightest star in my night sky.",
    active: true,
  },
];

export const getQuotes = async (req, res, next) => {
  try {
    return res.json({ success: true, data: quotesStore });
  } catch (err) {
    next(err);
  }
};

export const createQuote = async (req, res, next) => {
  try {
    const { quote, text, subtext, author, active } = req.body;

    if (!quote && !text) {
      return res.status(400).json({ success: false, message: 'Quote text is required' });
    }

    const newQuote = {
      id: 'quote-' + Date.now(),
      quote: quote || text,
      subtext: subtext || '',
      author: author || '',
      active: active !== undefined ? Boolean(active) : true,
      createdAt: new Date().toISOString(),
    };

    quotesStore.unshift(newQuote);
    await logActivity('CREATE_QUOTE', 'Quote', newQuote.id);

    return res.status(201).json({ success: true, data: newQuote });
  } catch (err) {
    next(err);
  }
};

export const updateQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    const index = quotesStore.findIndex((q) => q.id === id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }

    const updated = { ...quotesStore[index], ...req.body, updatedAt: new Date().toISOString() };
    quotesStore[index] = updated;

    await logActivity('UPDATE_QUOTE', 'Quote', id);
    return res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

export const deleteQuote = async (req, res, next) => {
  try {
    const { id } = req.params;
    quotesStore = quotesStore.filter((q) => q.id !== id);

    await logActivity('DELETE_QUOTE', 'Quote', id);
    return res.json({ success: true, message: 'Quote deleted successfully' });
  } catch (err) {
    next(err);
  }
};
