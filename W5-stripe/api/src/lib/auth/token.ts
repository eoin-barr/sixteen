import { v4 as uuid } from 'uuid';
import { createHash } from 'crypto';

export function computeTokenHash(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export function generateNewAccessToken() {
  return uuid();
}

export function ensureDefaultExpiresAt(expiresAt: Date | null | undefined) {
  return expiresAt || new Date(new Date().getTime() + 100 * 365 * 24 * 60 * 60 * 1000);
}

export function createSecureToken(expiresAt: Date | null | undefined) {
  const et = ensureDefaultExpiresAt(expiresAt);
  const token = generateNewAccessToken();
  const hash = computeTokenHash(token);
  const displayName = `${token.slice(0, 3)}****${token.slice(-3, -1)}`;
  return {
    token,
    hash,
    displayName,
    expiresAt: et,
  };
}
