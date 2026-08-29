import { getBirthdayState, getTimeUntilBirthday, getSiteDateString } from '../utils/siteTime.js';
import { logActivity } from '../utils/activityLogger.js';

let birthdayConfigStore = {
  id: "bday-singleton-1",
  birthdayDate: "2026-09-14T00:00:00",
  herName: "Kashish",
  nickname: "Kashii",
  heroMessage: "You make ordinary days special just by being there. Happy Birthday ❤️",
  birthdayLetter: "[WRITE YOUR MESSAGE HERE]\n\nHappy Birthday, Kashish! Today is a celebration of you, your smile, your laughter, and every quiet moment we share.",
  finalMessage: "All the days are special because they are the days we met. Happy Birthday, Kashish ❤️",
  confettiEnabled: true,
  openingAnimationEnabled: true,
};

// 7-Day Birthday Countdown Items Store (Day -7 to Day -1)
let countdownScheduleStore = [
  {
    id: 'cd-7',
    dayOffset: -7,
    type: 'MESSAGE',
    title: '7 Days Left • Something Special Is Coming',
    personalMessage: 'There are only 7 days left until a day that belongs to someone very special. [WRITE YOUR PERSONAL MESSAGE HERE]',
    status: 'SCHEDULED'
  },
  {
    id: 'cd-6',
    dayOffset: -6,
    type: 'LITTLE_THING',
    title: '6 Days Left • Her Smile',
    personalMessage: 'One little thing about Kashish: the way her smile changes the atmosphere around her. [WRITE YOUR PERSONAL NOTE HERE]',
    status: 'SCHEDULED'
  },
  {
    id: 'cd-5',
    dayOffset: -5,
    type: 'MEMORY',
    title: '5 Days Left • When We First Met',
    personalMessage: 'The first time we met was the beginning of everything. [ADD YOUR FIRST MEETING MEMORY DETAILS HERE]',
    status: 'SCHEDULED'
  },
  {
    id: 'cd-4',
    dayOffset: -4,
    type: 'LITTLE_THING',
    title: '4 Days Left • That Little Finger',
    personalMessage: 'That cute little finger. [WRITE YOUR PERSONAL STORY HERE]',
    status: 'SCHEDULED'
  },
  {
    id: 'cd-3',
    dayOffset: -3,
    type: 'SONG',
    title: '3 Days Left • Khat / Personal Soundtrack',
    personalMessage: 'Why this song reminds me of you. [WRITE WHY THIS SONG BELONGS HERE]',
    status: 'SCHEDULED'
  },
  {
    id: 'cd-2',
    dayOffset: -2,
    type: 'MEMORY',
    title: '2 Days Left • The Bus Ride',
    personalMessage: 'Traveling in the bus, when you laid your head on my shoulder. Sometimes the smallest moments become the biggest memories. [ADD YOUR PERSONAL NOTE HERE]',
    status: 'SCHEDULED'
  },
  {
    id: 'cd-1',
    dayOffset: -1,
    type: 'LETTER',
    title: '1 Day Left • Tomorrow Is Yours',
    personalMessage: 'Tomorrow belongs to you, Kashish. [WRITE YOUR LETTER FOR KASHISH HERE]',
    status: 'SCHEDULED'
  },
];

