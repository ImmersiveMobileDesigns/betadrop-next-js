'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import FileUploadZone from '../shared/FileUploadZone';
import UploadSuccess from '../shared/UploadSuccess';
import { validateFile } from '@/lib/validation';
import { getDeviceId } from '@/lib/device-id';

interface Config {
  guestLinkExpiryHours: number;
  guestLinkExpiryDays: number;
  buildDefaultExpiryDays: number;
}

import { useAppConfig, useGuestUpload } from '@/hooks/queries';

export default function GuestUpload() {
  const uploadMutation = useGuestUpload();
  const { data: configData } = useAppConfig();

  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ url: string; expiresAt: string; meta?: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<Config>({
    guestLinkExpiryHours: 72,
    guestLinkExpiryDays: 3,
    buildDefaultExpiryDays: 30,
  });

  // Update config when data is fetched
  useEffect(() => {
    if (configData) {
      setConfig(configData);
    }
  }, [configData]);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
    
    const validation = validateFile(selectedFile.name, selectedFile.size);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setFile(selectedFile);
  };

  const handleFileRemove = () => {
    setFile(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    
    // Add device ID to track which device uploaded this file
    const deviceId = getDeviceId();
    if (deviceId) {
      formData.append('deviceId', deviceId);
    }

    try {
      uploadMutation.mutate(
        { 
          formData, 
          onProgress: (progress) => setUploadProgress(progress) 
        },
        {
          onSuccess: (data) => {
            // Track upload event
            if (typeof window !== 'undefined' && (window as any).gtag) {
              (window as any).gtag('event', 'upload', {
                event_category: 'Guest Upload',
                event_label: file.name,
                value: 1
              });
            }
            setUploadResult({ 
                url: data.url, 
                expiresAt: data.expiresAt,
                meta: data.meta 
            });
            setIsUploading(false);
          },
          onError: (err) => {
             setError(err instanceof Error ? err.message : 'Upload failed');
             setIsUploading(false);
          }
        }
      );

    } catch (err: any) {
      console.error(err);
      setError(err instanceof Error ? err.message : String(err));
      setIsUploading(false);
    }
  };

  const handleUploadAnother = () => {
    setFile(null);
    setUploadResult(null);
    setError(null);
  };

  // Generate dynamic description based on config
  const getSuccessDescription = () => {
    const hours = config.guestLinkExpiryHours;
    const days = Math.ceil(hours / 24); // Calculate days from hours since backend might not send it
    
    const guestExpiry = hours >= 24 
      ? `${days} day${days !== 1 ? 's' : ''}`
      : `${hours} hour${hours !== 1 ? 's' : ''}`;
    
    const authExpiry = config.buildDefaultExpiryDays === 0 
      ? 'permanent, non-expiring links'
      : `links valid for ${config.buildDefaultExpiryDays} days`;

    return `Your guest link is ready. It will expire in ${guestExpiry}. Sign in for ${authExpiry}.`;
  };

  // Determine platform from file or config
  const getPlatform = () => {
    if (uploadResult?.meta?.platform) return uploadResult.meta.platform;
    if (file?.name.toLowerCase().endsWith('.ipa')) return 'ios';
    return 'android';
  };

  return (
    <div className="relative group w-full max-w-2xl mx-auto rounded-3xl p-[1px] overflow-hidden">
      {/* Infinity Animated Border */}
      <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3b82f6_50%,#a855f7_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500" />
      
      {/* Main Card Content */}
      <div className="relative bg-[#0B1121] bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 z-10 w-full h-full">
         
         {/* Subtle background glitter effect */}
        {/* <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div> */}

        <AnimatePresence mode="wait">
          {!uploadResult ? (
            <motion.div
              key="upload-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-10"
            >
              <FileUploadZone
                file={file}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                error={error}
              />

              {file && !isUploading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 flex justify-center"
                >
                  <Button 
                    onClick={(e) => { e.stopPropagation(); handleUpload(); }} 
                    size="lg" 
                    className="w-full sm:w-auto min-w-[240px] shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Upload & Get Link
                  </Button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <UploadSuccess
              url={uploadResult.url}
              expiresAt={uploadResult.expiresAt}
              onUploadAnother={handleUploadAnother}
              showQRCode={true}
              description={getSuccessDescription()}
              meta={uploadResult.meta}
              platform={getPlatform()}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

