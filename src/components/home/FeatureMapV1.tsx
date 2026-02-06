'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FeatureNodeProps {
  side: 'left' | 'right';
  label: string;
  delay: number;
  mobileHidden?: boolean;
}

const FeatureNode = ({ side, label, delay, mobileHidden }: FeatureNodeProps) => {
  const isLeft = side === 'left';
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'right-full mr-8' : 'left-full ml-8'} 
        hidden lg:flex items-center ${isLeft ? 'flex-row-reverse' : 'flex-row'} gap-4 w-48`}
    >
      <div className="h-[1px] w-8 bg-blue-500/30" />
      <div className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md whitespace-nowrap text-sm text-gray-300 shadow-lg hover:border-blue-500/50 hover:bg-blue-500/10 transition-colors cursor-default">
        {label}
      </div>
    </motion.div>
  );
};

export default function FeatureMap({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-12">
      {/* Background radial gradient to highlight the center */}
      <div className="absolute inset-0 bg-blue-600/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Main Content (The Upload Box) */}
      <div className="relative z-10 flex justify-center">
        <div className="w-full max-w-2xl relative">
          {children}

          {/* Left Side Nodes - Positioned absolute relative to the upload box container */}
          <div className="absolute top-[0%] left-0 -translate-x-full h-full hidden xl:block w-64 pointer-events-none">
            <NodeLine top="15%" label="No Login Required" delay={0.2} />
            <NodeLine top="38%" label="24 Hours Expiry" delay={0.3} />
            <NodeLine top="62%" label="Simple Drag & Drop" delay={0.4} />
            <NodeLine top="85%" label="Fast Upload Speed" delay={0.5} />
          </div>

          {/* Right Side Nodes */}
          <div className="absolute top-[0%] right-0 translate-x-full h-full hidden xl:block w-64 pointer-events-none">
             <NodeLine top="15%" label="Smart Device Detection" delay={0.2} right />
             <NodeLine top="38%" label="Instant Link Generation" delay={0.3} right />
             <NodeLine top="62%" label="Unlimited Downloads" delay={0.4} right />
             <NodeLine top="85%" label="Free Forever" delay={0.5} right />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Line + Label component
function NodeLine({ top, label, delay, right }: { top: string; label: string; delay: number; right?: boolean }) {
  const safeLabel = label.replace(/\s+/g, '-').toLowerCase();
  const gradientId = `gradient-${safeLabel}`;
  const borderGradientId = `gradient-border-${safeLabel}`;

  return (
    <motion.div 
      initial={{ opacity: 0, x: right ? -20 : 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ 
        opacity: { delay, duration: 0.6 },
        x: { delay, duration: 0.6 }
      }}
      className={`absolute w-full flex items-center ${right ? 'flex-row' : 'flex-row-reverse'}`}
      style={{ top }}
    >
      {/* Connector Line */}
      <svg className={`w-16 h-8 ${right ? '' : 'transform scale-x-[-1]'}`} viewBox="0 0 64 32" fill="none">
        {/* Background static line */}
        <path d="M0 32C0 32 15 32 25 32C45 32 35 2 64 2" stroke="currentColor" strokeWidth="1.5" className="text-blue-500/10" />
        
        {/* Animated flow line - Continuous "Light" Effect */}
        <motion.path 
          d="M0 32C0 32 15 32 25 32C45 32 35 2 64 2" 
          stroke={`url(#${gradientId})`}
          strokeWidth="2"
          strokeLinecap="round"
          className="drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]"
          initial={{ pathLength: 0.3, opacity: 0, pathOffset: 0 }}
          animate={{ pathOffset: [0, 1], opacity: [0, 1, 0] }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity, 
            ease: "linear",
            repeatDelay: 2.5 
          }}
        />

        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="0.5" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#60a5fa" />
          </linearGradient>
        </defs>

        {/* Pulsing Dot */}
        <motion.circle 
          cx="62" 
          cy="2" 
          r="2" 
          fill="#60a5fa"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx="62" cy="2" r="1" fill="white" className="blur-[0.5px]" />
      </svg>
      
      {/* Label with Synced Animated SVG Border */}
      <motion.div 
        whileHover={{ scale: 1.05 }}
        className="mt-[-30px] mx-2 relative group cursor-default"
      >
        <div className="relative rounded-xl bg-[#0B1121]/90 backdrop-blur-md overflow-hidden">
            {/* Animated SVG Border */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              <defs>
                <linearGradient id={borderGradientId} x1="0" y1="0" x2="100%" y2="0" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#3b82f6" />
                  <stop offset="1" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
              <motion.rect
                x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)"
                rx="11" ry="11"
                fill="none"
                stroke={`url(#${borderGradientId})`}
                strokeWidth="2"
                initial={{ pathLength: 0.3, opacity: 0, pathOffset: 0 }}
                animate={{ pathOffset: [0, 1], opacity: [0, 1, 0] }}
                transition={{ 
                  duration: 2.5,
                  repeat: Infinity, 
                  ease: "linear",
                  repeatDelay: 1.5,
                  delay: 1.5 
                }}
              />
               {/* Static faint border */}
              <rect x="1" y="1" width="calc(100% - 2px)" height="calc(100% - 2px)" rx="11" ry="11" fill="none" stroke="rgba(59,130,246,0.2)" strokeWidth="1" />
            </svg>

            {/* Inner Content */}
            <div className="px-5 py-2.5 relative z-0">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400 group-hover:from-white group-hover:to-blue-200 transition-all duration-300 text-sm font-medium">
                  {label}
                </span>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
