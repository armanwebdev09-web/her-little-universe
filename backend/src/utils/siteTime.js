/**
 * Centralized Site Time & Birthday State Engine
 * Default Timezone: Asia/Kolkata (configurable via SITE_TIMEZONE)
 */

export const getSiteTimezone = () => {
  return process.env.SITE_TIMEZONE || 'Asia/Kolkata';
};

/**
 * Returns current Date object respecting SITE_TIMEZONE or DEV_TIME_OVERRIDE (development mode only)
 */
export const getSiteNow = () => {
  if (process.env.NODE_ENV !== 'production' && process.env.DEV_TIME_OVERRIDE) {
    return new Date(process.env.DEV_TIME_OVERRIDE);
  }
  return new Date();
};

/**
 * Returns today's YYYY-MM-DD string in site timezone
 */
export const getSiteDateString = () => {
  const timezone = getSiteTimezone();
  const now = getSiteNow();
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now);
  } catch (err) {
    return now.toISOString().split('T')[0];
  }
};

/**
 * Returns birthday state: BEFORE_BIRTHDAY, BIRTHDAY, or AFTER_BIRTHDAY
 */
export const getBirthdayState = (birthdayDateStr) => {
  if (!birthdayDateStr) return 'BEFORE_BIRTHDAY';

  const todayStr = getSiteDateString();
  const bdayStr = birthdayDateStr.split('T')[0];

  if (todayStr < bdayStr) {
    return 'BEFORE_BIRTHDAY';
  } else if (todayStr === bdayStr) {
    return 'BIRTHDAY';
  } else {
    return 'AFTER_BIRTHDAY';
  }
};

/**
 * Calculates remaining countdown metrics (Days, Hours, Minutes, Seconds)
 */
export const getTimeUntilBirthday = (birthdayDateStr) => {
  const now = getSiteNow().getTime();
  const target = new Date(birthdayDateStr).getTime();
  const diff = Math.max(0, target - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    daysRemaining: days,
    hoursRemaining: hours,
    minutesRemaining: minutes,
    secondsRemaining: seconds,
    totalDiffMs: diff,
  };
};
