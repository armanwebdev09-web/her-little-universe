let recentActivityLogs = [
  { id: 1, action: "Added a new song", entityType: "Song", time: "2 hours ago", icon: "🎵" },
  { id: 2, action: "Updated a memory", entityType: "Memory", time: "Yesterday", icon: "📸" },
  { id: 3, action: "Created a letter", entityType: "Letter", time: "3 days ago", icon: "💌" },
  { id: 4, action: "Updated birthday message", entityType: "BirthdayConfig", time: "5 days ago", icon: "🎂" },
];

export const getActivityLogs = async (req, res, next) => {
  try {
    return res.json({ success: true, data: recentActivityLogs });
  } catch (err) {
    next(err);
  }
};
