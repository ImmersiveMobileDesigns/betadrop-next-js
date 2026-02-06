/**
 * Short ID generation utilities for URL-friendly tokens
 * Uses base62 encoding (alphanumeric) for compact, URL-safe IDs
 */

// Base62 character set: 0-9, a-z, A-Z
const BASE62_CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * Generates a short, URL-friendly token
 * @param length - Length of the token (default: 10)
 * @returns A base62 encoded random string
 */
export function generateShortToken(length: number = 10): string {
  const crypto = require('crypto');
  const randomBytes = crypto.randomBytes(length);
  let result = '';
  
  for (let i = 0; i < length; i++) {
    // Use modulo to map each byte to a base62 character
    result += BASE62_CHARS[randomBytes[i] % 62];
  }
  
  return result;
}

/**
 * Generates a short, URL-friendly token with a prefix
 * @param prefix - Prefix for the token (e.g., 'b' for builds, 'g' for guest)
 * @param length - Length of the random part (default: 8)
 * @returns A prefixed base62 encoded string
 */
export function generatePrefixedToken(prefix: string, length: number = 8): string {
  return `${prefix}${generateShortToken(length)}`;
}

/**
 * Validates if a string is a valid short token format
 * @param token - Token to validate
 * @returns true if valid base62 string
 */
export function isValidShortToken(token: string): boolean {
  if (!token || token.length < 6 || token.length > 20) return false;
  return /^[0-9a-zA-Z]+$/.test(token);
}
