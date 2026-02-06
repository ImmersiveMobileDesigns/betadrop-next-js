"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Upload, Link2, Smartphone, BarChart3 } from "lucide-react";

// Feature data
const features = [
  {
    id: 1,
    title: "Upload builds in seconds",
    subtitle: "No login required.",
    icon: Upload,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: 2,
    title: "Get a secure install link instantly",
    subtitle: "Share with anyone, anywhere.",
    icon: Link2,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: 3,
    title: "Testers always see the right install option",
    subtitle: "Smart device detection.",
    icon: Smartphone,
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    id: 4,
    title: "Track installs, devices, and performance",
    subtitle: "Real-time analytics.",
    icon: BarChart3,
    gradient: "from-orange-500 to-amber-500",
  },
];

// Upload Screen Component
function UploadScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="w-full max-w-xs sm:max-w-sm">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-30" />
          <div className="relative bg-[#12121a] rounded-xl sm:rounded-2xl border-2 border-dashed border-blue-500/30 p-6 sm:p-8 flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-blue-500/30">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <p className="text-white font-bold text-base sm:text-lg mb-1 sm:mb-2 text-center">Drop your IPA or APK</p>
            <p className="text-white/40 text-xs sm:text-sm">or click to browse</p>
            <div className="mt-4 sm:mt-5 flex gap-2 sm:gap-3">
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-[10px] sm:text-xs font-semibold border border-blue-500/30">.ipa</span>
              <span className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] sm:text-xs font-semibold border border-emerald-500/30">.apk</span>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-5 flex items-center justify-center gap-3 sm:gap-4 text-white/30 text-[10px] sm:text-xs">
          <span>Up to 500MB iOS</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span>Up to 200MB Android</span>
        </div>
      </div>
    </div>
  );
}

// Link Generation Screen
function LinkScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="w-full max-w-xs sm:max-w-sm space-y-4 sm:space-y-5">
        <div className="flex items-center justify-center">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <div className="text-center">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-1">Build Uploaded!</h3>
          <p className="text-white/50 text-xs sm:text-sm">Your install link is ready</p>
        </div>
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-25" />
          <div className="relative bg-[#12121a] rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-3 border border-purple-500/20">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-purple-500/20 flex items-center justify-center shrink-0">
              <Link2 className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white/40 text-[10px] sm:text-xs">Install Link</p>
              <p className="text-white font-mono text-xs sm:text-sm truncate">betadrop.io/i/abc123</p>
            </div>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white text-xs sm:text-sm font-bold shadow-lg">
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Device Detection Screen
function DeviceScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="w-full max-w-xs sm:max-w-sm space-y-4 sm:space-y-5">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">Install MyApp</h3>
          <p className="text-white/50 text-xs sm:text-sm">Version 2.4.1 • 45.2 MB</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl blur-lg opacity-30" />
            <div className="relative bg-[#12121a] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-blue-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.10 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.60 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
                </svg>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-0.5 sm:mb-1">iOS</h4>
              <p className="text-white/40 text-[10px] sm:text-xs">Tap to install</p>
            </div>
          </div>
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl blur-lg opacity-30" />
            <div className="relative bg-[#12121a] rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-emerald-500/20">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-2 sm:mb-3 shadow-lg">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.6 9.48L19.44 6.3C19.54 6.12 19.48 5.89 19.3 5.79C19.12 5.69 18.89 5.75 18.79 5.93L16.93 9.15C15.5 8.5 13.86 8.13 12.12 8.13C10.38 8.13 8.74 8.5 7.31 9.15L5.45 5.93C5.35 5.75 5.12 5.69 4.94 5.79C4.76 5.89 4.7 6.12 4.8 6.3L6.64 9.48C3.54 11.25 1.41 14.38 1 18H23.24C22.83 14.38 20.7 11.25 17.6 9.48ZM7 15.25C6.31 15.25 5.75 14.69 5.75 14C5.75 13.31 6.31 12.75 7 12.75C7.69 12.75 8.25 13.31 8.25 14C8.25 14.69 7.69 15.25 7 15.25ZM17 15.25C16.31 15.25 15.75 14.69 15.75 14C15.75 13.31 16.31 12.75 17 12.75C17.69 12.75 18.25 13.31 18.25 14C18.25 14.69 17.69 15.25 17 15.25Z"/>
                </svg>
              </div>
              <h4 className="text-white font-bold text-sm sm:text-base mb-0.5 sm:mb-1">Android</h4>
              <p className="text-white/40 text-[10px] sm:text-xs">Download APK</p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-2 text-white/40 text-[10px] sm:text-xs">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Device automatically detected</span>
        </div>
      </div>
    </div>
  );
}

// Analytics Screen
function AnalyticsScreen() {
  return (
    <div className="w-full h-full flex flex-col p-4 sm:p-5 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <div>
          <h3 className="text-white font-bold text-base sm:text-lg">Analytics</h3>
          <p className="text-white/40 text-[10px] sm:text-xs">Last 7 days</p>
        </div>
        <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-orange-500/20 text-orange-400 text-[10px] sm:text-xs font-semibold border border-orange-500/30">
          Live
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mb-3 sm:mb-4">
        {[
          { label: "Downloads", value: "1,247", color: "from-blue-500 to-cyan-500" },
          { label: "Devices", value: "892", color: "from-purple-500 to-pink-500" },
          { label: "Success", value: "98.2%", color: "from-emerald-500 to-teal-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-[#12121a] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/5">
            <p className="text-white/40 text-[8px] sm:text-[10px] mb-0.5">{stat.label}</p>
            <p className="text-white font-bold text-sm sm:text-lg">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-[#12121a] rounded-lg sm:rounded-xl p-2 sm:p-3 border border-white/5">
        <p className="text-white/50 text-[10px] sm:text-xs font-medium mb-2 sm:mb-3">Downloads</p>
        <div className="flex items-end justify-between h-16 sm:h-20 gap-1 sm:gap-1.5">
          {[40, 65, 45, 80, 55, 90, 75].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1">
              <div
                className="w-full bg-gradient-to-t from-orange-500/40 to-amber-500/60 rounded-t-sm sm:rounded-t-md"
                style={{ height: `${h}%` }}
              />
              <span className="text-white/20 text-[6px] sm:text-[8px]">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Screen components array
const screens = [UploadScreen, LinkScreen, DeviceScreen, AnalyticsScreen];

// Main Mobile Showcase Component - NO GSAP, pure CSS
export default function MacBookShowcaseMobile() {
  return (
    <section className="relative py-16 sm:py-20 bg-gradient-to-b from-[#020617] via-[#080818] to-[#020617]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 sm:mb-16 px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            See BetaDrop in Action
          </h2>
          <p className="text-white/50 text-base sm:text-lg">
            Experience the seamless flow from upload to install
          </p>
        </div>
        
        <div className="space-y-10 sm:space-y-12 px-4">
          {features.map((feature, index) => {
            const ScreenComponent = screens[index];
            return (
              <div 
                key={feature.id} 
                className="mobile-card"
              >
                <div className="text-center mb-5 sm:mb-6">
                  <div className={cn(
                    "inline-flex w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl items-center justify-center mb-3 sm:mb-4 shadow-lg",
                    `bg-gradient-to-br ${feature.gradient}`
                  )}>
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">{feature.title}</h3>
                  <p className="text-white/50 text-sm sm:text-base">{feature.subtitle}</p>
                </div>
                <div className="relative mx-auto max-w-sm rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                  <div className="aspect-[4/3]">
                    <ScreenComponent />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
