/**
 * HER LITTLE UNIVERSE - CENTRALIZED FRONTEND API CLIENT
 * 
 * Includes credentials ('include') to automatically attach HTTP-only cookies.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Include HTTP-only cookies in requests
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'An error occurred during API request');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export const api = {
  // Health
  getHealth: () => request('/health'),

  // Admin Auth
  loginAdmin: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  getAdminMe: () => request('/auth/me'),

  logoutAdmin: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  // Secret Folder Auth & CRUD
  unlockSecret: (password) =>
    request('/secret/unlock', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  lockSecret: () =>
    request('/secret/lock', {
      method: 'POST',
    }),

  getSecretItems: (type = '') => request(`/secret/items${type ? `?type=${type}` : ''}`),
  getSecretItemById: (id) => request(`/secret/items/${id}`),
  createSecretItem: (item) => request('/secret/items', { method: 'POST', body: JSON.stringify(item) }),
  updateSecretItem: (id, item) => request(`/secret/items/${id}`, { method: 'PUT', body: JSON.stringify(item) }),
  deleteSecretItem: (id) => request(`/secret/items/${id}`, { method: 'DELETE' }),

  // Songs CRUD & Daily Unlock
  getTodaySong: () => request('/songs/today'),
  getUnlockedSongs: () => request('/songs/unlocked'),
  getSongs: () => request('/songs'),
  createSong: (song) => request('/songs', { method: 'POST', body: JSON.stringify(song) }),
  updateSong: (id, song) => request(`/songs/${id}`, { method: 'PUT', body: JSON.stringify(song) }),
  deleteSong: (id) => request(`/songs/${id}`, { method: 'DELETE' }),

  // Memories CRUD
  getMemories: () => request('/memories'),
  createMemory: (memory) => request('/memories', { method: 'POST', body: JSON.stringify(memory) }),
  updateMemory: (id, memory) => request(`/memories/${id}`, { method: 'PUT', body: JSON.stringify(memory) }),
  deleteMemory: (id) => request(`/memories/${id}`, { method: 'DELETE' }),

  // Letters CRUD & Duplicate
  getLetters: () => request('/letters'),
  createLetter: (letter) => request('/letters', { method: 'POST', body: JSON.stringify(letter) }),
  duplicateLetter: (id) => request(`/letters/${id}/duplicate`, { method: 'POST' }),
  updateLetter: (id, letter) => request(`/letters/${id}`, { method: 'PUT', body: JSON.stringify(letter) }),
  deleteLetter: (id) => request(`/letters/${id}`, { method: 'DELETE' }),

  // Quotes CRUD
  getQuotes: () => request('/quotes'),
  createQuote: (quote) => request('/quotes', { method: 'POST', body: JSON.stringify(quote) }),
  updateQuote: (id, quote) => request(`/quotes/${id}`, { method: 'PUT', body: JSON.stringify(quote) }),
  deleteQuote: (id) => request(`/quotes/${id}`, { method: 'DELETE' }),

  // Universe Stars CRUD
  getUniverseStars: () => request('/universe'),
  createUniverseStar: (star) => request('/universe', { method: 'POST', body: JSON.stringify(star) }),
  updateUniverseStar: (id, star) => request(`/universe/${id}`, { method: 'PUT', body: JSON.stringify(star) }),
  deleteUniverseStar: (id) => request(`/universe/${id}`, { method: 'DELETE' }),

  // Birthday Engine Endpoints
  getBirthdayStatus: () => request('/birthday/status'),
  getBirthdayContent: () => request('/birthday/content'),
  getBirthdayConfig: () => request('/birthday'),
  updateBirthdayConfig: (config) => request('/birthday', { method: 'PUT', body: JSON.stringify(config) }),
  getTodayCountdown: () => request('/birthday/countdown/today'),
  getCountdownArchive: () => request('/birthday/countdown/archive'),
  getAllCountdownAdmin: () => request('/birthday/countdown/all'),
  updateCountdownAdmin: (items) => request('/birthday/countdown', { method: 'PUT', body: JSON.stringify({ items }) }),

  // Daily Surprises Endpoints
  getTodaySurprise: () => request('/surprises/today'),
  getSurpriseArchive: () => request('/surprises/archive'),
  getSurprises: () => request('/surprises'),
  getSurpriseById: (id) => request(`/surprises/${id}`),
  createSurprise: (surprise) => request('/surprises', { method: 'POST', body: JSON.stringify(surprise) }),
  updateSurprise: (id, surprise) => request(`/surprises/${id}`, { method: 'PUT', body: JSON.stringify(surprise) }),
  deleteSurprise: (id) => request(`/surprises/${id}`, { method: 'DELETE' }),

  // Our Story Timeline Endpoints
  getStoryEvents: () => request('/story'),
  getStoryEventById: (id) => request(`/story/${id}`),
  createStoryEvent: (event) => request('/story', { method: 'POST', body: JSON.stringify(event) }),
  updateStoryEvent: (id, event) => request(`/story/${id}`, { method: 'PUT', body: JSON.stringify(event) }),
  deleteStoryEvent: (id) => request(`/story/${id}`, { method: 'DELETE' }),

  // The Little Things Endpoints
  getLittleThings: () => request('/little-things'),
  getRandomLittleThing: () => request('/little-things/random'),
  getLittleThingById: (id) => request(`/little-things/${id}`),
  createLittleThing: (thing) => request('/little-things', { method: 'POST', body: JSON.stringify(thing) }),
  updateLittleThing: (id, thing) => request(`/little-things/${id}`, { method: 'PUT', body: JSON.stringify(thing) }),
  deleteLittleThing: (id) => request(`/little-things/${id}`, { method: 'DELETE' }),

  // Activity Logs
  getActivityLogs: () => request('/activity'),
};
