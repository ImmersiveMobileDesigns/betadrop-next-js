'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInstallData } from '@/hooks/queries';
import { detectDevice, generateIOSInstallUrl } from '@/lib/utils';
import type { DeviceInfo } from '@/types';
import AppInstallView from '@/components/shared/AppInstallView';
import LinkExpiredView from '@/components/shared/LinkExpiredView';

function InstallPageContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('i') || searchParams.get('i'); // Support both id and token as query params
  const token = searchParams.get('token');

  const [device, setDevice] = useState<DeviceInfo | null>(null);

  // Detect device on mount
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setDevice(detectDevice(userAgent));
  }, []);

  // Use React Query hook for install data - prevents duplicate calls
  const { data, isLoading, error } = useInstallData(id, token);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Handle errors (expired links, not found, etc.)
  if (error) {
    const errorData = error as { reason?: string; appName?: string };
    const reason = errorData.reason || 'not_found';
    return <LinkExpiredView type={reason as any} appName={errorData.appName} />;
  }

  if (!id) {
    return <LinkExpiredView type="not_found" />;
  }

  if (!data || !device) return null;

  // Unified handling for both guest uploads and regular builds
  const isGuestUpload = data.type === 'guest';
  
  // Extract common values based on type
  const appData = isGuestUpload ? {
    // Guest upload format
    appName: data.appName,
    packageName: data.packageName || 'com.example.app',
    version: data.version,
    fileType: data.fileType as 'ipa' | 'apk',
    fileSize: data.fileSize,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
    buildNumber: undefined,
    minOSVersion: data.minOsVersion,
    supportedArchitectures: undefined,
    isDebuggable: undefined,
    deviceFamilies: data.deviceFamilies,
    iconUrl: data.iconUrl,
    provisionedDevices: data.provisionedDevices ?? [],
    permissions: data.permissions ?? [],
  } : {
    // Build format
    appName: data.build.name,
    packageName: data.build.bundle_id || 'com.example.app',
    version: data.build.version,
    fileType: data.build.platform === 'ios' ? 'ipa' as const : 'apk' as const,
    fileSize: data.build.file_size,
    createdAt: new Date(data.build.created_at).toISOString(),
    expiresAt: data.build.expires_at ? new Date(data.build.expires_at).toISOString() : undefined,
    buildNumber: data.build.build_number || undefined,
    minOSVersion: undefined,
    supportedArchitectures: undefined,
    isDebuggable: undefined,
    deviceFamilies: undefined,
    iconUrl: data.iconUrl,
    customAccentColor: data.build.custom_accent_color,
    customBackgroundColor: data.build.custom_background_color,
    customBrandName: data.build.custom_brand_name,
    customLogoPath: data.build.custom_logo_path,
    customMessage: data.build.custom_message,
    customThemeMode: data.build.custom_theme_mode,
    hidePlatformBranding: !!data.build.hide_platform_branding,
    provisionedDevices: typeof data.build.provisioned_devices === 'string' 
      ? JSON.parse(data.build.provisioned_devices) 
      : data.build.provisioned_devices,
    permissions: data.build.permissions,
    isDeprecated: !!data.build.is_deprecated,
    notes: data.build.notes,
  };

  // Get URLs from response (works for both types)
  const { downloadUrl, manifestUrl } = data;
  const installPageUrl = window.location.href;
  const iosInstallUrl = generateIOSInstallUrl(manifestUrl);

  // Determine share token for sharing
  const shareToken = isGuestUpload 
    ? (data.shortId || id)
    : (data.shareLink?.short_id || data.defaultShortId || token || id);

  // Build ID for feedback etc
  const buildId = isGuestUpload ? data.id : data.build.id;

  return (
    <AppInstallView
      data={appData}
      installPageUrl={installPageUrl}
      downloadUrl={downloadUrl}
      manifestUrl={manifestUrl}
      iosInstallUrl={iosInstallUrl}
      deviceType={device.type}
      isMobile={device.isMobile}
      buildId={buildId}
      shareToken={shareToken ?? undefined} 
      enableFeedback={!isGuestUpload} // Only enable feedback for regular builds
    />
  );
}

export default function InstallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InstallPageContent />
    </Suspense>
  );
}

