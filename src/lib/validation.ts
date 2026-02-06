import type { Platform } from '@/types';

// Allowed file types
const ALLOWED_EXTENSIONS = {
  ios: ['.ipa'],
  android: ['.apk'],
} as const;

// Max file sizes (in bytes)
export const MAX_FILE_SIZES = {
  ios: 512 * 1024 * 1024,     // 512MB (safe)
  android: 512 * 1024 * 1024, // 512MB (realistic)
} as const;

// Validate file extension
export function validateFileExtension(
  fileName: string
): { valid: true; platform: Platform } | { valid: false; error: string } {
  const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));

  if (ALLOWED_EXTENSIONS.ios.includes(ext as '.ipa')) {
    return { valid: true, platform: 'ios' };
  }

  if (ALLOWED_EXTENSIONS.android.includes(ext as '.apk')) {
    return { valid: true, platform: 'android' };
  }

  return {
    valid: false,
    error: `Invalid file type. Allowed: ${[...ALLOWED_EXTENSIONS.ios, ...ALLOWED_EXTENSIONS.android].join(', ')}`,
  };
}

// Validate file size
export function validateFileSize(
  size: number,
  platform: Platform
): { valid: true } | { valid: false; error: string } {
  const maxSize = MAX_FILE_SIZES[platform];

  if (size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return {
      valid: false,
      error: `File too large. Maximum size for ${platform.toUpperCase()} is ${maxSizeMB}MB`,
    };
  }

  return { valid: true };
}

// Validate uploaded file
export function validateFile(
  fileName: string,
  fileSize: number
): { valid: true; platform: Platform } | { valid: false; error: string } {
  // Check extension first
  const extResult = validateFileExtension(fileName);
  if (!extResult.valid) {
    return extResult;
  }

  // Check size
  const sizeResult = validateFileSize(fileSize, extResult.platform);
  if (!sizeResult.valid) {
    return sizeResult;
  }

  return { valid: true, platform: extResult.platform };
}

// Validate email format
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate build name
export function validateBuildName(name: string): { valid: true } | { valid: false; error: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Build name is required' };
  }

  if (name.length > 255) {
    return { valid: false, error: 'Build name must be 255 characters or less' };
  }

  return { valid: true };
}

// Validate version string
export function validateVersion(version: string): { valid: true } | { valid: false; error: string } {
  if (!version || version.trim().length === 0) {
    return { valid: false, error: 'Version is required' };
  }

  if (version.length > 50) {
    return { valid: false, error: 'Version must be 50 characters or less' };
  }

  // Basic semver-like validation (flexible to allow various formats)
  const versionRegex = /^[\d.]+(-[\w.]+)?(\+[\w.]+)?$/;
  if (!versionRegex.test(version)) {
    return { valid: false, error: 'Invalid version format' };
  }

  return { valid: true };
}

// Sanitize filename for storage
export function sanitizeFileName(fileName: string): string {
  // Remove path components
  const baseName = fileName.split(/[/\\]/).pop() || fileName;

  // Replace potentially dangerous characters
  return baseName.replace(/[^a-zA-Z0-9._-]/g, '_');
}

// Extract bundle ID from filename (basic heuristic)
export function extractBundleIdFromFileName(fileName: string): string | null {
  // Remove file extension first to prevent matching .ipa/.apk as bundle ID components
  const nameWithoutExt = fileName.replace(/\.(ipa|apk)$/i, '');
  
  // Try to extract something that looks like a bundle ID
  // e.g., "com.example.app-1.0.0" -> "com.example.app"
  // Require at least 3 parts (e.g., com.company.app)
  const match = nameWithoutExt.match(/([a-z][a-z0-9]*(\.[a-z][a-z0-9]*){2,})/i);
  
  if (!match) {
    return null;
  }
  
  const bundleId = match[1];
  
  // Reject if it ends with common file extensions (safety check)
  if (/\.(ipa|apk|zip|tar|gz)$/i.test(bundleId)) {
    return null;
  }
  
  return bundleId;
}
