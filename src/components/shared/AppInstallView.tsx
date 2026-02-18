"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  Box,
  Settings,
  HelpCircle,
  AlertTriangle,
  MessageSquare,
  Star,
  Activity,
  FileBox,
  Hash,
  Calendar,
  Layers,
  Smartphone,
  Cpu,
  Lock,
  Wifi,
  Zap,
  FileText,
} from "lucide-react";
import InstallButton from "@/components/ui/InstallButton";
import QRCode from "@/components/ui/QRCode";
import { formatFileSize, copyToClipboard } from "@/lib/utils";
import { fetchFromLaravel } from "@/lib/api-client";

import Image from "next/image";

export interface AppData {
  appName: string;
  packageName: string;
  version: string;
  fileType: "ipa" | "apk";
  fileSize: number;
  createdAt: string;
  expiresAt?: string;
  buildNumber?: string;
  minOSVersion?: string;
  supportedArchitectures?: string[];
  isDebuggable?: boolean;
  deviceFamilies?: string[];
  // App icon (extracted from IPA/APK)

  iconUrl?: string | null;
  dominantColor?: string | null;
  // Branding
  customAccentColor?: string | null;
  customBackgroundColor?: string | null;
  customBrandName?: string | null;
  customLogoPath?: string | null;
  customMessage?: string | null;
  customThemeMode?: "dark" | "light" | "system";

  hidePlatformBranding?: boolean;
  provisionedDevices?: string[];
  permissions?: string[];
  isDeprecated?: boolean;
  notes?: string | null;
}

interface AppInstallViewProps {
  data: AppData;
  installPageUrl: string;
  downloadUrl: string;
  manifestUrl?: string;
  iosInstallUrl?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
  isMobile?: boolean;
  buildId: string;
  shareToken?: any;
  enableFeedback?: boolean;
}

// Section Header Component
const SectionHeader = ({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
}) => (
  <div className="flex items-center gap-4 mb-6">
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center"
      style={{
        backgroundColor: "var(--primary-color)",
      }}
    >
      <Icon className="w-5 h-5 text-white" />
    </div>
    <div className="flex flex-col">
      <h2 className="text-lg sm:text-xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <span className="text-[10px] sm:text-xs font-medium opacity-50 uppercase tracking-wider">
          {subtitle}
        </span>
      )}
    </div>
  </div>
);

