/**
 * Device ID utility for tracking guest uploads across sessions.
 * This generates a unique device ID stored in localStorage to ensure
 * only the uploader can see and claim their guest uploads.
 */

const DEVICE_ID_KEY = 'betadrop_device_id';

/**
 * Generates a UUID v4-like string
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Gets the device ID from localStorage, or creates a new one if it doesn't exist.
 * Returns null if running on the server or localStorage is not available.
 */
export function getDeviceId(): string | null {
  // Check if we're in a browser environment
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    let deviceId = localStorage.getItem(DEVICE_ID_KEY);
    
    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    // localStorage might be blocked in some browsers
    console.warn('Failed to access localStorage for device ID:', error);
    return null;
  }
}

/**
 * Clears the device ID from localStorage.
 * Useful for testing or if user wants to reset their device identity.
 */
export function clearDeviceId(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    localStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.warn('Failed to clear device ID:', error);
  }
}
