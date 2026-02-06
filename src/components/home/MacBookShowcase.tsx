"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Upload, Link2, Smartphone, BarChart3 } from "lucide-react";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Feature data
const features = [
  {
    id: 1,
    title: "Upload builds in seconds",
    subtitle: "No login required.",
    icon: Upload,
    gradient: "from-blue-500 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.5)",
  },
  {
    id: 2,
    title: "Get a secure install link instantly",
    subtitle: "Share with anyone, anywhere.",
    icon: Link2,
    gradient: "from-purple-500 to-pink-500",
    glowColor: "rgba(168, 85, 247, 0.5)",
  },
  {
    id: 3,
    title: "Testers always see the right install option",
    subtitle: "Smart device detection.",
    icon: Smartphone,
    gradient: "from-emerald-500 to-teal-500",
    glowColor: "rgba(16, 185, 129, 0.5)",
  },
  {
    id: 4,
    title: "Track installs, devices, and performance",
    subtitle: "Real-time analytics.",
    icon: BarChart3,
    gradient: "from-orange-500 to-amber-500",
    glowColor: "rgba(249, 115, 22, 0.5)",
  },
];

// Upload Screen Component
function UploadScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
          <div className="relative bg-[#12121a] rounded-xl sm:rounded-2xl border-2 border-dashed border-blue-500/30 p-6 sm:p-8 lg:p-12 flex flex-col items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-4 sm:mb-5 shadow-lg shadow-blue-500/30">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
            </div>
            <p className="text-white font-bold text-base sm:text-lg lg:text-xl mb-1 sm:mb-2 text-center">Drop your IPA or APK</p>
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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-md space-y-4 sm:space-y-5">
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
    <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
      <div className="w-full max-w-xs sm:max-w-sm lg:max-w-lg space-y-4 sm:space-y-5">
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-white font-bold text-lg sm:text-xl mb-1 sm:mb-2">Install MyApp</h3>
          <p className="text-white/50 text-xs sm:text-sm">Version 2.4.1 • 45.2 MB</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
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
            <div className="absolute -inset-1 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl sm:rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
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
    <div className="w-full h-full flex flex-col p-4 sm:p-5 lg:p-6 bg-gradient-to-b from-[#0a0a12] to-[#0d0d18]">
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

// Screen content renderer
const screens = [UploadScreen, LinkScreen, DeviceScreen, AnalyticsScreen];

