/**
 * Configuration helper for Clerk Authentication.
 * Only enables Clerk when a valid, user-provided publishable key is detected,
 * preventing connection refused / unhandled network error to invalid accounts.
 */

const rawKey = (import.meta as any).env?.VITE_CLERK_PUBLISHABLE_KEY;

function sanitizeAndValidateClerkKey(key: any): string | null {
  if (!key || typeof key !== 'string') return null;

  let cleaned = key.trim().replace(/^["']|["']$/g, '');

  // Auto-correct common typos
  if (cleaned.startsWith('k_test_')) {
    cleaned = 'p' + cleaned;
  } else if (cleaned.startsWith('k_live_')) {
    cleaned = 'p' + cleaned;
  }

  // Reject non-existent test domain placeholders
  if (
    cleaned.includes('quality-mouse-72') ||
    cleaned.includes('cXVhbGl0eS1tb3VzZS03Mi') ||
    cleaned === 'pk_test_' ||
    cleaned === 'pk_live_'
  ) {
    return null;
  }

  // Validate standard Clerk format
  if (/^pk_(test|live)_[a-zA-Z0-9$_=\-]+$/.test(cleaned)) {
    try {
      const payload = cleaned.replace(/^pk_(test|live)_/, '').replace(/\$$/, '');
      const decoded = atob(payload);
      if (decoded && decoded.length > 3) {
        return cleaned;
      }
    } catch (_) {
      return null;
    }
  }

  return null;
}

export const CLERK_PUBLISHABLE_KEY: string | null = sanitizeAndValidateClerkKey(rawKey);
export const isClerkEnabled: boolean = Boolean(CLERK_PUBLISHABLE_KEY);