// Stat Card Component for Overview
const StatCard = ({
  label,
  value,
  icon: Icon,
  delay = 0,
}: {
  label: string;
  value: string;
  icon: any;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="flex flex-col p-4 rounded-xl border bg-white/5 hover:bg-white/10 transition-colors"
    style={{ borderColor: "var(--card-border)" }}
  >
    <div className="flex items-center gap-2 mb-2 opacity-60">
      <Icon className="w-3.5 h-3.5" />
      <span className="text-[10px] sm:text-xs font-medium uppercase tracking-wide">
        {label}
      </span>
    </div>
    <span className="font-bold text-base sm:text-lg truncate" title={value}>
      {value}
    </span>
  </motion.div>
);

// Data Row Component
const DataRow = ({
  label,
  value,
  isLink = false,
  copyable = false,
}: {
  label: string;
  value: string;
  isLink?: boolean;
  copyable?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(value);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-white/5 last:border-0 group hover:bg-white/[0.02] px-2 -mx-2 rounded-lg transition-colors">
      <span className="text-xs sm:text-sm opacity-60 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 text-xs sm:text-sm font-semibold flex items-center gap-1 transition-opacity"
            style={{ color: "var(--primary-color)" }}
          >
            {value} <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <span className="text-xs sm:text-sm font-semibold text-right">
            {value}
          </span>
        )}
        {copyable && (
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-green-400" />
            ) : (
              <Copy className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

// Expandable Section Component
const ExpandableRow = ({
  label,
  value,
  count,
  children,
}: {
  label: string;
  value?: string;
  count?: number;
  children?: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => children && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 group"
      >
        <span className="text-xs sm:text-sm opacity-60">{label}</span>
        <div className="flex items-center gap-2">
          {value && (
            <span className="text-xs sm:text-sm font-medium">{value}</span>
          )}
          {count !== undefined && (
            <span
              className="px-2 py-0.5 text-xs rounded-full font-medium"
              style={{
                backgroundColor: "var(--primary-color)33",
                color: "var(--primary-color)",
              }}
            >
              {count}
            </span>
          )}
          {children &&
            (isOpen ? (
              <ChevronUp className="w-4 h-4 opacity-40" />
            ) : (
              <ChevronDown className="w-4 h-4 opacity-40" />
            ))}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-4 text-xs sm:text-sm opacity-60">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question }: { question: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const answers: Record<string, string> = {
    "Why is the app asking for storage permissions?":
      "The app may request storage permissions to save data locally on your device. This is standard behavior for many apps.",
    "The app won't open after installation. What should I do?":
      'Go to Settings → General → VPN & Device Management, find the developer certificate, and tap "Trust" to allow the app to run.',
    "Is the app available on iOS as well?":
      "This depends on the app publisher. Check with the developer for cross-platform availability.",
    "Why do I see a security warning during installation?":
      "This is normal for apps distributed outside the App Store. You need to trust the developer certificate in your device settings.",
    "How do I update the app?":
      "When a new version is available, you'll receive a new download link. Install it over the existing version to update.",
  };

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 text-left"
      >
        <span className="text-xs sm:text-sm pr-4 opacity-80">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 opacity-40 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 opacity-40 flex-shrink-0" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-3 text-xs sm:text-sm opacity-50 leading-relaxed">
              {answers[question] ||
                "Please contact the app developer for more information."}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AppInstallView({
  data,
  installPageUrl,
  downloadUrl,
  manifestUrl,
  iosInstallUrl,
  deviceType = "desktop",
  isMobile = false,
  buildId,
  shareToken,
  enableFeedback = true,
}: AppInstallViewProps) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [iconError, setIconError] = useState(false);

  const platform = data.fileType === "ipa" ? "ios" : "android";

  // Date formatting - moved to state to prevent hydration mismatch
  const createdDate = new Date(data.createdAt);

  // Use state for time-dependent values to avoid hydration mismatch
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0 });
  const [formattedDate, setFormattedDate] = useState("Loading...");

  useEffect(() => {
    // Format the date on client side to avoid server/client mismatch
    setFormattedDate(
      createdDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    );

    if (data.expiresAt) {
      const calculateTimeRemaining = () => {
        const expiresDate = new Date(data.expiresAt!);
        const now = new Date();
        const remaining = expiresDate.getTime() - now.getTime();
        setTimeRemaining({
          days: Math.max(0, Math.floor(remaining / (1000 * 60 * 60 * 24))),
          hours: Math.max(
            0,
            Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          ),
        });
      };

      calculateTimeRemaining();
      // Update every minute
      const interval = setInterval(calculateTimeRemaining, 60000);
      return () => clearInterval(interval);
    }
  }, [data.expiresAt, data.createdAt]);

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [shakeStars, setShakeStars] = useState(false);
  const [highlightEmail, setHighlightEmail] = useState(false);

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const submitFeedback = async () => {
    if (!rating) {
      setShakeStars(true);
      setTimeout(() => setShakeStars(false), 500);
      return;
    }
    if (!email || !isValidEmail(email)) {
      setHighlightEmail(true);
      setTimeout(() => setHighlightEmail(false), 500);
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      const res = await fetchFromLaravel(`/api/builds/${buildId}/feedback`, {
        method: "POST",
        // fetchFromLaravel adds Content-Type
        body: JSON.stringify({
          feedback_type: "suggestion",
          title: rating > 0 ? `${rating} Star Rating` : "Feedback",
          description: feedback,
          rating: rating,
          reporter_email: email,
          share_link_token: shareToken,
        }),
      });
      if (res && (res as any).success) {
        setFeedbackSubmitted(true);
      } else if (res && !(res as any).success) {
        // Fallback if the API returns a generic success/false structure
        // but usually fetchFromLaravel throws on error? No, only on !response.ok
        // If response is ok but success: false, it returns data.
        // Wait, fetchFromLaravel returns data directly.
        // So if status is 200, it returns the JSON.
        // Laravel usually returns { success: true, ... }
        setFeedbackSubmitted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  const daysRemaining = timeRemaining.days;
  const hoursRemaining = timeRemaining.hours;

  // Short URL for display
  const shortUrl = installPageUrl.split("/").pop()?.substring(0, 6) || "";

  const handleCopyLink = async () => {
    const success = await copyToClipboard(installPageUrl);
    if (success) {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  };

  const accentColor = data.customAccentColor || "#3b82f6";
  const bgColor =
    data.customBackgroundColor ||
    (data.customThemeMode === "light" ? "#f8fafc" : "#0f172a");
  const textColor = data.customThemeMode === "light" ? "#1e293b" : "#f8fafc";
  const subTextColor = data.customThemeMode === "light" ? "#64748b" : "#94a3b8";

  const themeClass =
    data.customThemeMode === "light" ? "light-theme" : "dark-theme";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${themeClass}`}
      style={{
        backgroundColor: bgColor,
        color: textColor,
        ["--primary-color" as any]: accentColor,
        ["--bg-color" as any]: bgColor,
        ["--text-color" as any]: textColor,
        ["--subtext-color" as any]: subTextColor,
      }}
    >
      <style jsx global>{`
        :root {
          --primary-500: ${accentColor};
          --primary-600: ${accentColor}dd;
          --primary-400: ${accentColor}bb;
        }
        .light-theme {
          --card-bg: #ffffff;
          --card-border: rgba(0, 0, 0, 0.08);
          --input-bg: rgba(0, 0, 0, 0.02);
        }
        .dark-theme {
          --card-bg: rgba(255, 255, 255, 0.05);
          --card-border: rgba(255, 255, 255, 0.1);
          --input-bg: rgba(255, 255, 255, 0.03);
        }
      `}</style>

      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className={`absolute -top-1/2 -right-1/2 w-full h-full rounded-full blur-2xl opacity-10 ${
            platform === "ios"
              ? "bg-gradient-to-br from-blue-600/40 to-purple-600/20"
              : "bg-gradient-to-br from-green-600/40 to-emerald-600/20"
          }`}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-6 lg:py-10">
        {/* Powered By Header */}
        {!data.hidePlatformBranding && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8"
          >
            <a
              href="/"
              target="_blank"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full border backdrop-blur-md transition-all shadow-sm"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <span className="text-[10px] sm:text-xs font-bold opacity-60 uppercase tracking-widest group-hover:opacity-90 transition-opacity leading-none pt-0.5">
                Powered by
              </span>
              <span className="text-xs sm:text-sm font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all leading-none">
                BetaDrop
              </span>
            </a>
          </motion.div>
        )}

        {/* Deprecated Warning */}
        {data.isDeprecated && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl text-center backdrop-blur-md border bg-red-500/10 border-red-500/20 text-red-500"
          >
            <div className="flex items-center justify-center gap-2 font-semibold">
              <AlertTriangle className="w-5 h-5" />
              <span>This build is deprecated</span>
            </div>
            <p className="text-sm opacity-80 mt-1">
              Please check for a newer version or contact the developer.
            </p>
          </motion.div>
        )}

        {/* Custom Message if exists */}
        {data.customMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl text-center backdrop-blur-md border"
            style={{
              backgroundColor: "var(--primary-color)20",
              borderColor: "var(--primary-color)40",
            }}
          >
            <p
              className="text-xs sm:text-sm font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              {data.customMessage}
            </p>
          </motion.div>
        )}

        {/* Top Header Card - Premium Design */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border p-1 mb-6 backdrop-blur-md shadow-sm overflow-hidden"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: "var(--card-border)",
            background: `linear-gradient(135deg, ${accentColor}15, transparent 50%, ${accentColor}08)`,
          }}
        >
          {/* Simplified overlay for performance */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top right, ${accentColor}20, transparent 60%)`,
            }}
          />

          <div
            className="relative rounded-2xl p-5 lg:p-7 overflow-hidden"
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            {/* Subtle animated gradient background */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `linear-gradient(135deg, ${accentColor}10 0%, transparent 50%, ${accentColor}05 100%)`,
              }}
            />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* App Info Section */}
              <div className="flex items-center gap-5">
                {/* Logo Container - Enhanced with glow and better styling */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="relative group"
                >
                  {/* Glow effect behind the icon */}
                  <div
                    className="absolute -inset-2 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500"
                    style={{ backgroundColor: accentColor }}
                  />
                  <div
                    className={`relative w-20 h-20 lg:w-24 lg:h-24 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden shadow-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-105 ${
                      (!data.customLogoPath && !data.iconUrl) || iconError
                        ? platform === "ios"
                          ? "bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900"
                          : "bg-gradient-to-br from-slate-600 via-slate-700 to-green-800"
                        : "bg-white/5 backdrop-blur-sm"
                    }`}
                  >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Priority: 1) Custom branding logo, 2) Extracted app icon (if no error), 3) Platform icon */}
                    {data.customLogoPath && !iconError ? (
                      <Image
                        src={data.customLogoPath}
                        alt={data.customBrandName || data.appName}
                        fill
                        sizes="(max-width: 1024px) 80px, 96px"
                        className="object-cover"
                        onError={() => setIconError(true)}
                      />
                    ) : data.iconUrl && !iconError ? (
                      <Image
                        src={data.iconUrl}
                        alt={data.appName}
                        fill
                        sizes="(max-width: 1024px) 80px, 96px"
                        className="object-cover"
                        onError={() => setIconError(true)}
                      />
                    ) : platform === "ios" ? (
                      <svg
                        className="w-10 h-10 lg:w-12 lg:h-12 text-white"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                    ) : (
                      <Image
                        src="/images/logo/android-logo-svgrepo-com.svg"
                        alt="Android Logo"
                        width={48}
                        height={48}
                        className="w-10 h-10 lg:w-12 lg:h-12"
                      />
                    )}
                  </div>
                </motion.div>

                {/* App Details */}
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight bg-gradient-to-r from-current to-current/70 bg-clip-text">
                      {data.customBrandName || data.appName}
                    </h1>
                    {data.customBrandName && (
                      <div className="text-sm opacity-50 font-medium mt-1 flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-current opacity-40" />
                        By {data.appName}
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap items-center gap-2"
                  >
                    {/* Platform Badge - Enhanced with better styling */}
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm transition-transform hover:scale-105 ${
                        platform === "ios"
                          ? "bg-gradient-to-r from-slate-600 to-slate-800 text-white"
                          : "bg-gradient-to-r from-green-500 to-green-700 text-white"
                      }`}
                    >
                      {platform === "ios" ? (
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                        </svg>
                      ) : (
                        <svg
                          className="w-3.5 h-3.5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
                        </svg>
                      )}
                      {data.fileType}
                    </span>

                    {/* Version Badge - Glassmorphism style */}
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border transition-transform hover:scale-105"
                      style={{
                        backgroundColor: `${accentColor}18`,
                        borderColor: `${accentColor}35`,
                        color: accentColor,
                      }}
                    >
                      <Layers className="w-3 h-3" />v{data.version}
                      {data.buildNumber && (
                        <span className="opacity-70">({data.buildNumber})</span>
                      )}
                    </span>

                    {/* File Size Badge - Improved styling */}
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-white/10 bg-white/5 backdrop-blur-sm transition-transform hover:scale-105 hover:bg-white/10">
                      <FileBox className="w-3 h-3 opacity-60" />
                      {formatFileSize(data.fileSize)}
                    </span>
                  </motion.div>
                </div>
              </div>

              {/* Action Section - Enhanced */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4"
              >
                {data.expiresAt && (
                  <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{
                      scale: 1,
                      ...(daysRemaining < 1
                        ? {
                            boxShadow: [
                              "0 0 0 0px rgba(239, 68, 68, 0)",
                              "0 0 0 4px rgba(239, 68, 68, 0.2)",
                              "0 0 0 0px rgba(239, 68, 68, 0)",
                            ],
                          }
                        : {}),
                    }}
                    transition={{
                      scale: { duration: 0.3 },
                      boxShadow: { duration: 2, repeat: Infinity },
                    }}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm border backdrop-blur-md overflow-hidden ${
                      daysRemaining < 1
                        ? "bg-gradient-to-r from-red-500/25 to-red-600/15 text-red-400 border-red-500/40"
                        : daysRemaining < 7
                          ? "bg-gradient-to-r from-amber-500/25 to-amber-600/15 text-amber-400 border-amber-500/40"
                          : "bg-gradient-to-r from-green-500/25 to-green-600/15 text-green-400 border-green-500/40"
                    }`}
                  >
                    {/* Animated background pulse for urgent expiration */}
                    {daysRemaining < 1 && (
                      <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                    )}
                    <div
                      className={`relative p-2 rounded-lg ${
                        daysRemaining < 1
                          ? "bg-red-500/20"
                          : daysRemaining < 7
                            ? "bg-amber-500/20"
                            : "bg-green-500/20"
                      }`}
                    >
                      <Clock className="w-4 h-4" />
                    </div>
                    <div className="relative flex flex-col">
                      <span className="text-[10px] uppercase tracking-wider opacity-70 font-semibold">
                        {daysRemaining < 1 ? "Expiring Soon!" : "Expires in"}
                      </span>
                      <span className="font-bold text-lg leading-tight tracking-tight">
                        {daysRemaining}d {hoursRemaining}h
                      </span>
                    </div>
                  </motion.div>
                )}

                {iosInstallUrl && (
                  <InstallButton
                    platform={platform}
                    iosInstallUrl={iosInstallUrl}
                    androidDownloadUrl={downloadUrl}
                    deviceType={deviceType}
                    customAccentColor={accentColor}
                  />
                )}
              </motion.div>
            </div>

            {/* Mobile Tip - Enhanced with better visuals */}
            {!isMobile && platform === "ios" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-5 border-t border-white/10"
              >
                <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent border border-blue-500/20 backdrop-blur-sm">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-400/30 rounded-xl blur-lg" />
                    <div className="relative w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm">
                      <Smartphone className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium opacity-80">
                      Open this page on your{" "}
                      <strong className="text-blue-400 font-semibold">
                        iPhone or iPad
                      </strong>{" "}
                      to install directly via OTA
                    </p>
                    <p className="text-xs opacity-50 mt-0.5">
                      Scan the QR code or share the link
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-blue-400 opacity-70">
                    <Wifi className="w-3.5 h-3.5" />
                    <span>OTA</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <SectionHeader
                icon={Activity}
                title="App Overview"
                subtitle="Quick Stats"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatCard
                  icon={Box}
                  label="App Name"
                  value={data.appName}
                  delay={0.1}
                />
                <StatCard
                  icon={Hash}
                  label="Version"
                  value={`v${data.version} (${data.buildNumber || "1"})`}
                  delay={0.2}
                />
                <StatCard
                  icon={FileBox}
                  label="Size"
                  value={formatFileSize(data.fileSize)}
                  delay={0.3}
                />
                <StatCard
                  icon={Calendar}
                  label="Uploaded"
                  value={formattedDate}
                  delay={0.4}
                />
              </div>
            </motion.div>

            {/* Release Notes */}
            {data.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <SectionHeader
                  icon={FileText}
                  title="Release Notes"
                  subtitle="What's New"
                />
                <div className="text-sm opacity-80 whitespace-pre-wrap font-medium leading-relaxed">
                  {data.notes}
                </div>
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <SectionHeader
                icon={Settings}
                title="Technical Details"
                subtitle="Configuration"
              />
              <div className="space-y-0">
                <DataRow label="Package" value={data.packageName} copyable />
                <DataRow
                  label="Minimum OS Version"
                  value={
                    data.minOSVersion || (platform === "ios" ? "14.0" : "7.0")
                  }
                />
                <ExpandableRow
                  label="Required Device Capabilities"
                  count={platform === "ios" ? 2 : 1}
                >
                  <ul className="list-disc list-inside space-y-1">
                    <li>arm64</li>
                    {platform === "ios" && <li>metal</li>}
                  </ul>
                </ExpandableRow>
                <ExpandableRow
                  label="Provisioned Devices"
                  count={
                    data.provisionedDevices?.length ||
                    (platform === "ios" ? 0 : undefined)
                  }
                  value={platform === "android" ? "All" : undefined}
                >
                  {platform === "ios" &&
                  data.provisionedDevices &&
                  data.provisionedDevices.length > 0 ? (
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                      {data.provisionedDevices.map((device, index) => (
                        <div
                          key={index}
                          className="text-xs font-mono opacity-80 bg-white/5 p-1.5 rounded select-all hover:bg-white/10 transition-colors"
                        >
                          {device}
                        </div>
                      ))}
                    </div>
                  ) : platform === "ios" ? (
                    <p className="opacity-40 text-xs text-center border-t border-white/5 pt-2 mt-2">
                      No provisioned devices found in this build.
                    </p>
                  ) : null}
                </ExpandableRow>
                <DataRow
                  label="Supported Architectures"
                  value={data.supportedArchitectures?.join(", ") || "arm64"}
                />
                <DataRow
                  label="Debuggable"
                  value={data.isDebuggable ? "Yes" : "No"}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <SectionHeader
                icon={Shield}
                title="Features & Privacy"
                subtitle="Permissions"
              />
              <div className="space-y-0">
                <ExpandableRow
                  label="Permissions"
                  count={data.permissions?.length || 0}
                >
                  {data.permissions && data.permissions.length > 0 ? (
                    <ul className="list-disc list-inside space-y-1">
                      {data.permissions.map((perm, i) => (
                        <li key={i}>{perm}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-xs opacity-50 pl-1">
                      No special permissions detected
                    </span>
                  )}
                </ExpandableRow>
                <ExpandableRow label="Implied Permissions" count={2}>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Internet Access</li>
                    <li>Background Refresh</li>
                  </ul>
                </ExpandableRow>
                <DataRow label="Uses Features" value="None Defined" />
                <ExpandableRow
                  label="Device Families"
                  count={data.deviceFamilies?.length || 2}
                >
                  <ul className="list-disc list-inside space-y-1">
                    {(
                      data.deviceFamilies ||
                      (platform === "ios"
                        ? ["iPhone", "iPad"]
                        : ["Phone", "Tablet"])
                    ).map((family) => (
                      <li key={family}>{family}</li>
                    ))}
                  </ul>
                </ExpandableRow>
              </div>
            </motion.div>

            {enableFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
                className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <SectionHeader
                  icon={MessageSquare}
                  title="Feedback"
                  subtitle="Rate Experience"
                />

                {feedbackSubmitted ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-3">
                      <Check className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-lg">Thank You!</h3>
                    <p className="text-sm opacity-60">
                      Your feedback has been submitted successfully.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-2 mb-4">
                      <span className="text-sm font-medium opacity-70">
                        Rate this build
                      </span>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.button
                            key={star}
                            onClick={() => setRating(star)}
                            className="transition-transform focus:outline-none"
                            whileHover={{ scale: 1.1 }}
                            animate={
                              shakeStars
                                ? {
                                    x: [0, -4, 4, -4, 4, 0],
                                    transition: { duration: 0.4 },
                                  }
                                : {}
                            }
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${rating >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-400 opacity-30"} ${shakeStars ? "text-red-400 opacity-60" : ""}`}
                            />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder="Share your thoughts, report bugs, or suggest features..."
                        className="w-full min-h-[100px] p-3 rounded-xl border bg-transparent text-sm resize-none focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        style={{
                          borderColor: "var(--card-border)",
                          backgroundColor: "var(--input-bg)",
                        }}
                      />

                      <motion.input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        animate={
                          highlightEmail ? { x: [0, -4, 4, -4, 4, 0] } : {}
                        }
                        transition={{ duration: 0.4 }}
                        className={`w-full p-3 rounded-xl border bg-transparent text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all ${
                          (email && !isValidEmail(email)) || highlightEmail
                            ? "border-red-500/50 ring-2 ring-red-500/20"
                            : ""
                        }`}
                        style={{
                          borderColor:
                            (email && !isValidEmail(email)) || highlightEmail
                              ? undefined
                              : "var(--card-border)",
                          backgroundColor: "var(--input-bg)",
                        }}
                      />

                      <button
                        onClick={submitFeedback}
                        disabled={isSubmittingFeedback}
                        className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                          !rating || !email || !isValidEmail(email) ? "" : ""
                        }`}
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        {isSubmittingFeedback
                          ? "Submitting..."
                          : "Submit Feedback"}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <SectionHeader
                icon={HelpCircle}
                title="FAQ"
                subtitle="Common Questions"
              />
              <div className="space-y-0">
                <FAQItem question="Why is the app asking for storage permissions?" />
                <FAQItem question="The app won't open after installation. What should I do?" />
                <FAQItem question="Is the app available on iOS as well?" />
                <FAQItem question="Why do I see a security warning during installation?" />
                <FAQItem question="How do I update the app?" />
              </div>
            </motion.div>
          </div>

          <div className="space-y-6 lg:sticky lg:top-8 self-start">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
              style={{
                backgroundColor: "var(--card-bg)",
                borderColor: "var(--card-border)",
              }}
            >
              <div className="flex items-center gap-3 mb-6 justify-center">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-blue-500/10">
                  <ExternalLink className="w-4 h-4 text-blue-500" />
                </div>
                <h2 className="text-lg font-bold">Share Build</h2>
              </div>
              <div className="flex flex-col items-center">
                <div className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-black/5">
                  <QRCode
                    url={installPageUrl}
                    size={160}
                    color={{
                      dark: data.dominantColor || "#000000",
                      light: "#ffffff",
                    }}
                    icon={data.iconUrl || data.customLogoPath || undefined}
                  />
                </div>
                <p className="opacity-70 text-xs mb-4 font-medium uppercase tracking-wider">
                  Scan QR Code
                </p>

                <div
                  className="w-full flex items-center gap-2 rounded-xl p-2 border"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    borderColor: "var(--card-border)",
                  }}
                >
                  <code
                    className="text-sm font-mono flex-1 truncate pl-2"
                    style={{ color: "var(--primary-color)" }}
                  >
                    {shortUrl}
                  </code>
                  <button
                    onClick={handleCopyLink}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {linkCopied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4 opacity-40" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>

            {isMobile && platform === "ios" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="group rounded-2xl border p-6 backdrop-blur-md shadow-sm transition-all duration-300"
                style={{
                  backgroundColor: "var(--card-bg)",
                  borderColor: "var(--card-border)",
                }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                    style={{
                      backgroundColor: "var(--primary-color)",
                    }}
                  >
                    <AlertTriangle className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <h2
                      className="text-xl font-bold tracking-tight"
                      style={{ color: "var(--primary-color)" }}
                    >
                      Installation Help
                    </h2>
                    <span className="text-xs font-medium opacity-50 uppercase tracking-wider">
                      Required Steps
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 leading-relaxed">
                    <span className="font-bold">Note:</span> iOS requires you to
                    manually trust enterprise apps before they can run.
                  </div>
                  <ol className="space-y-4 text-sm font-medium relative">
                    <div className="absolute left-[11px] top-6 bottom-6 w-0.5 bg-white/10 -z-10" />
                    <li className="flex gap-4 items-start">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ring-4 ring-[var(--card-bg)]"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        1
                      </span>
                      <div className="flex-1 pt-0.5">
                        <span className="opacity-70 block mb-1">
                          Open Device Settings
                        </span>
                        <span className="text-xs opacity-50 block">
                          Go to{" "}
                          <strong className="opacity-100">
                            Settings → General
                          </strong>
                        </span>
                      </div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ring-4 ring-[var(--card-bg)]"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        2
                      </span>
                      <div className="flex-1 pt-0.5">
                        <span className="opacity-70 block mb-1">
                          Find Profile
                        </span>
                        <span className="text-xs opacity-50 block">
                          Tap{" "}
                          <strong className="opacity-100">
                            VPN & Device Management
                          </strong>
                        </span>
                      </div>
                    </li>
                    <li className="flex gap-4 items-start">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ring-4 ring-[var(--card-bg)]"
                        style={{
                          backgroundColor: "var(--primary-color)",
                          color: "white",
                        }}
                      >
                        3
                      </span>
                      <div className="flex-1 pt-0.5">
                        <span className="opacity-70 block mb-1">
                          Trust Developer
                        </span>
                        <span className="text-xs opacity-50 block">
                          Select the profile and tap{" "}
                          <strong className="opacity-100">Trust</strong>
                        </span>
                      </div>
                    </li>
                  </ol>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 pb-8"
        >
          {!data.hidePlatformBranding && (
            <a
              href="/"
              target="_blank"
              className="inline-block  hover:opacity-100 transition-opacity text-sm font-medium"
            >
              Powered by{" "}
              <span
                className="font-bold tracking-tight"
                style={{ color: "var(--primary-color)" }}
              >
                BetaDrop
              </span>
            </a>
          )}
        </motion.div>
      </div>
    </div>
  );
}
