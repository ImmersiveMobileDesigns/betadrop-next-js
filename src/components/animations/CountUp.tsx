"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

interface CountUpProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
  compact?: boolean; 
}

export function CountUp({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
  className,
  compact = false,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
    duration: duration * 1000,
  });
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {

    return springValue.on("change", (latest) => {
      if (ref.current) {
        let formattedStr = "";
        if (compact) {
          formattedStr = Intl.NumberFormat('en-US', {
            notation: "compact",
            maximumFractionDigits: 1
          }).format(Math.floor(latest));
        } else {
           formattedStr = Math.floor(latest).toLocaleString();
        }
        ref.current.textContent = `${prefix}${formattedStr}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix, compact]);

  // Initial render content to avoid layout shift or empty space
  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
