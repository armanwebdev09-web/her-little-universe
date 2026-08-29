/**
 * Timezone-aware Date Utility Module
 * Default timezone: Asia/Kolkata (configurable via SITE_TIMEZONE env var)
 */

export const getSiteTimezone = () => {
  return process.env.SITE_TIMEZONE || 'Asia/Kolkata';
};

/**
 * Returns today's date in YYYY-MM-DD format based on SITE_TIMEZONE
 */
export const getTodayDateString = () => {
  const timezone = getSiteTimezone();
  const now = new Date();
  
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(now); // Output format: YYYY-MM-DD
  } catch (err) {
    return now.toISOString().split('T')[0];
  }
};

/**
 * Calculate difference in days between target date string (YYYY-MM-DD) and today
 */
export const getDaysDiffFromToday = (targetDateStr) => {
  const todayStr = getTodayDateString();
  const today = new Date(todayStr);
  const target = new Date(targetDateStr);
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
