'use client';

import { useEffect, useState } from 'react';
import QRCodeLib from 'qrcode';
import Image from 'next/image';

interface QRCodeProps {
  url: string;
  size?: number;
}

export default function QRCode({ url, size = 180 }: QRCodeProps) {
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
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
    })
      .then((dataUrl) => {
        setQrDataUrl(dataUrl);
        setLoading(false);
      })
      .catch((err) => {
        console.error('QR Code generation error:', err);
        setError(true);
        setLoading(false);
      });
  }, [url, size]);

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
    <div className="inline-block p-4 bg-white rounded-xl">
      <Image 
        src={qrDataUrl} 
        alt="QR Code to install app" 
        width={size} 
        height={size}
        style={{ display: 'block' }}
        unoptimized
      />
    </div>
  );
}
