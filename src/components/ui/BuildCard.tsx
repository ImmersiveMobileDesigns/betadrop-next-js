'use client';

import Link from 'next/link';
import { useState } from 'react';
import type { Build } from '@/types';
import { formatFileSize, formatRelativeTime, copyToClipboard } from '@/lib/utils';
import { Copy, Settings, Check, Download, Calendar, Smartphone, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface BuildCardProps {
  build: Build;
  onDelete?: (id: string) => void;
}

export default function BuildCard({ build, onDelete }: BuildCardProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_FRONT_APP_URL || 'https://betadrop.app';
  const installUrl = `${appUrl}/install/?i=${build.default_short_id || build.id}`;

  const copyLink = async () => {
    const success = await copyToClipboard(installUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const platformIcon = build.platform === 'ios' ? (
    <Image src="/images/logo/apple-logo-svgrepo-com.svg" alt="iOS" width={24} height={24} className="w-6 h-6 text-white drop-shadow-md" />
  ) : (
    <Image src="/images/logo/android-logo-svgrepo-com.svg" alt="Android" width={24} height={24} className="w-6 h-6 text-white drop-shadow-md" />
  );

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-primary-500/5 hover:-translate-y-0.5">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      <div className="relative p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
          <div className="flex items-start space-x-5 w-full">
            {/* App Icon or Platform Icon */}
            <div className={`relative w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg overflow-hidden ${
              build.platform === 'ios' 
                ? 'bg-gradient-to-br from-gray-700 via-gray-800 to-black text-white ring-1 ring-white/20' 
                : 'bg-gradient-to-br from-emerald-500 via-green-600 to-green-700 text-white shadow-emerald-500/20'
            }`}>
              {build.icon_url ? (
                <img 
                  src={build.icon_url} 
                  alt={build.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to platform icon on error
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`${build.icon_path ? 'hidden' : ''} flex items-center justify-center`}>
                {platformIcon}
              </div>
              <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
            </div>

            {/* Build Info */}
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-xl font-bold text-white truncate leading-tight tracking-tight">{build.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  build.is_enabled 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {build.is_enabled ? 'Active' : 'Disabled'}
                </span>
                {build.is_latest && (
                   <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border bg-blue-500/10 text-blue-400 border-blue-500/20">
                    Latest
                  </span>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md border border-white/5">
                  <span className="font-medium text-gray-200">v{build.version}</span>
                  {build.build_number && build.build_number !== '0' && (
                    <span className="text-gray-500">({build.build_number})</span>
                  )}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <span>{formatFileSize(build.file_size)}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-gray-600" />
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{formatRelativeTime(build.created_at)}</span>
                </div>
              </div>
              
              {build.bundle_id && (
                <div className="mt-2 flex items-center gap-1.5">
                  <code className="text-xs text-primary-400/80 bg-primary-500/5 px-2 py-0.5 rounded border border-primary-500/10 font-mono tracking-wide">
                    {build.bundle_id}
                  </code>
                </div>
              )}
            </div>
          </div>

          {/* Stats - Desktop: Right aligned */}
          <div className="hidden sm:flex flex-col items-end gap-1 min-w-[100px]">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold text-white tracking-tight">{build.download_count}</span>
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">installs</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/10">
              <Download className="w-3 h-3" />
              <span>Total</span>
            </div>
          </div>
        </div>

        {/* Mobile Stats Row (Visible only on small screens) */}
        <div className="sm:hidden flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white/5">
              <Download className="w-4 h-4 text-primary-400" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">{build.download_count}</div>
              <div className="text-xs text-gray-400">downloads</div>
            </div>
          </div>
        </div>

        {/* Actions - Bottom Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mt-6 pt-5 border-t border-dashed border-white/10">
          <div className="flex flex-col lg:flex-row  xs:flex-row items-stretch xs:items-center gap-3">
            <button
              onClick={copyLink}
              className="group/btn relative overflow-hidden flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2 text-emerald-400" />
                  <span className="text-emerald-400 font-medium text-sm">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2 text-gray-400 group-hover/btn:text-white transition-colors" />
                  <span className="text-gray-300 group-hover/btn:text-white font-medium text-sm transition-colors">Copy Link</span>
                </>
              )}
            </button>
            
            <Link
              href={`/install?i=${build.default_short_id || build.id}`}
              target="_blank"
              className="group/btn relative overflow-hidden flex items-center justify-center px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-300"
            >
       
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
              <ExternalLink className="w-4 h-4 mr-2 text-gray-400 group-hover/btn:text-white transition-colors" />
              <span className="text-gray-300 group-hover/btn:text-white font-medium text-sm transition-colors">Open Page</span>
            </Link>
          </div>

          <Link
            href={`/builds/manage?id=${build.default_short_id || build.id}`}
            className="group/manage relative flex items-center justify-center px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5 border border-white/10"
          >
            <span className="text-sm font-bold tracking-wide relative z-10 flex items-center">
              Manage Build
              <Settings className="w-4 h-4 ml-2 transition-transform duration-300 group-hover/manage:rotate-90" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
