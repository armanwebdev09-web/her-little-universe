/**
 * ADMIN PANEL SERVICE ABSTRACTION
 * 
 * Interacts with real backend API endpoints via `api.js`.
 * Falls back gracefully to dev dataset if backend server is not reachable.
 */

import { api } from './api';
import { songsData } from '../data/songsData';
import { memoriesData } from '../data/memoriesData';
import { featuredLetterData, standardLetters, openWhenLetters } from '../data/lettersData';
import { universeStarsData } from '../data/universeData';
import { secretPhotosData } from '../data/secretPhotosData';
import { siteConfig } from '../data/siteConfig';

// Temporary local state wrappers for dev fallback testing
let localSongs = [...songsData];
let localMemories = [...memoriesData];
let localLetters = [featuredLetterData, ...standardLetters, ...openWhenLetters];
let localUniverseStars = [...universeStarsData];
let localSecretItems = [...secretPhotosData];
let localQuotes = [
  { id: 1, text: siteConfig.quote.text, subtext: siteConfig.quote.subtext, active: true },
];
let localSettings = {
  siteName: "Her Little Universe",
  herName: siteConfig.herName,
  yourName: "Your Favorite Person",
  birthdayDate: siteConfig.birthdayDate,
};

export const adminService = {
  // Songs CRUD
  getSongs: async () => {
    try {
      const res = await api.getSongs();
      if (res.success && Array.isArray(res.data)) return res.data;
    } catch (e) {}
    return [...localSongs];
  },
  saveSong: async (song) => {
    try {
      if (song.id && typeof song.id === 'string' && song.id.startsWith('song-')) {
        await api.updateSong(song.id, song);
      } else {
        await api.createSong(song);
      }
      return true;
    } catch (e) {}
    if (song.id) {
      localSongs = localSongs.map((s) => (s.id === song.id ? song : s));
    } else {
      const newSong = { ...song, id: 'song-' + Date.now() };
      localSongs.unshift(newSong);
    }
    return true;
  },
  deleteSong: async (id) => {
    try {
      await api.deleteSong(id);
      return true;
    } catch (e) {}
    localSongs = localSongs.filter((s) => s.id !== id);
    return true;
  },

  // Memories CRUD
  getMemories: async () => {
    try {
      const res = await api.getMemories();
      if (res.success && Array.isArray(res.data)) return res.data;
    } catch (e) {}
    return [...localMemories];
  },
  saveMemory: async (memory) => {
    try {
      if (memory.id && typeof memory.id === 'string' && memory.id.startsWith('mem-')) {
        await api.updateMemory(memory.id, memory);
      } else {
        await api.createMemory(memory);
      }
      return true;
    } catch (e) {}
    if (memory.id) {
      localMemories = localMemories.map((m) => (m.id === memory.id ? memory : m));
    } else {
      const newMemory = { ...memory, id: 'mem-' + Date.now() };
      localMemories.unshift(newMemory);
    }
    return true;
  },
  deleteMemory: async (id) => {
    try {
      await api.deleteMemory(id);
      return true;
    } catch (e) {}
    localMemories = localMemories.filter((m) => m.id !== id);
    return true;
  },

  // Letters CRUD
  getLetters: async () => {
    try {
      const res = await api.getLetters();
      if (res.success && Array.isArray(res.data)) return res.data;
    } catch (e) {}
    return [...localLetters];
  },
  saveLetter: async (letter) => {
    try {
      if (letter.id && typeof letter.id === 'string' && letter.id.startsWith('let-')) {
        await api.updateLetter(letter.id, letter);
      } else {
        await api.createLetter(letter);
      }
      return true;
    } catch (e) {}
    if (letter.id) {
      localLetters = localLetters.map((l) => (l.id === letter.id ? letter : l));
    } else {
      const newLetter = { ...letter, id: 'let-' + Date.now() };
      localLetters.unshift(newLetter);
    }
    return true;
  },
  deleteLetter: async (id) => {
    try {
      await api.deleteLetter(id);
      return true;
    } catch (e) {}
    localLetters = localLetters.filter((l) => l.id !== id);
    return true;
  },

  // Quotes CRUD
  getQuotes: async () => {
    try {
      const res = await api.getQuotes();
      if (res.success && Array.isArray(res.data)) return res.data;
    } catch (e) {}
    return [...localQuotes];
  },
  saveQuote: async (quote) => {
    try {
      if (quote.id && typeof quote.id === 'string' && quote.id.startsWith('quote-')) {
        await api.updateQuote(quote.id, quote);
      } else {
        await api.createQuote(quote);
      }
      return true;
    } catch (e) {}
    if (quote.id) {
      localQuotes = localQuotes.map((q) => (q.id === quote.id ? quote : q));
    } else {
      const newQuote = { ...quote, id: 'quote-' + Date.now() };
      localQuotes.unshift(newQuote);
    }
    return true;
  },
  deleteQuote: async (id) => {
    try {
      await api.deleteQuote(id);
      return true;
    } catch (e) {}
    localQuotes = localQuotes.filter((q) => q.id !== id);
    return true;
  },

  // Universe Stars CRUD
  getUniverseStars: async () => {
    try {
      const res = await api.getUniverseStars();
      if (res.success && Array.isArray(res.data)) return res.data;
    } catch (e) {}
    return [...localUniverseStars];
  },
  saveUniverseStar: async (star) => {
    try {
      if (star.id) {
        await api.updateUniverseStar(star.id, star);
      } else {
        await api.createUniverseStar(star);
      }
      return true;
    } catch (e) {}
    if (star.id) {
      localUniverseStars = localUniverseStars.map((s) => (s.id === star.id ? star : s));
    } else {
      const newStar = { ...star, id: Date.now() };
      localUniverseStars.push(newStar);
    }
    return true;
  },
  deleteUniverseStar: async (id) => {
    try {
      await api.deleteUniverseStar(id);
      return true;
    } catch (e) {}
    localUniverseStars = localUniverseStars.filter((s) => s.id !== id);
    return true;
  },

  // Secret Items CRUD
  getSecretItems: async () => {
    try {
      const res = await api.getSecretItems();
      if (res.success && Array.isArray(res.items)) return res.items;
    } catch (e) {}
    return [...localSecretItems];
  },
  saveSecretItem: async (item) => {
    if (item.id) {
      localSecretItems = localSecretItems.map((i) => (i.id === item.id ? item : i));
    } else {
      const newItem = { ...item, id: Date.now() };
      localSecretItems.unshift(newItem);
    }
    return true;
  },
  deleteSecretItem: async (id) => {
    localSecretItems = localSecretItems.filter((i) => i.id !== id);
    return true;
  },

  // Activity Logs
  getActivityLogs: async () => {
    try {
      const res = await api.getActivityLogs();
      if (res.success && Array.isArray(res.data)) return res.data;
    } catch (e) {}
    return [
      { id: 1, action: "Added a new song", time: "2 hours ago", icon: "🎵" },
      { id: 2, action: "Updated a memory", time: "Yesterday", icon: "📸" },
      { id: 3, action: "Created a letter", time: "3 days ago", icon: "💌" },
      { id: 4, action: "Updated birthday message", time: "5 days ago", icon: "🎂" },
    ];
  },

  // Settings
  getSettings: async () => ({ ...localSettings }),
  saveSettings: async (settings) => {
    localSettings = { ...localSettings, ...settings };
    return true;
  },
};
