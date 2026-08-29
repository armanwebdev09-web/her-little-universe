/**
 * SECRET FOLDER AUTHENTICATION SERVICE ABSTRACTION
 * 
 * SECURITY WARNING:
 * Temporary frontend authentication only.
 * Production authentication MUST be server-side (POST /api/auth/secret).
 * Do NOT check hardcoded credentials directly in production.
 */

// Development placeholder key for temporary testing
const DEV_TEMPORARY_SECRET = "secret";

/**
 * Authenticates the secret folder key.
 * Structures request flow for seamless future backend API integration.
 * 
 * @param {string} password 
 * @returns {Promise<{ success: boolean, token?: string }>}
 */
export async function authenticateSecret(password) {
  // Simulate network latency as if calling a backend API endpoint
  await new Promise((resolve) => setTimeout(resolve, 400));

  if (!password || typeof password !== 'string') {
    throw new Error("That doesn't seem to be the right key.");
  }

  // Normalize input string
  const sanitizedInput = password.trim().toLowerCase();

  // Temporary development check: accepts "secret", "love", or "universe" during dev
  if (
    sanitizedInput === DEV_TEMPORARY_SECRET ||
    sanitizedInput === "love" ||
    sanitizedInput === "universe"
  ) {
    return {
      success: true,
      token: "dev-session-temp-token-" + Date.now(),
    };
  }

  // Generic security failure message
  throw new Error("That doesn't seem to be the right key.");
}
