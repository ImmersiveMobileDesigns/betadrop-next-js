"use client";

import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionStyle } from "framer-motion";
import { ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface DepthLayerProps {
  children: ReactNode;
  className?: string;
  /** Depth level - higher values move faster (appear closer) */
  depth?: 1 | 2 | 3 | 4 | 5;
  /** Direction of movement */
  direction?: "vertical" | "horizontal" | "diagonal";
  /** Enable 3D perspective transform */
  perspective?: boolean;
  /** Scale change range */
  scaleRange?: [number, number];
}

export function DepthLayer({
  children,
  className,
  depth = 2,
  direction = "vertical",
  perspective = false,
  scaleRange,
}: DepthLayerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Speed multiplier based on depth (higher depth = faster movement = feels closer)
  const speedMultiplier = depth * 15;

  const springConfig = { stiffness: 80, damping: 25 };

  // Movement transforms
  const yMovement = useSpring(
    useTransform(scrollYProgress, [0, 1], [speedMultiplier, -speedMultiplier]),
    springConfig
  );

  const xMovement = useSpring(
    useTransform(scrollYProgress, [0, 1], [speedMultiplier * 0.5, -speedMultiplier * 0.5]),
    springConfig
  );

  // Scale transform - always call hooks unconditionally
  const defaultScaleRange: [number, number] = scaleRange || [1, 1];
  const scaleTransform = useTransform(
    scrollYProgress, 
    [0, 0.5, 1], 
    [defaultScaleRange[0], defaultScaleRange[1], defaultScaleRange[0]]
  );
  // Only apply scale if scaleRange was provided
  const scale = scaleRange ? scaleTransform : undefined;

  // 3D rotation for perspective effect
  const rotateX = useTransform(scrollYProgress, [0, 0.5, 1], [2, 0, -2]);
  const rotateY = useTransform(scrollYProgress, [0, 0.5, 1], [-1, 0, 1]);

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Build style object based on direction
  const getStyle = (): MotionStyle => {
    const style: MotionStyle = {};

    switch (direction) {
      case "vertical":
        style.y = yMovement;
        break;
      case "horizontal":
        style.x = xMovement;
        break;
      case "diagonal":
        style.y = yMovement;
        style.x = xMovement;
        break;
    }

    if (scale) style.scale = scale;
    if (perspective) {
      style.rotateX = rotateX;
      style.rotateY = rotateY;
    }

    return style;
  };

  return (
    <motion.div
      ref={ref}
      style={getStyle()}
      className={cn(
        "will-change-transform",
        perspective && "transform-gpu",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Layered parallax container with multiple depth layers
interface ParallaxSceneProps {
  children: ReactNode;
  className?: string;
  /** Enable perspective origin */
  perspective?: boolean;
}

export function ParallaxScene({
  children,
  className,
  perspective = true,
}: ParallaxSceneProps) {
  return (
    <div
      className={cn(
        "relative",
        className
      )}
      style={{
        perspective: perspective ? "1000px" : undefined,
        perspectiveOrigin: "center center",
      }}
    >
      {children}
    </div>
  );
}

// Floating decorative elements
interface FloatingOrbProps {
  className?: string;
  size?: number;
  color?: string;
  blur?: number;
  speed?: number;
  delay?: number;
}

export function FloatingOrb({
  className,
  size = 200,
  color = "rgba(59, 130, 246, 0.15)",
  blur = 60,
  speed = 1,
  delay = 0,
}: FloatingOrbProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        className={cn("absolute rounded-full pointer-events-none", className)}
        style={{
          width: size,
          height: size,
          background: color,
          filter: `blur(${blur}px)`,
        }}
      />
    );
  }

  return (
    <motion.div
      className={cn("absolute rounded-full pointer-events-none", className)}
      style={{
        width: size,
        height: size,
        background: color,
        filter: `blur(${blur}px)`,
      }}
      animate={{
        y: [-20, 20, -20],
        x: [-10, 10, -10],
        scale: [1, 1.05, 1],
      }}
      transition={{
        duration: 6 / speed,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );
}

// Section wrapper with scroll-triggered reveal
interface RevealSectionProps {
  children: ReactNode;
  className?: string;
  /** ID for anchor links */
  id?: string;
  /** Animation direction */
  from?: "bottom" | "top" | "left" | "right";
  /** Amount of movement */
  distance?: number;
  /** Animation duration */
  duration?: number;
  /** Delay before animation */
  delay?: number;
}

export function RevealSection({
  children,
  className,
  id,
  from = "bottom",
  distance = 100,
  duration = 0.9,
  delay = 0,
}: RevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const initialPosition = {
    bottom: { y: distance, x: 0 },
    top: { y: -distance, x: 0 },
    left: { x: -distance, y: 0 },
    right: { x: distance, y: 0 },
  };

  if (shouldReduceMotion) {
    return <div id={id} className={className}>{children}</div>;
  }

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{
        opacity: 0,
        ...initialPosition[from],
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.section>
  );
}
