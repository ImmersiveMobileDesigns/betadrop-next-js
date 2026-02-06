import { useQuery, useMutation, UseQueryOptions, useQueryClient } from '@tanstack/react-query';
import { fetchFromLaravel } from '@/lib/api-client';
import { User, ApiResponse, Build, ShareLink, BuildFeedback, BuildAnalyticsSummary } from '@/types';

// Constants
const STALE_TIME = 2 * 60 * 1000; // 2 minutes stale time

// Types
interface Config {
  guestLinkExpiryHours: number;
  guestLinkExpiryDays: number;
  buildDefaultExpiryDays: number;
}

interface UploadResponse {
  id: string;
  url: string; 
  shortId?: string;
  expiresAt?: string;
}

interface Passkey {
  id: string;
  deviceType: string | null;
  createdAt: string;
  lastUsedAt: string | null;
}

interface GuestUpload {
  id: string;
  token: string;
  file_type: 'ipa' | 'apk';
  app_name: string;
  package_name: string;
  version: string;
  file_size: number;
  created_at: string;
  expires_at: string;
  download_count?: number;
}

interface InstallDataBuild {
  type: 'build';
  build: Build;
  shareLink: ShareLink | null;
  defaultShortId: string | null;
  iconUrl: string;
  downloadUrl: string;
  manifestUrl: string;
}

interface InstallDataGuest {
  type: 'guest';
  id: string;
  shortId: string | null;
  appName: string;
  packageName: string;
  version: string;
  fileType: 'ipa' | 'apk';
  fileSize: number;
  createdAt: string;
  expiresAt?: string;
  provisionedDevices: string[];
  permissions: string[];
  deviceFamilies: string[];
  minOsVersion?: string;
  iconUrl: string;
  downloadUrl: string;
  manifestUrl: string;
}

type InstallData = InstallDataBuild | InstallDataGuest;

interface GuestAppData {
  id: string;
  appName: string;
  packageName: string;
  version: string;
  fileType: 'ipa' | 'apk';
  fileSize: number;
  createdAt: string;
  expiresAt?: string;
  buildNumber?: string;
  minOsVersion?: string;
  iconUrl?: string;
  permissions?: string[];
  provisionedDevices?: string[];
  deviceFamilies?: string[];
}

interface PlatformStats {
  totalUploads: number;
  totalDownloads: number;
  totalDevelopers: number;
  uptime: string;
}

// ========================================
// Query Hooks
// ========================================

// 1. User Session
export const useUserSession = (options?: Omit<UseQueryOptions<User | null>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const response = await fetchFromLaravel<ApiResponse<{ user: User | null }>>('/api/auth/session');
      if (response.success && response.data?.user) {
        return response.data.user;
      }
      return null;
    },
    staleTime: STALE_TIME,
    ...options,
  });
};

// 2. App Config
export const useAppConfig = () => {
  return useQuery({
    queryKey: ['config'],
    queryFn: async () => {
      const response = await fetchFromLaravel<ApiResponse<Config>>('/api/config');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to load configuration');
    },
    staleTime: 1000 * 60 * 60, // 1 hour for config
  });
};

// 3. Platform Stats (home page)
export const usePlatformStats = () => {
  return useQuery({
    queryKey: ['platform-stats'],
    queryFn: async () => {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBase}/api/stats/counter`, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const json = await response.json();
      
      if (json.success && json.data) {
        return {
          totalUploads: Number(json.data.totalUploads) || 0,
          totalDownloads: Number(json.data.totalDownloads) || 0,
          totalDevelopers: Number(json.data.totalDevelopers) || 0,
          uptime: json.data.uptime || '99.9%',
        } as PlatformStats;
      }
      
      // Return default stats if API fails
      return {
        totalUploads: 0,
        totalDownloads: 0,
        totalDevelopers: 0,
        uptime: '99.9%',
      } as PlatformStats;
    },
    staleTime: STALE_TIME,
  });
};

// Pagination Response Interface
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface BuildsResponse {
    builds: PaginatedResponse<Build>;
    stats: {
        total_builds: number;
        total_downloads: number;
        total_size: number;
    };
}

// 4. User Builds List
export const useBuilds = (enabled: boolean = true, page: number = 1, filter: 'all' | 'ios' | 'android' = 'all') => {
  return useQuery({
    queryKey: ['builds', page, filter],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.set('page', page.toString());
      
      if (filter !== 'all') {
        queryParams.set('platform', filter);
      }

      const response = await fetchFromLaravel<{ success: boolean; data: BuildsResponse }>(`/api/builds?${queryParams.toString()}`);
      if (response.success && response.data) {
        return response.data;
      }
      return {
          builds: { 
            data: [], 
            current_page: 1, 
            last_page: 1, 
            per_page: 10, 
            total: 0, 
            from: 0,
            to: 0,
            first_page_url: '', 
            last_page_url: '', 
            next_page_url: null, 
            prev_page_url: null 
          },
          stats: { total_builds: 0, total_downloads: 0, total_size: 0 }
      };
    },
    staleTime: STALE_TIME,
    enabled,
    placeholderData: (previousData) => previousData, // Keep previous data while fetching new page
  });
};

// 4. Single Build Details
export const useBuild = (buildId: string | null) => {
  return useQuery({
    queryKey: ['build', buildId],
    queryFn: async () => {
      if (!buildId) throw new Error('Build ID is required');
      const response = await fetchFromLaravel<{ success: boolean; data: { build: Build } }>(`/api/builds/${buildId}`);
      if (response.success && response.data?.build) {
        return response.data.build;
      }
      throw new Error('Build not found');
    },
    staleTime: STALE_TIME,
    enabled: !!buildId,
  });
};

// 5. Build Analytics
export const useBuildAnalytics = (buildId: string) => {
  return useQuery({
    queryKey: ['build-analytics', buildId],
    queryFn: async () => {
      const response = await fetchFromLaravel<{ success: boolean; data: { summary: BuildAnalyticsSummary } }>(`/api/builds/${buildId}/analytics`);
      if (response.success && response.data?.summary) {
        return response.data.summary;
      }
      throw new Error('Failed to load analytics');
    },
    staleTime: STALE_TIME,
    enabled: !!buildId,
  });
};

// 6. Build Share Links
export const useBuildShareLinks = (buildId: string) => {
  return useQuery({
    queryKey: ['build-share-links', buildId],
    queryFn: async () => {
      const response = await fetchFromLaravel<{ success: boolean; data: ShareLink[] }>(`/api/builds/${buildId}/share-links`);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    staleTime: STALE_TIME,
    enabled: !!buildId,
  });
};

// 7. Build Feedback
export const useBuildFeedback = (buildId: string) => {
  return useQuery({
    queryKey: ['build-feedback', buildId],
    queryFn: async () => {
      const response = await fetchFromLaravel<{ success: boolean; data: BuildFeedback[] }>(`/api/builds/${buildId}/feedback`);
      if (response.success && response.data) {
        return response.data;
      }
      return [];
    },
    staleTime: STALE_TIME,
    enabled: !!buildId,
  });
};

// 8. Install Page Data
export const useInstallData = (id: string | null, token: string | null) => {
  return useQuery({
    queryKey: ['install', id, token],
    queryFn: async () => {
      if (!id) throw new Error('ID is required');
      const queryParams = new URLSearchParams();
      if (token) queryParams.set('token', token);
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const url = `${apiBase}/api/install/${id}${queryParams.toString() ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });
      
      const json = await response.json();
      
      if (!response.ok) {
        throw { 
          reason: json.reason || 'not_found', 
          appName: json.appName,
          status: response.status 
        };
      }
      
      return json.data as InstallData;
    },
    staleTime: STALE_TIME,
    enabled: !!id,
    retry: false, // Don't retry on error (expired links, etc.)
  });
};

