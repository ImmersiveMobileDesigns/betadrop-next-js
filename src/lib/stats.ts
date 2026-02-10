export interface PlatformStats {
  totalUploads: number;
  totalDownloads: number;
  totalDevelopers: number;
  uptime: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL}/api` : '/api';

/**
 * Get platform stats from the Laravel API
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  try {
    const res = await fetch(`${API_URL}/stats/counter`, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`);
    }

    const json = await res.json();
    
    if (json.success && json.data) {
      return {
        totalUploads: Number(json.data.totalUploads) || 0,
        totalDownloads: Number(json.data.totalDownloads) || 0,
        totalDevelopers: Number(json.data.totalDevelopers) || 0,
        uptime: json.data.uptime || '99.9%',
      };
    }

    throw new Error('Invalid API response format');
  } catch (error) {
    console.error('Error fetching platform stats:', error);
    // Return fallback stats on error to prevent page crash
    return {
      totalUploads: 0,
      totalDownloads: 0,
      totalDevelopers: 0,
      uptime: '99.9%',
    };
  }
}

/**
 * Increment the upload count
 * handled by backend (UploadController/StatsService)
 */
export async function incrementUploadCount(): Promise<void> {
  // Backend handles this automatically on upload
  return Promise.resolve();
}

/**
 * Increment the download count
 * handled by backend (DownloadController/StatsService)
 */
export async function incrementDownloadCount(amount: number = 1): Promise<void> {
  // Backend handles this automatically on download
  return Promise.resolve();
}

/**
 * Increment the developer count
 * handled by backend (AuthService/StatsService)
 */
export async function incrementDeveloperCount(): Promise<void> {
  // Backend handles this automatically on registration
  return Promise.resolve();
}

export function formatCompactNumber(num: number): string {
  return Intl.NumberFormat('en-US', {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(num);
}
