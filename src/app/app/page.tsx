"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Smartphone, AlertTriangle } from "lucide-react";
import AppInstallView, { AppData } from "@/components/shared/AppInstallView";
import { useGuestAppData } from "@/hooks/queries";
import { generateIOSInstallUrl, detectDevice } from "@/lib/utils";
import type { DeviceInfo } from "@/types";

type PageAppData = AppData & { id: string };

const DEFAULT_OG_IMAGE = "/og-image.png";
const SITE_NAME = "BetaDrop";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://betadrop.app";

/**
 * Dynamically updates document head meta tags for SEO.
 * Reuse of the logic from install/page.tsx
 */
function useInstallPageSEO(
  appName?: string,
  iconUrl?: string,
  platform?: string,
) {
  useEffect(() => {
    if (!appName) return;

    const platformLabel =
      platform === "ipa" ? "iOS" : platform === "apk" ? "Android" : "";
    const title = `Install ${appName}${platformLabel ? ` (${platformLabel})` : ""} | ${SITE_NAME}`;
    const description = `Install ${appName} on your ${platformLabel || "mobile"} device via ${SITE_NAME}. Fast, free beta app distribution — no TestFlight required.`;

    // Determine OG image: use app icon if available, fallback to default
    const ogImage =
      iconUrl && iconUrl.trim() !== ""
        ? iconUrl
        : `${APP_URL}${DEFAULT_OG_IMAGE}`;
    const currentUrl =
      typeof window !== "undefined" ? window.location.href : APP_URL;

    // Set document title
    document.title = title;

    // Helper to set or create a meta tag
    const setMeta = (attribute: string, key: string, content: string) => {
      let element = document.querySelector(
        `meta[${attribute}="${key}"]`,
      ) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard meta tags
    setMeta("name", "description", description);
    setMeta(
      "name",
      "keywords",
      `${appName}, beta app, install ${appName}, ${platformLabel} beta testing, app distribution, BetaDrop`,
    );

    // Open Graph tags
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", ogImage);
    setMeta("property", "og:image:alt", `${appName} - App Icon`);
    setMeta("property", "og:url", currentUrl);
    setMeta("property", "og:type", "website");
    setMeta("property", "og:site_name", SITE_NAME);

    // Twitter Card tags
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", ogImage);
    setMeta("name", "twitter:image:alt", `${appName} - App Icon`);

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${SITE_NAME} - Free iOS & Android Beta App Distribution`;
      setMeta(
        "name",
        "description",
        "The free, simple way to distribute iOS and Android beta apps. Upload IPA or APK files and share install links with your testers. No TestFlight required.",
      );

      // Remove dynamically added OG/Twitter tags
      const dynamicSelectors = [
        'meta[property="og:title"]',
        'meta[property="og:description"]',
        'meta[property="og:image"]',
        'meta[property="og:image:alt"]',
        'meta[property="og:url"]',
        'meta[property="og:type"]',
        'meta[property="og:site_name"]',
        'meta[name="twitter:card"]',
        'meta[name="twitter:title"]',
        'meta[name="twitter:description"]',
        'meta[name="twitter:image"]',
        'meta[name="twitter:image:alt"]',
      ];
      dynamicSelectors.forEach((selector) => {
        const el = document.querySelector(selector);
        if (el) el.remove();
      });
    };
  }, [appName, iconUrl, platform]);
}

function InstallPageContent() {
  const searchParams = useSearchParams();
  // Support both 'i' (new shorter format) and 'token' (legacy) query parameters
  const token = searchParams.get("i") || searchParams.get("token");

  const [device, setDevice] = useState<DeviceInfo | null>(null);

  // Detect device on mount
  useEffect(() => {
    if (token) {
      const detectedDevice = detectDevice(window.navigator.userAgent);
      setDevice(detectedDevice);
    }
  }, [token]);

  // Use React Query hook - prevents duplicate API calls
  const { data, isLoading, error } = useGuestAppData(token);

  // Apply dynamic SEO meta tags
  useInstallPageSEO(data?.appName, data?.iconUrl, data?.fileType);

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
  const errorMessage = !token
    ? "Invalid Link"
    : error instanceof Error
      ? error.message
      : error
        ? "App Not Found"
        : null;

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
          <h1 className="text-2xl font-bold text-white mb-3">
            {errorMessage || "App Not Found"}
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            This installation link is no longer valid or the file has been
            removed. Please request a new link from the developer.
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
    dominantColor: data.dominantColor,
  };

  // URLs and platform detection
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "";
  const installPageUrl =
    typeof window !== "undefined" ? window.location.href : "";
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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InstallPageContent />
    </Suspense>
  );
}
