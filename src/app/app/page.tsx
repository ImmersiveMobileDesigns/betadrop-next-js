'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Smartphone, AlertTriangle } from 'lucide-react';
import AppInstallView, { AppData } from '@/components/shared/AppInstallView';
import { useGuestAppData } from '@/hooks/queries';
import { generateIOSInstallUrl, detectDevice } from '@/lib/utils';
import type { DeviceInfo } from '@/types';

type PageAppData = AppData & { id: string };

function InstallPageContent() {
  const searchParams = useSearchParams();
  // Support both 'i' (new shorter format) and 'token' (legacy) query parameters
  const token = searchParams.get('i') || searchParams.get('token');
  
  const [device, setDevice] = useState<DeviceInfo | null>(null);

  // Detect device on mount
  useEffect(() => {
    if (token) {
      const detectedDevice = detectDevice(window.navigator.userAgent, window.navigator);
      setDevice(detectedDevice);
    }
  }, [token]);

  // Use React Query hook - prevents duplicate API calls
  const { data, isLoading, error } = useGuestAppData(token);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary-900/20 via-transparent to-transparent" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 relative z-10"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center animate-pulse">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -inset-2 bg-primary-500/20 rounded-3xl blur-xl animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-white font-medium mb-1">Loading App Details</p>
            <p className="text-white/50 text-sm">Please wait...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Error state
  const errorMessage = !token ? 'Invalid Link' : error instanceof Error ? error.message : (error ? 'App Not Found' : null);
  
  if (errorMessage || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent" />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-sm w-full p-8 bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/10 relative z-10"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500/30 to-orange-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12">
            <AlertTriangle className="w-10 h-10 text-red-400 -rotate-12" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">{errorMessage || 'App Not Found'}</h1>
          <p className="text-white/60 text-sm leading-relaxed">
            This installation link is no longer valid or the file has been removed. Please request a new link from the developer.
          </p>
        </motion.div>
      </div>
    );
  }

  // Transform data for AppInstallView
  const appData: PageAppData = {
    id: data.id,
    appName: data.appName,
    packageName: data.packageName,
    version: data.version,
    fileType: data.fileType,
    fileSize: data.fileSize,
    createdAt: data.createdAt,
    expiresAt: data.expiresAt,
    buildNumber: data.buildNumber,
    minOSVersion: data.minOsVersion,
    customLogoPath: data.iconUrl || null,
    permissions: data.permissions,
    provisionedDevices: data.provisionedDevices,
    deviceFamilies: data.deviceFamilies,
  };

  // URLs and platform detection
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const installPageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const downloadUrl = `${apiBase}/api/guest/download/${token}`;
  const manifestUrl = `${apiBase}/api/guest/manifest/${token}`;
  const iosInstallUrl = generateIOSInstallUrl(manifestUrl);

  return (
    <AppInstallView
      data={appData}
      installPageUrl={installPageUrl}
      downloadUrl={downloadUrl}
      manifestUrl={manifestUrl}
      iosInstallUrl={iosInstallUrl}
      deviceType={device?.type}
      isMobile={device?.isMobile}
      buildId={data.id}
      shareToken={token!}
      enableFeedback={false}
    />
  );
}

export default function InstallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <InstallPageContent />
    </Suspense>
  );
}
