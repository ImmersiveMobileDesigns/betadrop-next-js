'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  Download, 
  Users, 
  Palette,
  Wand2,
  Info
} from 'lucide-react';
import DashboardHeader from '@/components/layout/DashboardHeader';
import FileUploadZone from '@/components/shared/FileUploadZone';
import UploadSuccess from '@/components/shared/UploadSuccess';
import { Button } from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { useUserSession, useAuthUpload } from '@/hooks/queries';
import type { ExpiryType } from '@/types';

export default function EnhancedUploadPage() {
  const { data: user, isLoading: isSessionLoading } = useUserSession();
  const uploadMutation = useAuthUpload();
  
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState<{ url: string; buildId: string; platform?: string; meta?: any } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Advanced features state
  const [expiryType, setExpiryType] = useState<ExpiryType>('time');
  const [expiryDays, setExpiryDays] = useState(30);
  const [downloadLimit, setDownloadLimit] = useState(100);
  const [deviceLimit, setDeviceLimit] = useState(25);
  const [customAccentColor, setCustomAccentColor] = useState('#3b82f6');
  const [customMessage, setCustomMessage] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (!isSessionLoading && !user) {
      router.push('/api/auth/logout');
    }
  }, [user, isSessionLoading, router]);

  const handleFileSelect = (selectedFile: File) => {
    setError(null);
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
    if (notes) formData.append('notes', notes);
    
    // Advanced features
    formData.append('expiry_type', expiryType);
    if (expiryType === 'time' || expiryType === 'combined') {
      formData.append('expiry_time_days', expiryDays.toString());
    }
    if (expiryType === 'downloads' || expiryType === 'combined') {
      formData.append('expiry_download_limit', downloadLimit.toString());
    }
    if (expiryType === 'devices' || expiryType === 'combined') {
      formData.append('expiry_device_limit', deviceLimit.toString());
    }
    if (customAccentColor !== '#3b82f6') {
      formData.append('custom_accent_color', customAccentColor);
    }
    if (customMessage) {
      formData.append('custom_message', customMessage);
    }

    try {
      uploadMutation.mutate(
        { 
          formData, 
          onProgress: (progress) => setUploadProgress(progress) 
        },
        {
          onSuccess: (data: any) => {
            const appUrl = window.location.origin;
            const linkId = data.shortId || data.id;
            const installUrl = `${appUrl}/install/?i=${linkId}`;
            setUploadResult({ 
              url: installUrl, 
              buildId: data.id,
              platform: data.platform,
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
    setNotes('');
    setShowNotes(false);
    setShowAdvanced(false);
    setExpiryType('time');
    setCustomMessage('');
  };

  if (isSessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <a href="/dashboard" className="text-white/60 hover:text-white text-sm flex items-center group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </a>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Upload Build</h1>
          <p className="text-white/60">
            Upload an IPA or APK file with advanced distribution controls.
          </p>
        </div>

        {/* Upload Card */}
        <div className="relative group w-full max-w-4xl mx-auto rounded-3xl p-[1px] overflow-hidden">
          {/* Animated Border */}
          <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#3b82f6_50%,#a855f7_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500" />
          
          {/* Main Card Content */}
          <div className="relative bg-[#0B1121] bg-opacity-90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 z-10 w-full h-full">
            {/* <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none"></div> */}

            <AnimatePresence mode="wait">
              {!uploadResult ? (
                <motion.div
                  key="upload-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 sm:p-8 lg:p-10"
                >
                  <FileUploadZone
                    file={file}
                    onFileSelect={handleFileSelect}
                    onFileRemove={handleFileRemove}
                    isUploading={isUploading}
                    uploadProgress={uploadProgress}
                    error={error}
                  />



                  {/* Release Notes */}
                  {file && !isUploading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      {!showNotes ? (
                        <button
                          onClick={() => setShowNotes(true)}
                          className="text-primary-400 hover:text-primary-300 text-sm transition-colors"
                        >
                          + Add Release Notes (Optional)
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-white/80">
                            Release Notes (Optional)
                          </label>
                          <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="What's new in this build..."
                            rows={4}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                          />
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Advanced Options */}
                  {file && !isUploading && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-6"
                    >
                      <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors mb-4"
                      >
                        <Sparkles className="w-4 h-4" />
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                      </button>

                      {showAdvanced && (
                        <div className="space-y-6 p-6 rounded-2xl bg-white/5 border border-white/10">
                          {/* Expiry Rules */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                              <Clock className="w-4 h-4" />
                              Expiry Rules
                            </label>
                            <Select
                              value={expiryType}
                              onChange={(value) => setExpiryType(value as ExpiryType)}
                              options={[
                                { value: 'time', label: 'Time-Based Expiry' },
                                { value: 'downloads', label: 'Download Limit' },
                                { value: 'devices', label: 'Device Limit' },
                                { value: 'combined', label: 'Combined Rules' },
                              ]}
                              className="mb-3"
                            />

                            {(expiryType === 'time' || expiryType === 'combined') && (
                              <div className="mb-3">
                                <label className="block text-xs text-white/60 mb-2">Expires After (Days)</label>
                                <input
                                  type="number"
                                  value={expiryDays}
                                  onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setExpiryDays(val > 30 ? 30 : val);
                                  }}
                                  min="1"
                                  max="30"
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                                />
                              </div>
                            )}

                            {(expiryType === 'downloads' || expiryType === 'combined') && (
                              <div className="mb-3">
                                <label className="block text-xs text-white/60 mb-2">Maximum Downloads</label>
                                <input
                                  type="number"
                                  value={downloadLimit}
                                  onChange={(e) => setDownloadLimit(parseInt(e.target.value))}
                                  min="1"
                                  max="10000"
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                                />
                              </div>
                            )}

                            {(expiryType === 'devices' || expiryType === 'combined') && (
                              <div>
                                <label className="block text-xs text-white/60 mb-2">Maximum Unique Devices</label>
                                <input
                                  type="number"
                                  value={deviceLimit}
                                  onChange={(e) => setDeviceLimit(parseInt(e.target.value))}
                                  min="1"
                                  max="1000"
                                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors"
                                />
                              </div>
                            )}
                          </div>

                          {/* Custom Branding */}
                          <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-white/80 mb-3">
                              <Palette className="w-4 h-4" />
                              Custom Branding
                            </label>
                            <div className="space-y-3">
                              <div>
                                <label className="block text-xs text-white/60 mb-2">Accent Color</label>
                                <div className="flex items-center gap-3">
                                  <input
                                    type="color"
                                    value={customAccentColor}
                                    onChange={(e) => setCustomAccentColor(e.target.value)}
                                    className="w-12 h-12 rounded-lg cursor-pointer bg-white/5 border border-white/10"
                                  />
                                  <input
                                    type="text"
                                    value={customAccentColor}
                                    onChange={(e) => setCustomAccentColor(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary-500/50 transition-colors font-mono"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="block text-xs text-white/60 mb-2">Custom Message (Optional)</label>
                                <textarea
                                  value={customMessage}
                                  onChange={(e) => setCustomMessage(e.target.value)}
                                  placeholder="Add a custom message for testers..."
                                  rows={2}
                                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-primary-500/50 transition-colors resize-none"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-xs text-blue-300">
                              These settings can be changed later from the build management page.
                            </p>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

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
                        Upload Build
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <UploadSuccess
                  url={uploadResult.url}
                  expiresAt={expiryType === 'none' ? undefined : new Date(Date.now() + expiryDays * 24 * 60 * 60 * 1000).toISOString()}
                  onUploadAnother={handleUploadAnother}
                  showQRCode={true}
                  description={
                    expiryType === 'none' 
                      ? 'Your build is ready to share! This link will never expire.' 
                      : `Your build is ready to share! This link expires in ${expiryDays} days.`
                  }
                  platform={uploadResult.platform || (file?.name.toLowerCase().endsWith('.ipa') ? 'ios' : 'android')}
                  meta={uploadResult.meta}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