export const getBirthdayStatus = async (req, res, next) => {
  try {
    const state = getBirthdayState(birthdayConfigStore.birthdayDate);
    const countdown = getTimeUntilBirthday(birthdayConfigStore.birthdayDate);

    return res.json({
      success: true,
      data: {
        state,
        birthdayDate: birthdayConfigStore.birthdayDate,
        herName: birthdayConfigStore.herName,
        nickname: birthdayConfigStore.nickname,
        confettiEnabled: birthdayConfigStore.confettiEnabled,
        openingAnimationEnabled: birthdayConfigStore.openingAnimationEnabled,
        ...countdown,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBirthdayContent = async (req, res, next) => {
  try {
    const state = getBirthdayState(birthdayConfigStore.birthdayDate);
    const isAdmin = Boolean(req.admin);

    // SECURITY ENFORCEMENT: Premature requests before birthday return teaser data ONLY
    if (state === 'BEFORE_BIRTHDAY' && !isAdmin) {
      return res.json({
        success: true,
        data: {
          state: 'BEFORE_BIRTHDAY',
          herName: birthdayConfigStore.herName,
          birthdayDate: birthdayConfigStore.birthdayDate,
          teaserMessage: 'Something special is waiting for your birthday...',
        },
      });
    }

    return res.json({
      success: true,
      data: {
        state,
        herName: birthdayConfigStore.herName,
        birthdayDate: birthdayConfigStore.birthdayDate,
        heroMessage: birthdayConfigStore.heroMessage,
        birthdayLetter: birthdayConfigStore.birthdayLetter,
        finalMessage: birthdayConfigStore.finalMessage,
        confettiEnabled: birthdayConfigStore.confettiEnabled,
        openingAnimationEnabled: birthdayConfigStore.openingAnimationEnabled,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getBirthdayConfig = async (req, res, next) => {
  try {
    return res.json({ success: true, data: birthdayConfigStore });
  } catch (err) {
    next(err);
  }
};

export const updateBirthdayConfig = async (req, res, next) => {
  try {
    birthdayConfigStore = {
      ...birthdayConfigStore,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await logActivity('UPDATE_BIRTHDAY_CONFIG', 'BirthdayConfig', birthdayConfigStore.id);
    return res.json({ success: true, data: birthdayConfigStore });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Today's Countdown Item (Public API)
 * Returns today's countdown reveal ONLY when state === BEFORE_BIRTHDAY and daysRemaining <= 7
 */
export const getTodayCountdownItem = async (req, res, next) => {
  try {
    const state = getBirthdayState(birthdayConfigStore.birthdayDate);
    const countdown = getTimeUntilBirthday(birthdayConfigStore.birthdayDate);

    if (state !== 'BEFORE_BIRTHDAY' || countdown.daysRemaining > 7) {
      return res.json({
        success: true,
        data: null,
        message: 'Countdown is not currently active.',
      });
    }

    // Match dayOffset with -daysRemaining (e.g. 7 days left -> -7)
    const targetOffset = -countdown.daysRemaining;
    const item = countdownScheduleStore.find((i) => i.dayOffset === targetOffset);

    return res.json({
      success: true,
      data: item || {
        dayOffset: targetOffset,
        type: 'MESSAGE',
        title: `${Math.abs(targetOffset)} Days Left`,
        personalMessage: 'Something special is getting closer...',
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Get Released Countdown Archive (Public API)
 * Returns released past countdown days (e.g. Day -7, Day -6...).
 * Future days are locked with metadata ONLY!
 */
export const getReleasedCountdownArchive = async (req, res, next) => {
  try {
    const state = getBirthdayState(birthdayConfigStore.birthdayDate);
    const countdown = getTimeUntilBirthday(birthdayConfigStore.birthdayDate);
    const daysRemaining = countdown.daysRemaining;

    const archive = countdownScheduleStore.map((item) => {
      const isPastOrToday = Math.abs(item.dayOffset) >= daysRemaining;
      if (isPastOrToday || state !== 'BEFORE_BIRTHDAY') {
        return {
          ...item,
          locked: false,
        };
      }
      // Future day: withhold details
      return {
        id: item.id,
        dayOffset: item.dayOffset,
        locked: true,
        title: `${Math.abs(item.dayOffset)} Days Left`,
      };
    });

    return res.json({ success: true, data: archive });
  } catch (err) {
    next(err);
  }
};

/**
 * Get All Countdown Items (Admin API)
 */
export const getAllCountdownItemsAdmin = async (req, res, next) => {
  try {
    return res.json({ success: true, data: countdownScheduleStore });
  } catch (err) {
    next(err);
  }
};

/**
 * Update Countdown Schedule (Admin API)
 */
export const updateCountdownScheduleAdmin = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      countdownScheduleStore = items;
      await logActivity('UPDATE_COUNTDOWN_SCHEDULE', 'BirthdayCountdown', 'schedule-1');
    }
    return res.json({ success: true, data: countdownScheduleStore });
  } catch (err) {
    next(err);
  }
};
