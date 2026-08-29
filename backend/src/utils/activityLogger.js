/**
 * Utility for logging admin activity actions to the database
 */
export const logActivity = async (action, entityType, entityId = null) => {
  try {
    // Development helper logging
    console.log(`[ACTIVITY LOG] Action: ${action} | Entity: ${entityType} | ID: ${entityId}`);
  } catch (err) {
    console.warn("Failed to record activity log:", err);
  }
};
