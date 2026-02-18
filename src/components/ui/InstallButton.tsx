"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";

interface InstallButtonProps {
  platform: "ios" | "android";
  iosInstallUrl?: string;
  androidDownloadUrl?: string;
  deviceType?: "mobile" | "tablet" | "desktop";
  customAccentColor?: string;
}

// Apple Icon SVG Component
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

// Android Icon SVG Component
const AndroidIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C13.85 1.23 12.95 1 12 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31C6.97 3.26 6 5.01 6 7h12c0-1.99-.97-3.75-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
  </svg>
);

export default function InstallButton({
  platform,
  iosInstallUrl,
  androidDownloadUrl,
  deviceType = "desktop",
  customAccentColor,
}: InstallButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [installStatus, setInstallStatus] = useState<
    "idle" | "loading" | "installing"
  >("idle");

  const accentColor = customAccentColor || "#3b82f6";

  // Platform-specific gradient colors
  const gradientColors =
    platform === "ios"
      ? { from: "#1a1a2e", via: "#16213e", to: "#0f3460" }
      : { from: "#1b4332", via: "#2d6a4f", to: "#40916c" };

  const getButtonText = () => {
    if (installStatus === "loading") return "Please wait...";
    if (installStatus === "installing") return "Check Home Screen";

    if (platform === "ios") {
      return "Install on iOS";
    }
    return "Download APK";
  };

  const getSubText = () => {
    if (installStatus === "installing") return "App is installing...";

    if (platform === "ios") {
      return deviceType === "desktop"
        ? "Scan QR Code or visit on device"
        : "Tap to install";
    }
    return "For Android devices";
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (installStatus !== "idle") {
      e.preventDefault();
      return;
    }

    setInstallStatus("loading");

    if (platform === "ios") {
      // Allow time for system dialog
      setTimeout(() => {
        setInstallStatus("installing");
        // Reset after user has likely seen the message
        setTimeout(() => {
          setInstallStatus("idle");
        }, 5000);
      }, 2500);
    } else {
      setTimeout(() => {
        setInstallStatus("idle");
      }, 3000);
    }
  };

  const href = platform === "ios" ? iosInstallUrl : androidDownloadUrl;
  const isBusy = installStatus !== "idle";
  const isLoading = installStatus === "loading";

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      target={platform === "android" ? "_self" : undefined}
      className="relative overflow-hidden group flex items-center gap-4 py-4 px-6 rounded-2xl w-full sm:w-auto justify-center sm:justify-start border border-white/10"
      style={{
        background: `linear-gradient(135deg, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`,
        boxShadow:
          isHovered && !isBusy
            ? `0 20px 40px -10px ${platform === "ios" ? "rgba(15, 52, 96, 0.5)" : "rgba(45, 106, 79, 0.5)"}, 0 0 30px ${accentColor}30`
            : `0 10px 30px -10px ${platform === "ios" ? "rgba(15, 52, 96, 0.4)" : "rgba(45, 106, 79, 0.4)"}`,
        opacity: isBusy ? 0.85 : 1,
        cursor: isBusy ? "not-allowed" : "pointer",
      }}
      whileHover={isBusy ? {} : { scale: 1.03, y: -3 }}
      whileTap={isBusy ? {} : { scale: 0.97 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {/* Animated Gradient Overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, transparent 0%, ${accentColor}20 50%, transparent 100%)`,
        }}
      />

      {/* Shimmer Sweep Effect */}
      <div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
        }}
      />

      {/* Icon Container */}
      <div className="relative">
        <motion.div
          className={`relative p-3 rounded-xl backdrop-blur-sm transition-all duration-300 ${
            platform === "ios"
              ? "bg-white/15 group-hover:bg-white/25"
              : "bg-green-400/20 group-hover:bg-green-400/30"
          }`}
          animate={isLoading ? { rotate: 360 } : {}}
          transition={
            isLoading ? { duration: 1, repeat: Infinity, ease: "linear" } : {}
          }
        >
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
              >
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              </motion.div>
            ) : (
              <motion.div
                key="icon"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="group-hover:scale-110 transition-transform duration-300"
              >
                {platform === "ios" ? (
                  <AppleIcon className="w-6 h-6 text-white drop-shadow-lg" />
                ) : (
                  <AndroidIcon className="w-6 h-6 text-green-300 drop-shadow-lg" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Text Container */}
      <div className="flex flex-col items-start min-w-[140px] relative z-10">
        <span className="text-white font-bold text-base tracking-tight mb-1">
          {getButtonText()}
        </span>
        <span
          className={`text-xs font-medium leading-none transition-colors duration-300 ${
            platform === "ios" ? "text-blue-200/70" : "text-green-200/70"
          }`}
        >
          {getSubText()}
        </span>
      </div>

      {/* Arrow on Hover */}
      <motion.div
        className="absolute right-4"
        initial={{ opacity: 0, x: -10 }}
        animate={
          isHovered && !isBusy ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
        }
        transition={{ duration: 0.2 }}
      >
        <svg
          className="w-5 h-5 text-white/80"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M13 7l5 5m0 0l-5 5m5-5H6"
          />
        </svg>
      </motion.div>
    </motion.a>
  );
}
