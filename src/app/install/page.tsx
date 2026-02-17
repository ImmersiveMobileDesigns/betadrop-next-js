"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useInstallData } from "@/hooks/queries";
import { detectDevice, generateIOSInstallUrl } from "@/lib/utils";
import type { DeviceInfo } from "@/types";
import AppInstallView from "@/components/shared/AppInstallView";
import LinkExpiredView from "@/components/shared/LinkExpiredView";

const DEFAULT_OG_IMAGE = "/og-image.png";
const SITE_NAME = "BetaDrop";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://betadrop.app";

/**
 * Dynamically updates document head meta tags for SEO.
 * Since this is a statically exported app, we update meta tags client-side
 * once the install data (app name, icon, etc.) is available.
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
  const id = searchParams.get("i") || searchParams.get("i"); // Support both id and token as query params
  const token = searchParams.get("token");

  const [device, setDevice] = useState<DeviceInfo | null>(null);

  // Detect device on mount
  useEffect(() => {
    const userAgent = window.navigator.userAgent;
    setDevice(detectDevice(userAgent));
  }, []);

  // Use React Query hook for install data - prevents duplicate calls
  const { data, isLoading, error } = useInstallData(id, token);

  // Extract SEO-relevant values from loaded data
  const seoAppName = data
    ? data.type === "guest"
      ? data.appName
      : data.build.name
    : undefined;

  const seoIconUrl = data?.iconUrl || undefined;

  const seoPlatform = data
    ? data.type === "guest"
      ? data.fileType
      : data.build.platform === "ios"
        ? "ipa"
        : "apk"
    : undefined;

  // Apply dynamic SEO meta tags
  useInstallPageSEO(seoAppName, seoIconUrl, seoPlatform);

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
    const reason = errorData.reason || "not_found";
    return <LinkExpiredView type={reason as any} appName={errorData.appName} />;
  }

  if (!id) {
    return <LinkExpiredView type="not_found" />;
  }

  if (!data || !device) return null;

  // Unified handling for both guest uploads and regular builds
  const isGuestUpload = data.type === "guest";

  // Extract common values based on type
  const appData = isGuestUpload
    ? {
        // Guest upload format
        appName: data.appName,
        packageName: data.packageName || "com.example.app",
        version: data.version,
        fileType: data.fileType as "ipa" | "apk",
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
        dominantColor: data.dominantColor,
      }
    : {
        // Build format
        appName: data.build.name,
        packageName: data.build.bundle_id || "com.example.app",
        version: data.build.version,
        fileType:
          data.build.platform === "ios" ? ("ipa" as const) : ("apk" as const),
        fileSize: data.build.file_size,
        createdAt: new Date(data.build.created_at).toISOString(),
        expiresAt: data.build.expires_at
          ? new Date(data.build.expires_at).toISOString()
          : undefined,
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
        provisionedDevices:
          typeof data.build.provisioned_devices === "string"
            ? JSON.parse(data.build.provisioned_devices)
            : data.build.provisioned_devices,
        permissions: data.build.permissions,
        isDeprecated: !!data.build.is_deprecated,
        notes: data.build.notes,
        dominantColor: data.build.dominant_color,
      };

  // Get URLs from response (works for both types)
  const { downloadUrl, manifestUrl } = data;
  const installPageUrl = window.location.href;
  const iosInstallUrl = generateIOSInstallUrl(manifestUrl);

  // Determine share token for sharing
  const shareToken = isGuestUpload
    ? data.shortId || id
    : data.shareLink?.short_id || data.defaultShortId || token || id;

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
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-950">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <InstallPageContent />
    </Suspense>
  );
}
