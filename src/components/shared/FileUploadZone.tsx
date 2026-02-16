"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, File, AlertCircle } from "lucide-react";
import Image from "next/image";
import { MAX_FILE_SIZES } from "@/lib/validation";

interface FileUploadZoneProps {
  file: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  isUploading?: boolean;
  uploadProgress?: number;
  error?: string | null;
  showMetadata?: boolean;
}

export default function FileUploadZone({
  file,
  onFileSelect,
  onFileRemove,
  isUploading = false,
  uploadProgress = 0,
  error = null,
  showMetadata = true,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext !== "ipa" && ext !== "apk") {
      return;
    }
    onFileSelect(selectedFile);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-2xl p-8 sm:p-16 text-center cursor-pointer transition-all duration-500 group
          ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 scale-[1.01] shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              : "border-gray-700 hover:border-blue-400 hover:bg-white/5"
          }
          ${isUploading ? "pointer-events-none opacity-50" : ""}
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".ipa,.apk"
          onChange={handleFileChange}
        />

        <div className="flex flex-col items-center gap-6 relative z-10">
          <div
            className={`p-5 rounded-full transition-all duration-300 ${file ? "bg-blue-500/20 text-blue-400" : "bg-gray-800 text-gray-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 group-hover:scale-110"}`}
          >
            {file ? (
              <File className="w-10 h-10" />
            ) : (
              <Upload className="w-10 h-10" />
            )}
          </div>

          <div>
            {file ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {file.name}
                </h3>
                {showMetadata && (
                  <p className="text-sm text-gray-400 font-mono">
                    {formatFileSize(file.size)} • Ready to Upload
                  </p>
                )}
              </>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-white mb-3">
                  Drop your .ipa or .apk file here
                </h3>

                {/* Animated Platform Icons */}
                <div className="flex items-center justify-center gap-4 mb-3">
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10"
                  >
                    <Image
                      src="/images/logo/apple-logo-svgrepo-com.svg"
                      alt="iOS"
                      width={24}
                      height={24}
                      className="w-6 h-6 invert"
                    />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-3 bg-white/5 rounded-2xl backdrop-blur-md border border-white/10"
                  >
                    <Image
                      src="/images/logo/android-logo-svgrepo-com.svg"
                      alt="Android"
                      width={24}
                      height={24}
                      className="w-6 h-6"
                    />
                  </motion.div>
                </div>

                <p className="text-sm text-gray-400 mt-2">
                  Support for{" "}
                  <span className="text-gray-300 font-medium">.ipa</span> (max{" "}
                  {formatFileSize(MAX_FILE_SIZES.ios)}) and{" "}
                  <span className="text-gray-300 font-medium">.apk</span> (max{" "}
                  {formatFileSize(MAX_FILE_SIZES.android)})
                </p>

                <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl max-w-sm mx-auto">
                  <p className="text-xs text-blue-300">
                    <span className="font-bold">Guest Uploads:</span> Links
                    expire in 3 days.
                    <br />
                    <span className="text-blue-200/70">
                      Sign in for 30-day hosting.
                    </span>
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {isUploading && (
          <div className="w-full max-w-xs mt-4 relative z-20 mx-auto">
            <div className="flex justify-between text-xs text-blue-400 font-medium mb-2 uppercase tracking-wider">
              <span>Uploading</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-start gap-3 text-sm"
        >
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          {error}
        </motion.div>
      )}
    </>
  );
}
