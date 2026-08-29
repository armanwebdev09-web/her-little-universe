/**
 * HER LITTLE UNIVERSE - SITE CONFIGURATION
 * 
 * Central site configuration for Kashish's Little Universe.
 */

export const siteConfig = {
  // Personal Details
  herName: "Kashish",
  nickname: "Kashii",

  // Birthday date for dynamic countdown (14 September 2026)
  birthdayDate: "2026-09-14T00:00:00",

  // Config switches for testing
  allowBypassLock: false,
  allowBypassBirthdayLock: false,

  // Today's song configuration (Null by default, populates from Admin database)
  todaysSong: null,

  // Central Core Emotional Quote
  quote: {
    text: "You are not special only because today is your birthday.",
    subtext: "You make ordinary days special just by being there.",
  },

  // Navigation items
  navItems: [
    { label: "Home", href: "#hero", active: true },
    { label: "Our Story", href: "/our-story", comingSoon: false },
    { label: "Little Things", href: "/little-things", comingSoon: false },
    { label: "Surprise", href: "/surprise", comingSoon: false },
    { label: "Memories", href: "/memories", comingSoon: false },
    { label: "Songs", href: "/songs", comingSoon: false },
    { label: "Letters", href: "/letters", comingSoon: false },
    { label: "Our Universe", href: "/our-universe", comingSoon: false },
    { label: "Secret", href: "/secret", comingSoon: false, isSpecial: true },
    { label: "Birthday", href: "/birthday", comingSoon: false, isScroll: false },
  ]
};
