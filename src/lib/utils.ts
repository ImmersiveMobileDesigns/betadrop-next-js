import type { DeviceInfo, DeviceType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Detect device type from user agent
// Detect device type from user agent and optional client-side hints
export function detectDevice(userAgent: string, navigator?: any): DeviceInfo {
  const ua = userAgent.toLowerCase();

  let isIOS = /iphone|ipad|ipod/.test(ua);
  const isAndroid = /android/.test(ua);

  // Handle iPads in "Desktop Website" mode (Mac user agent but has touch)
  // This part usually requires client-side navigator.maxTouchPoints > 0
  if (!isIOS && /macintosh/.test(ua) && navigator?.maxTouchPoints > 0) {
    isIOS = true;
  }

  const isMobile = isIOS || isAndroid || /mobile/.test(ua);
  const isTablet =
    (isIOS && /ipad/.test(ua)) || (isAndroid && /tablet/.test(ua));

  let type: DeviceType = "desktop";
  if (isTablet) {
    type = "tablet";
  } else if (isMobile) {
    type = "mobile";
  }

  return {
    type,
    isIOS,
    isAndroid,
    isMobile,
    userAgent,
  };
}

// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${units[i]}`;
}

// Helper to parse date strings, assuming UTC for SQL timestamps
function parseDate(date: Date | string): Date {
  if (typeof date === "string") {
    // If it matches SQL timestamp format (YYYY-MM-DD HH:mm:ss) without timezone, assume UTC
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(date)) {
      return new Date(date.replace(" ", "T") + "Z");
    }
    return new Date(date);
  }
  return date;
}

// Format date for display
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "N/A";

  const d = parseDate(date);

  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Format date and time for display
export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "N/A";

  const d = parseDate(date);

  if (isNaN(d.getTime())) return "Invalid date";

  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  });
}

// Format relative time
export function formatRelativeTime(
  date: Date | string | null | undefined,
): string {
  // Handle null or undefined
  if (!date) return "N/A";

  const d = parseDate(date);

  // Check if date is invalid
  if (isNaN(d.getTime())) return "Invalid date";

  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  // Handle future dates
  if (diffMs < 0) {
    const absDays = Math.abs(diffDays);
    if (absDays < 1) return "Soon";
    if (absDays < 7) return `In ${absDays}d`;
    return formatDate(d);
  }

  if (diffSecs < 60) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(d);
}

// Generate iOS OTA install URL
export function generateIOSInstallUrl(manifestUrl: string): string {
  // Ensure no trailing slash, as it can break the token parameter or encoded URL
  const cleanManifestUrl = manifestUrl.replace(/\/$/, "");
  console.log("Generating iOS Install URL for:", cleanManifestUrl);

  return `itms-services://?action=download-manifest&url=${encodeURIComponent(cleanManifestUrl)}`;
}

// Generate manifest.plist content for iOS OTA
export function generateManifestPlist(options: {
  ipaUrl: string;
  bundleId: string;
  version: string;
  title: string;
  iconUrl?: string;
}): string {
  const { ipaUrl, bundleId, version, title, iconUrl } = options;

  // Apple requires both display-image (57x57) and full-size-image (512x512) for OTA
  let iconAssets = "";
  if (iconUrl) {
    iconAssets = `
        <dict>
          <key>kind</key>
          <string>display-image</string>
          <key>needs-shine</key>
          <true/>
          <key>url</key>
          <string>${escapeXml(iconUrl)}</string>
        </dict>
        <dict>
          <key>kind</key>
          <string>full-size-image</string>
          <key>needs-shine</key>
          <true/>
          <key>url</key>
          <string>${escapeXml(iconUrl)}</string>
        </dict>`;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>items</key>
  <array>
    <dict>
      <key>assets</key>
      <array>
        <dict>
          <key>kind</key>
          <string>software-package</string>
          <key>url</key>
          <string>${escapeXml(ipaUrl)}</string>
        </dict>${iconAssets}
      </array>
      <key>metadata</key>
      <dict>
        <key>bundle-identifier</key>
        <string>${escapeXml(bundleId)}</string>
        <key>bundle-version</key>
        <string>${escapeXml(version)}</string>
        <key>kind</key>
        <string>software</string>
        <key>title</key>
        <string>${escapeXml(title)}</string>
      </dict>
    </dict>
  </array>
</dict>
</plist>`;
}

// Escape XML special characters
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate a short random string for tokens
export function generateShortId(length: number = 8): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
// Copy text to clipboard with fallback for non-secure contexts
export async function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  // Try modern API first
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Failed to copy using clipboard API:", err);
    }
  }

  // Fallback to execCommand('copy')
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Ensure the textarea is not visible but part of the document
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);

    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error("Fallback copy failed:", err);
    return false;
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
