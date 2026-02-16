"use client";

import { Upload, Share2, Smartphone } from "lucide-react";
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll";
import GuestUpload from "@/components/guest/GuestUpload";
import FeatureMap from "@/components/home/FeatureMap";
import DeveloperFeatures from "@/components/home/DeveloperFeatures";

interface HeroSectionProps {
  droppedFile?: File | null;
}

export default function HeroSectionVariation2({
  droppedFile,
}: HeroSectionProps) {
  return (
    <section
      className="relative pt-32 pb-10 px-4 z-10 overflow-visible"
      style={{ contain: "layout" }}
    >
      <div className="max-w-7xl mx-auto text-center relative">
        {/* Top Pill */}
        <AnimateOnScroll
          animation="fadeDown"
          duration={600}
          threshold={0.2}
          className="inline-flex justify-center mb-8"
        >
          <div className="glass px-4 py-1.5 rounded-full flex items-center gap-2 text-sm text-blue-200/80 hover:bg-white/5 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="font-medium">
              The New Standard in Beta Distribution
            </span>
          </div>
        </AnimateOnScroll>

        {/* Main Headline */}
        <AnimateOnScroll
          animation="fadeUp"
          duration={800}
          delay={100}
          threshold={0.2}
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-8 tracking-tighter leading-[1.1]">
            Ship Apps{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-blue-400 animate-shimmer bg-[length:200%_auto]">
              Faster
            </span>
          </h1>
        </AnimateOnScroll>

        {/* Description */}
        <AnimateOnScroll
          animation="fadeUp"
          duration={700}
          delay={200}
          threshold={0.2}
        >
          <p className="text-base sm:text-lg md:text-xl text-blue-200/60 mb-12 max-w-3xl mx-auto leading-relaxed">
            BetaDrop is the{" "}
            <span className="text-white font-medium">simplest way</span> to
            share Android & iOS builds. No waiting for reviews, no complicated
            portals. Just upload and share.
          </p>
        </AnimateOnScroll>

        {/* Process Steps Visual */}
        <AnimateOnScroll
          animation="scaleIn"
          duration={600}
          delay={300}
          threshold={0.2}
          className="hidden md:inline-flex mb-5 items-center gap-0 p-1.5 rounded-full glass border border-white/10"
        >
          {/* Step 1 */}
          <div className="px-5 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-[11px] font-bold shadow-lg shadow-blue-500/30">
              <Upload className="w-3 h-3" />
            </div>
            Upload Build
          </div>

          {/* Connector 1 */}
          <div className="w-8 h-[2px] bg-gradient-to-r from-blue-500/40 to-purple-500/40" />

          {/* Step 2 */}
          <div className="px-5 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-[11px] font-bold shadow-lg shadow-purple-500/30">
              <Share2 className="w-3 h-3" />
            </div>
            Get Link
          </div>

          {/* Connector 2 */}
          <div className="w-8 h-[2px] bg-gradient-to-r from-purple-500/40 to-pink-500/40" />

          {/* Step 3 */}
          <div className="px-5 py-2.5 rounded-full text-sm font-medium text-white flex items-center gap-3 hover:bg-white/5 transition-colors">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-[11px] font-bold shadow-lg shadow-pink-500/30">
              <Smartphone className="w-3 h-3" />
            </div>
            Testers Install
          </div>
        </AnimateOnScroll>

        {/* Feature Map */}
        <div id="upload-section" className="scroll-mt-24" />
        <AnimateOnScroll
          animation="fadeUp"
          duration={700}
          delay={400}
          threshold={0.1}
          className="mb-20"
        >
          <FeatureMap>
            <GuestUpload droppedFile={droppedFile} />
          </FeatureMap>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
