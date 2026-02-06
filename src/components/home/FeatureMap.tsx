'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';

export default function FeatureMap({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-12">
      {/* Optimized background - removed blur-[100px] for 4K performance */}
      <div className="absolute inset-0  pointer-events-none" />

      {/* Main Content (The Upload Box) */}
      <div className="relative z-10 flex justify-center">
        <div className="w-full max-w-2xl relative">
          {children}

          {/* Left Side Nodes */}
          <div className="absolute top-[0%] left-0 -translate-x-full h-full hidden xl:block w-72 pointer-events-none">
            <NodeLine 
              top="15%" 
              label="No Login Required" 
              delay={0.2} 
              icon={<UnlockIcon className="w-5 h-5 text-blue-300" />}
            />
            <NodeLine 
              top="38%" 
              label="3 Days Expiry" 
              delay={0.3} 
              icon={<TimerIcon className="w-5 h-5 text-blue-300" />}
            />
            <NodeLine 
              top="62%" 
              label="Simple Drag & Drop" 
              delay={0.4} 
              icon={<CloudUploadIcon className="w-5 h-5 text-blue-300" />}
            />
            <NodeLine 
              top="85%" 
              label="Fast Upload Speed" 
              delay={0.5} 
              icon={<ZapIcon className="w-5 h-5 text-blue-300" />}
            />
          </div>

          {/* Right Side Nodes */}
          <div className="absolute top-[0%] right-0 translate-x-full h-full hidden xl:block w-72 pointer-events-none">
             <NodeLine 
               top="15%" 
               label="Smart Device Detection" 
               delay={0.2} 
               right 
               icon={<SmartphoneIcon className="w-5 h-5 text-blue-300" />}
             />
             <NodeLine 
               top="38%" 
               label="Instant Link Generation" 
               delay={0.3} 
               right 
               icon={<LinkIcon className="w-5 h-5 text-blue-300" />}
             />
             <NodeLine 
               top="62%" 
               label="Unlimited Downloads" 
               delay={0.4} 
               right 
               icon={<DownloadIcon className="w-5 h-5 text-blue-300" />}
             />
             <NodeLine 
               top="85%" 
               label="Free Forever" 
               delay={0.5} 
               right 
               icon={<InfinityIcon className="w-5 h-5 text-blue-300" />}
             />
          </div>
        </div>
      </div>
    </div>
  );
}

// Enhanced Widget Component with Premium Design - Optimized for 4K
function NodeLine({ top, label, delay, right, icon }: { top: string; label: string; delay: number; right?: boolean; icon?: ReactNode }) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = nodeRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay * 1000);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div 
      ref={nodeRef}
      className={`absolute w-full flex items-center ${right ? 'justify-start pl-6' : 'justify-end pr-6'} group pointer-events-auto`}
      style={{ top }}
    >
      {/* Premium Widget Card - Optimized (removed blur effects) */}
      <div
        className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-3'
        }`}
        style={{ transitionDelay: `${delay}s` }}
      >
        {/* Outer Glow Container - No blur for 4K performance */}
        <div className="relative">
          {/* Optimized Glow Effect - using opacity instead of blur */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
          
          {/* Main Card with Border Gradient */}
          <div className="relative p-[1.5px] rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent shadow-xl">
            {/* Inner Content */}
            <div className={`
              relative flex items-center gap-4 px-5 py-4
              bg-gradient-to-br from-[#0f1729] to-[#0a0f1c] 
              rounded-2xl
              ${right ? 'flex-row' : 'flex-row-reverse'}
            `}>
              {/* Icon Container with Gradient Background - No blur */}
              <div className="relative flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 opacity-80" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-blue-400/30 flex items-center justify-center group-hover:scale-110 group-hover:border-blue-400/50 transition-all duration-300 shadow-lg">
                  <div className="text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                    {icon}
                  </div>
                </div>
              </div>

              {/* Text Content */}
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white/90 group-hover:text-white transition-colors duration-300 whitespace-nowrap">
                  {label}
                </span>
                <div className="h-0.5 w-0 group-hover:w-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-500 rounded-full mt-1" />
              </div>

              {/* Shine/Sparkle Effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Icons ---
const UnlockIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

const TimerIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const CloudUploadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
    <path d="M12 12v9"/><path d="m16 16-4-4-4 4"/>
  </svg>
);

const ZapIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
     <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const SmartphoneIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
  </svg>
);

const LinkIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
     <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
     <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const InfinityIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z"/>
  </svg>
);
