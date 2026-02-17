"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import Image from "next/image";

interface QRCodeProps {
  url: string;
  size?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  icon?: string;
}

// Helper to check if a color is "light" using luminance
// formula: Y = 0.299*R + 0.587*G + 0.114*B
const isLightColor = (color: string) => {
  if (!color) return false;
  if (color.toLowerCase() === "white") return true;

  // Clean hex
  const hex = color.replace("#", "");

  // Parse r, g, b
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else if (hex.length === 6) {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } else {
    // Unknown format or invalid
    return false;
  }

  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  // If brightness > 150 (scale 0-255), it's pretty light (including light greys)
  return brightness > 150;
};

export default function QRCode({ url, size = 180, color, icon }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [iconError, setIconError] = useState(false);

  // Reset icon error when icon prop changes
  useEffect(() => {
    setIconError(false);
  }, [icon]);

  useEffect(() => {
    if (!url) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    // Determine dark color
    let darkColor = color?.dark || "#000000";

    // If the "dark" color passed is actually light (e.g. white), fail-safe to black
    if (isLightColor(darkColor)) {
      darkColor = "#000000";
    }

    // Ensure full opacity
    if (darkColor.startsWith("#") && darkColor.length === 9) {
      darkColor = darkColor.substring(0, 7);
    }

    QRCodeLib.toDataURL(url, {
      width: size * 2, // Generate higher res for better quality
      margin: 1,
      color: {
        dark: darkColor,
        light: color?.light || "#ffffff",
      },
      errorCorrectionLevel: "H", // High error correction to support logo overlay
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error("QR Code generation error:", err);
        setError(true);
        setLoading(false);
      });
  }, [url, size, color?.dark, color?.light]);

  if (loading) {
    return (
      <div
        className="mx-auto bg-white/10 rounded-xl flex items-center justify-center animate-pulse"
        style={{ width: size, height: size }}
      >
        <span className="text-white/40 text-sm">Loading...</span>
      </div>
    );
  }

  if (error || !qrDataUrl) {
    return (
      <div
        className="mx-auto bg-white/5 rounded-xl flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <span className="text-white/40 text-sm">QR Code unavailable</span>
      </div>
    );
  }

  return (
    <div className="relative inline-block p-2 bg-white rounded-xl shadow-sm">
      <Image
        src={qrDataUrl}
        alt="QR Code to install app"
        width={size}
        height={size}
        className="block rounded-lg"
        unoptimized
      />
      {icon && !iconError && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] p-[2px] bg-white rounded-md shadow-sm overflow-hidden flex items-center justify-center">
          <img
            src={icon}
            alt="App Icon"
            className="w-full h-full object-cover rounded-sm"
            onError={() => setIconError(true)}
          />
        </div>
      )}
    </div>
  );
}
