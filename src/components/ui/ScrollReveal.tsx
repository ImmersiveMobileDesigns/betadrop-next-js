"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: "slide-up" | "fade-in" | "scale-up";
  delay?: number; // in seconds
  duration?: number; // in seconds
}

export default function ScrollReveal({
  children,
  className = "",
  animation = "slide-up",
  delay = 0,
}: ScrollRevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Only animate once
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "50px", // Trigger slightly before it enters the viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const getAnimationClass = () => {
    switch (animation) {
      case "slide-up":
        return isVisible ? "animate-slide-up opacity-100" : "opacity-0 translate-y-5";
      case "fade-in":
        return isVisible ? "animate-fade-in opacity-100" : "opacity-0";
      case "scale-up":
        return isVisible ? "animate-scale-up opacity-100" : "opacity-0 scale-90";
      default:
        return "";
    }
  };

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClass()}`}
      style={{
        animationDelay: `${delay}s`,
        // We handle initial opacity via class, but ensure it stays hidden before animation
        opacity: isVisible ? 1 : 0, 
      }}
    >
      {children}
    </div>
  );
}
