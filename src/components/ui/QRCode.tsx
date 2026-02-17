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

export default function QRCode({ url, size = 180, color, icon }: QRCodeProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      setError(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(false);

    QRCodeLib.toDataURL(url, {
      width: size * 2, // Generate higher res for better quality
      margin: 1,
      color: {
        dark: color?.dark || "#000000",
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
      {icon && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[22%] h-[22%] p-[2px] bg-white rounded-md shadow-sm overflow-hidden flex items-center justify-center">
          <img
            src={icon}
            alt="App Icon"
            className="w-full h-full object-cover rounded-sm"
          />
        </div>
      )}
    </div>
  );
}