// 9. Guest App Data
export const useGuestAppData = (token: string | null) => {
  return useQuery({
    queryKey: ['guest-app', token],
    queryFn: async () => {
      if (!token) throw new Error('Token is required');
      
      const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${apiBase}/api/guest/app/${token}`, {
        credentials: 'include',
      });
      
      if (response.status === 410) throw new Error('Link Expired');
      if (response.status === 404) throw new Error('App Not Found');
      if (!response.ok) throw new Error('Failed to load');
      
      const json = await response.json();
      
      if (json.success) {
        return json.data as GuestAppData;
      }
      throw new Error(json.error || 'Failed to load app data');
    },
    staleTime: STALE_TIME,
    enabled: !!token,
    retry: false,
  });
};

// 10. Passkeys List
export const usePasskeys = () => {
  return useQuery({
    queryKey: ['passkeys'],
    queryFn: async () => {
      const response = await fetchFromLaravel<{ success: boolean; data: { passkeys: Passkey[] } }>('/api/auth/passkey/register?action=list');
      if (response.success && response.data?.passkeys) {
        return response.data.passkeys;
      }
      return [];
    },
    staleTime: STALE_TIME,
  });
};

// 11. Guest Uploads for Claiming
export const useGuestUploads = (deviceId: string | null, claimToken?: string) => {
  return useQuery({
    queryKey: ['guest-uploads', deviceId, claimToken],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (claimToken) params.set('claimToken', claimToken);
      if (deviceId) params.set('deviceId', deviceId);
      
      const path = `/api/guest/claim${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetchFromLaravel<{ success: boolean; data: { available: GuestUpload[]; claimed: GuestUpload[] } }>(path);
      
      if (response.success && response.data) {
        return response.data;
      }
      return { available: [], claimed: [] };
    },
    staleTime: STALE_TIME,
  });
};

// ========================================
// Mutation Helpers
// ========================================

// Upload Mutation Helper - returns a promise but allows progress tracking via callback
const uploadFile = async (
  endpoint: string, 
  formData: FormData, 
  onProgress?: (progress: number) => void
): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
    // Ensure endpoint starts with slash and handle base url
    const url = endpoint.startsWith('http') ? endpoint : `${apiBase}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress((event.loaded / event.total) * 100);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject('Invalid response');
        }
      } else {
        try {
          const res = JSON.parse(xhr.responseText);
          reject(res.error || 'Upload failed');
        } catch {
          reject('Upload failed');
        }
      }
    };

    xhr.onerror = () => reject('Network error');
    
    xhr.open('POST', url);
    xhr.withCredentials = true;
    xhr.send(formData);
  });
};

// Guest Upload Mutation
export const useGuestUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, onProgress }: { formData: FormData; onProgress?: (p: number) => void }) => {
      const response = await uploadFile('/api/guest/upload', formData, onProgress);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Upload failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-uploads'] });
    },
  });
};

// Authenticated Upload Mutation
export const useAuthUpload = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ formData, onProgress }: { formData: FormData; onProgress?: (p: number) => void }) => {
      const response = await uploadFile('/api/upload', formData, onProgress);
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.error || 'Upload failed');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['builds'] });
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] });
    },
  });
};

// Update Build Mutation
export const useUpdateBuild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const response = await fetchFromLaravel<{ success: boolean; data: Build }>(`/api/builds/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error('Failed to update build');
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['build', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['builds'] });
      queryClient.invalidateQueries({ queryKey: ['platform-stats'] });
    },
  });
};

// Export types for use in components
export type { Config, UploadResponse, Passkey, GuestUpload, InstallData, GuestAppData, PlatformStats };