// MacBook Frame with 3D perspective - responsive
function MacBookFrame({ children, className, glowColor }: { children: React.ReactNode; className?: string; glowColor?: string }) {
  return (
    <div className={cn("relative", className)} style={{ perspective: "1200px" }}>
      {/* Dynamic glow under MacBook */}
      <div 
        className="macbook-glow absolute -bottom-8 sm:-bottom-12 lg:-bottom-16 left-1/2 -translate-x-1/2 w-[80%] sm:w-[85%] lg:w-[90%] h-16 sm:h-24 lg:h-32 blur-2xl sm:blur-3xl rounded-full transition-all duration-700 ease-out"
        style={{ 
          background: `radial-gradient(ellipse, ${glowColor || 'rgba(59, 130, 246, 0.4)'} 0%, transparent 70%)`,
          opacity: 0.7 
        }}
      />
      
      {/* MacBook Body with 3D transform support */}
      <div className="macbook-body relative" style={{ transformStyle: "preserve-3d" }}>
        {/* Screen */}
        <div className="relative bg-gradient-to-b from-[#2a2a35] to-[#1a1a22] rounded-t-[10px] sm:rounded-t-[14px] lg:rounded-t-[18px] p-[4px] sm:p-[6px] lg:p-[8px] shadow-2xl shadow-black/50">
          {/* Camera */}
          <div className="absolute top-1.5 sm:top-2 lg:top-2.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-[#1a1a22] flex items-center justify-center">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#0a0a0f]" />
          </div>
          
          {/* Bezel */}
          <div className="relative bg-[#0a0a0f] rounded-[6px] sm:rounded-[8px] lg:rounded-[10px] overflow-hidden shadow-inner">
            {/* Screen content with 3D effect */}
            <div className="screen-content aspect-[16/10] w-full overflow-hidden" style={{ transformStyle: "preserve-3d" }}>
              {children}
            </div>
          </div>
        </div>
        
        {/* Hinge */}
        <div className="relative h-2 sm:h-2.5 lg:h-3 bg-gradient-to-b from-[#3a3a45] via-[#2a2a32] to-[#1a1a22]">
          <div className="absolute inset-x-0 top-0 h-[1px] bg-[#4a4a55]" />
        </div>
        
        {/* Base */}
        <div className="relative h-1.5 sm:h-2 lg:h-2.5 bg-gradient-to-b from-[#1a1a22] to-[#25252f] rounded-b-md lg:rounded-b-lg mx-[8%]">
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-12 sm:w-16 lg:w-20 h-0.5 bg-[#0f0f15] rounded-b-full" />
        </div>
      </div>
    </div>
  );
}

// Mobile/Tablet fallback - No GSAP, pure CSS animations for better scroll performance
function MobileShowcase() {
  return (
    <div className="space-y-10 sm:space-y-12 px-4">
      {features.map((feature, index) => {
        const ScreenComponent = screens[index];
        return (
          <div 
            key={feature.id} 
            className="mobile-card animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
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
  );
}

export default function MacBookShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const macbookRef = useRef<HTMLDivElement>(null);
  const screenContainerRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isSmallLaptop, setIsSmallLaptop] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  // Use a ref to track active index without causing re-renders
  const activeIndexRef = useRef(0);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsSmallLaptop(width >= 768 && width < 1280);
      
      // Debounced ScrollTrigger refresh to prevent scroll lock after resize
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };

    // Enable normalizeScroll to fix touchpad jitter/jumping
    if (typeof window !== "undefined") {
      // normalizeScroll can cause scroll-jacking feel on laptops, disabling it
      // ScrollTrigger.normalizeScroll(true); 
      ScrollTrigger.config({ ignoreMobileResize: true });
    }

    const checkMotion = () => setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
    checkScreenSize();
    checkMotion();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      clearTimeout(resizeTimeout);
      // Optional: Disable normalizeScroll on unmount if you want native scroll back, 
      // but usually for SPA it's better to keep it consistent or manage it globally.
      // ScrollTrigger.normalizeScroll(false); 
    };
  }, []);

  // Main GSAP animation
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;
    
    const section = sectionRef.current;
    const trigger = triggerRef.current;
    const macbook = macbookRef.current;
    const screenContainer = screenContainerRef.current;
    const steps = stepsRef.current;
    
    if (!section || !trigger || !macbook || !screenContainer || !steps) return;

    // Kill any existing ScrollTriggers on this trigger element first
    ScrollTrigger.getAll().forEach(st => {
      if (st.trigger === trigger) {
        st.kill();
      }
    });

    const ctx = gsap.context(() => {
      // Get all screen panels and step items
      const screenPanels = screenContainer.querySelectorAll('.screen-panel');
      const stepItems = steps.querySelectorAll('.step-item');

      // Set initial states - all hidden except first with zoom out starting position
      gsap.set(screenPanels, { 
        opacity: 0, 
        scale: 0.65,
        zIndex: 0,
        transformOrigin: "center center"
      });
      gsap.set(screenPanels[0], { 
        opacity: 1, 
        scale: 1,
        zIndex: 10
      });
      gsap.set(stepItems, { opacity: 0, y: 60, scale: 0.95 });
      gsap.set(stepItems[0], { opacity: 1, y: 0, scale: 1 });

      // Scroll length based on screen size
      const scrollLength = isSmallLaptop ? "+=250%" : "+=300%";

      // Create main timeline with pin
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: scrollLength,
          pin: true,
          pinSpacing: true, // Ensure proper spacing is maintained after pin
          scrub: 1, // Increased to smooth out trackpad jitter
          fastScrollEnd: true, // Prevents "adding" momentum lag
          preventOverlaps: true,
          anticipatePin: 1,
          invalidateOnRefresh: true, // Recalculate on resize/refresh
          onUpdate: (self) => {
            const progress = self.progress;
            // Adjusted calculation for smoother transitions
            const adjustedProgress = Math.max(0, (progress - 0.1) / 0.9);
            const newIndex = Math.min(
              Math.floor(adjustedProgress * features.length), 
              features.length - 1
            );
            
            if (newIndex !== activeIndexRef.current) {
              activeIndexRef.current = newIndex;
              setActiveIndex(newIndex);
            }
          }
        }
      });

      // MacBook entrance animation (first 10% of scroll)
      tl.fromTo(macbook, 
        { y: 80, scale: 0.88, opacity: 0, rotateX: 15 },
        { 
          y: 0, 
          scale: 1, 
          opacity: 1, 
          rotateX: 0, 
          duration: 0.12, 
          ease: "power1.out", // Subtle ease for smoother scroll feel
          force3D: true
        },
        0
      );

      // Animate through each feature with zoom in/out effect
      features.forEach((_, index) => {
        const segmentSize = 0.88 / features.length;
        const startTime = 0.12 + (index * segmentSize);

        if (index > 0) {
          // Previous screen ZOOMS IN (gets bigger) and fades out - like zooming into it
          tl.to(screenPanels[index - 1], {
            opacity: 0,
            scale: 1.35, // Zoom IN effect - screen gets larger as it fades
            zIndex: 0,
            duration: segmentSize * 0.55,
            ease: "none", // Linear for smoother scrubbed animation
            force3D: true
          }, startTime);

          // Current screen ZOOMS OUT (starts small, gets to normal) - like emerging from distance
          tl.fromTo(screenPanels[index], 
            { 
              opacity: 0, 
              scale: 0.65, // Start smaller (zoomed out)
              zIndex: 5
            },
            { 
              opacity: 1, 
              scale: 1, // Zoom to normal size
              zIndex: 10,
              duration: segmentSize * 0.6,
              ease: "none", // Linear for smoother scrubbed animation
              force3D: true
            },
            startTime + segmentSize * 0.15 // Slight overlap for smooth transition
          );

          // Previous step text zooms out and fades
          tl.to(stepItems[index - 1], {
            opacity: 0,
            y: -50,
            scale: 0.9,
            duration: segmentSize * 0.45,
            ease: "power1.in" // Subtle ease for smooth scroll feel
          }, startTime);

          // Current step text zooms in smoothly
          tl.fromTo(stepItems[index],
            { opacity: 0, y: 60, scale: 0.95 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1,
              duration: segmentSize * 0.55,
              ease: "power1.out" // Subtle ease for smooth scroll feel
            },
            startTime + segmentSize * 0.2
          );
        }
      });

    }, section);

    return () => {
      // Comprehensive cleanup to prevent scroll locking
      ctx.revert();
      // Kill any remaining ScrollTriggers associated with this trigger
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === trigger) {
          st.kill();
        }
      });
      // Refresh ScrollTrigger to recalculate all positions
      ScrollTrigger.refresh();
    };
  }, [isMobile, isSmallLaptop, prefersReducedMotion]);

  // Determine which view mode we're in
  const viewMode = prefersReducedMotion || isMobile ? 'mobile' : 'desktop';

  // Render with a key based on view mode to force clean remounting
  // This prevents React DOM errors when GSAP has manipulated elements
  return (
    <div key={viewMode}>
      {viewMode === 'mobile' ? (
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
            <MobileShowcase />
          </div>
        </section>
      ) : (
        <section 
          ref={sectionRef}
          className="relative z-40 bg-gradient-to-b from-[#020617] via-[#080818] to-[#020617]"
        >
          {/* Background decorations */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[10%] left-[5%] w-[400px] md:w-[500px] lg:w-[600px] h-[400px] md:h-[500px] lg:h-[600px] bg-blue-500/5 rounded-full blur-[100px] lg:blur-[150px]" />
            <div className="absolute top-[30%] right-[5%] w-[350px] md:w-[400px] lg:w-[500px] h-[350px] md:h-[400px] lg:h-[500px] bg-purple-500/5 rounded-full blur-[90px] lg:blur-[130px]" />
            <div className="absolute bottom-[10%] left-[20%] w-[300px] md:w-[350px] lg:w-[400px] h-[300px] md:h-[350px] lg:h-[400px] bg-cyan-500/5 rounded-full blur-[80px] lg:blur-[100px]" />
          </div>

          {/* Trigger container that gets pinned */}
          <div ref={triggerRef} className="relative min-h-screen">
            {/* Content wrapper */}
            <div className="h-screen flex flex-col items-center justify-center px-4 md:px-6 lg:px-8">
              
              {/* Header */}
              <div className="absolute top-6 sm:top-8 lg:top-12 left-0 right-0 text-center z-10 px-4">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                  See BetaDrop in Action
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-white/40 max-w-md lg:max-w-xl mx-auto">
                  Scroll to explore the seamless flow
                </p>
              </div>

              {/* Main content area - responsive layout */}
              <div className={cn(
                "relative w-full max-w-7xl mx-auto flex items-center justify-center gap-6 md:gap-8 lg:gap-12 xl:gap-16",
                isSmallLaptop ? "flex-col mt-20" : "flex-row mt-16"
              )}>
                
                {/* MacBook Container */}
                <div 
                  ref={macbookRef}
                  className={cn(
                    "relative will-change-transform",
                    isSmallLaptop 
                      ? "w-full max-w-xl" 
                      : "w-full max-w-lg lg:max-w-2xl xl:max-w-3xl"
                  )}
                  style={{ perspective: "1200px" }}
                >
                  <MacBookFrame glowColor={features[activeIndex]?.glowColor}>
                    <div 
                      ref={screenContainerRef}
                      className="relative w-full h-full"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {screens.map((ScreenComponent, index) => (
                        <div
                          key={index}
                          className="screen-panel absolute inset-0 will-change-transform"
                          style={{ 
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden"
                          }}
                        >
                          <ScreenComponent />
                        </div>
                      ))}
                    </div>
                  </MacBookFrame>
                </div>

                {/* Steps Container */}
                <div 
                  ref={stepsRef}
                  className={cn(
                    "relative flex items-center",
                    isSmallLaptop 
                      ? "w-full max-w-lg h-48 justify-center text-center" 
                      : "w-full max-w-sm lg:max-w-md xl:max-w-lg h-56 lg:h-64 xl:h-72"
                  )}
                >
                  {features.map((feature, index) => (
                    <div
                      key={feature.id}
                      className={cn(
                        "step-item absolute inset-0 flex flex-col justify-center will-change-transform px-4",
                        isSmallLaptop ? "text-center items-center" : "text-left lg:px-0"
                      )}
                    >
                      {/* Step icon and number */}
                      <div className={cn(
                        "flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4",
                        isSmallLaptop ? "justify-center" : "justify-start"
                      )}>
                        <div 
                          className={cn(
                            "w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl transition-shadow duration-500",
                            `bg-gradient-to-br ${feature.gradient}`
                          )}
                          style={{ boxShadow: `0 10px 40px -10px ${feature.glowColor}` }}
                        >
                          <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <span className={cn(
                          "text-white/20 text-xs sm:text-sm font-bold",
                          isSmallLaptop ? "hidden sm:block" : "hidden lg:block"
                        )}>
                          {String(index + 1).padStart(2, '0')} / {String(features.length).padStart(2, '0')}
                        </span>
                      </div>
                      
                      {/* Step text */}
                      <h3 className={cn(
                        "font-bold text-white mb-2 sm:mb-3 leading-tight tracking-tight",
                        isSmallLaptop 
                          ? "text-xl sm:text-2xl md:text-3xl" 
                          : "text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl"
                      )}>
                        {feature.title}
                      </h3>
                      <p className={cn(
                        "text-white/50 font-medium",
                        isSmallLaptop 
                          ? "text-sm sm:text-base" 
                          : "text-base lg:text-lg xl:text-xl"
                      )}>
                        {feature.subtitle}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress dots */}
              <div 
                ref={progressRef}
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3",
                  isSmallLaptop ? "bottom-6 sm:bottom-8" : "bottom-8 lg:bottom-20"
                )}
              >
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn(
                      "progress-dot rounded-full transition-all duration-500 ease-out",
                      index === activeIndex
                        ? `w-8 sm:w-10 h-2 bg-gradient-to-r ${feature.gradient}`
                        : "w-2 h-2 bg-white/20 hover:bg-white/30"
                    )}
                  />
                ))}
              </div>

              {/* Scroll hint */}
              <div className={cn(
                "absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5 sm:gap-1 text-white/30",
                isSmallLaptop ? "bottom-1 sm:bottom-2" : "bottom-2 lg:bottom-4"
              )}>
                <span className="text-[10px] sm:text-xs font-medium">Scroll</span>
                <svg className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
