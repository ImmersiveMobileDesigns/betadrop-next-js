"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check,
  Copy,
  ExternalLink,
  RefreshCw,
  QrCode as QrCodeIcon,
  Share2,
  Smartphone,
} from "lucide-react";
import QRCode from "qrcode";
import { Button } from "../ui/Button";
import { useUserSession, useAppConfig } from "@/hooks/queries";

interface UploadSuccessProps {
  url: string;
  expiresAt?: string;
  onUploadAnother: () => void;
  showQRCode?: boolean;
  description: string;
  platform?: string;
  meta?: {
    name: string;
    version: string;
    package: string;

    icon: string;
    dominantColor?: string;
  };
}

export default function UploadSuccess({
  url,
  expiresAt,
  onUploadAnother,
  showQRCode = true,
  description,
  platform = "android",
  meta,
  size = "default",
}: UploadSuccessProps & { size?: "default" | "compact" }) {
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isCompact = size === "compact";

  useEffect(() => {
    if (showQRCode && url) {
      QRCode.toDataURL(url, {
        width: 400,
        margin: 1,
        color: {
          dark: meta?.dominantColor || "#000000",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      })
        .then((dataUrl) => setQrCodeData(dataUrl))
        .catch((err) => console.error("QR Code generation failed", err));
    }
  }, [url, showQRCode, meta?.dominantColor]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  const showFallback = !meta?.icon || imageError;

  /*
   * NEW: Fetch session and config to show claim banner dynamically
   */
  const { data: user } = useUserSession();
  const { data: config } = useAppConfig();

  const getClaimText = () => {
    if (!config) return { guest: "3 days", auth: "30 days" };

    const hours = config.guestLinkExpiryHours;
    const days = Math.ceil(hours / 24);

    const guestExpiry =
      hours >= 24
        ? `${days} day${days !== 1 ? "s" : ""}`
        : `${hours} hour${hours !== 1 ? "s" : ""}`;

    const authExpiry =
      config.buildDefaultExpiryDays === 0
        ? "permanent"
        : `${config.buildDefaultExpiryDays} days`;

    return { guest: guestExpiry, auth: authExpiry };
  };

  const showClaimBanner = !user && config;
  const claimInfo = getClaimText();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${isCompact ? "p-6" : "p-8 sm:p-12"} text-center`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className={`${
          isCompact ? "w-12 h-12 mb-4" : "w-20 h-20 mb-6"
        } bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]`}
      >
        <Check
          className={`${
            isCompact ? "w-6 h-6 stroke-2" : "w-10 h-10 stroke-[3]"
          } text-white`}
        />
      </motion.div>

      <h2
        className={`${
          isCompact ? "text-xl" : "text-3xl"
        } font-bold text-white mb-2`}
      >
        Upload Successful!
      </h2>
      <p
        className={`text-gray-400 ${
          isCompact ? "text-sm mb-6" : "mb-8 text-base"
        } max-w-lg mx-auto leading-relaxed`}
      >
        {description}
      </p>

      {/* App Metadata Card */}
      {meta && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-white/5 border border-white/10 rounded-2xl ${
            isCompact ? "p-3 mb-6" : "p-4 mb-8"
          } max-w-md mx-auto flex items-center gap-4 text-left`}
        >
          <div
            className={`relative ${
              isCompact ? "w-12 h-12 rounded-lg" : "w-16 h-16 rounded-xl"
            } overflow-hidden bg-white/10 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-500`}
          >
            {/* Shimmer effect placeholder */}
            {!imageLoaded && !showFallback && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer bg-[length:200%_100%] content-['']" />
            )}

            {!showFallback ? (
              <div className="relative w-full h-full">
                <img
                  src={meta.icon}
                  alt={meta.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => {
                    setImageError(true);
                    setImageLoaded(true);
                  }}
                />
              </div>
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center ${
                  platform === "ios" ? "bg-slate-900" : "bg-emerald-600"
                }`}
              >
                <img
                  src={
                    platform === "ios"
                      ? "/images/logo/apple-logo-svgrepo-com.svg"
                      : "/images/logo/android-logo-svgrepo-com.svg"
                  }
                  alt={platform}
                  className={`w-8 h-8 drop-shadow-md ${
                    platform === "ios" ? "invert" : ""
                  }`}
                />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className={`${
                isCompact ? "text-base" : "text-lg"
              } font-bold text-white truncate leading-tight mb-1`}
            >
              {meta.name}
            </h3>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-gray-300 font-mono">
                  v{meta.version}
                </span>
                <span className="truncate opacity-70">{meta.package}</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Claim Upload Banner - ONLY for guests */}
      {/* {showClaimBanner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className={`bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl ${
            isCompact ? "p-3 mb-6" : "p-4 mb-8"
          } max-w-md mx-auto text-left relative overflow-hidden group`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center justify-between relative z-10">
            <div>
              <h4 className="text-sm font-bold text-blue-200 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                Extend Link Life
              </h4>
              <p className="text-[11px] sm:text-xs text-blue-300/70">
                Guest links expire in {claimInfo.guest}. Sign in to keep it for{" "}
                {claimInfo.auth}.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              className="bg-blue-600 hover:bg-blue-500 text-xs px-3 py-1 h-auto shrink-0 ml-4"
              onClick={() => (window.location.href = "/login")}
            >
              Sign In
            </Button>
          </div>
        </motion.div>
      )} */}

      {/* Copy Link Section */}
      <div
        className={`bg-white/5 border border-white/10 rounded-2xl ${
          isCompact ? "p-1.5 pl-3 mb-6" : "p-2 pl-4 mb-8"
        } flex items-center gap-3 max-w-md mx-auto hover:bg-white/[0.07] transition-colors group`}
      >
        <div className="flex-1 truncate text-left text-gray-300 font-mono text-sm">
          {url}
        </div>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className={`
              ${
                copied
                  ? "text-green-400 bg-green-400/10"
                  : "text-gray-400 hover:text-white"
              }
              transition-colors
            `}
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </Button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Open link"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* QR Code and Actions Grid */}
      <div
        className={`grid ${
          isCompact ? "grid-cols-1 gap-4" : "sm:grid-cols-2 gap-8"
        } max-w-2xl mx-auto items-center`}
      >
        {/* QR Code - Only show in default mode or if explicitly requested, but maybe hide in compact if space is tight? 
            Actually user screenshot shows QR Code "Download QR Code Scan to Install" at the bottom.
            For compact mode, let's keep it but maybe smaller or stacked.
            I'll stack it (grid-cols-1) for compact mode above.
        */}
        {showQRCode && qrCodeData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`flex flex-col items-center gap-3 bg-white ${
              isCompact ? "p-3 order-last" : "p-4"
            } rounded-2xl shadow-lg mx-auto w-full max-w-[200px]`}
          >
            <div className="relative w-full aspect-square">
              <img
                src={qrCodeData}
                alt="Download QR Code"
                className="w-full h-full object-contain rounded-lg"
              />
              {meta?.icon && !imageError && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] p-[2px] bg-white rounded-md shadow-sm overflow-hidden flex items-center justify-center">
                  <img
                    src={meta.icon}
                    alt="App Icon"
                    className="w-full h-full object-cover rounded-sm"
                    onError={() => setImageError(true)}
                  />
                </div>
              )}
            </div>
            <span className="text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <QrCodeIcon className="w-3 h-3" />
              Scan to Install
            </span>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div
          className={`flex flex-col gap-3 ${
            !showQRCode ? "col-span-2" : ""
          } w-full`}
        >
          <Button
            onClick={onUploadAnother}
            variant="outline"
            className="w-full justify-center gap-2 py-4 text-sm border-white/10 hover:bg-white/5 text-gray-300 hover:text-white group"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
            Upload Another
          </Button>

          <Button
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: "Install App",
                    text: "Install this app build",
                    url: url,
                  })
                  .catch(console.error);
              } else {
                handleCopy();
              }
            }}
            variant="secondary"
            className="w-full justify-center gap-2 py-4 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-500/25"
          >
            <Share2 className="w-4 h-4" />
            Share Link
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
