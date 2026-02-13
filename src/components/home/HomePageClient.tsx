"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Upload,
  Share2,
  Smartphone,
  Shield,
  Zap,
  Globe,
  Infinity as InfinityIcon,
  FileBox,
  Lock,
  Download,
  Users,
} from "lucide-react";
import { AnimateOnScroll } from "@/components/animations/AnimateOnScroll";
import { CountUp } from "@/components/animations/CountUp";

import Logo from "@/components/ui/Logo";
import Header from "@/components/layout/Header";
import HeroSectionVariation1 from "@/components/home/HeroSectionVariation1";
import MacBookShowcase from "@/components/home/MacBookShowcase";
import MacBookShowcaseMobile from "@/components/home/MacBookShowcaseMobile";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { usePlatformStats } from "@/hooks/queries";
import { Accordion } from "@/components/ui/Accordion";
import HeroSectionVariation2 from "./HeroSectionVariation2";

export default function HomePageClient() {
  const { data: stats } = usePlatformStats();
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/tablet on client side
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const defaultStats = {
    totalUploads: 0,
    totalDownloads: 0,
    totalDevelopers: 0,
    uptime: "99.9%",
  };

  const currentStats = stats || defaultStats;

  return (
    <>
      <Header />

      {/* Hero Section */}
      <HeroSectionVariation1 />

      {/* Stats Section */}
      <AnimateOnScroll
        animation="fadeIn"
        duration={600}
        threshold={0.3}
        className="border-y border-white/5 bg-white/[0.02] relative z-10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                label: "Uploads",
                value: currentStats.totalUploads,
                icon: Upload,
              },
              {
                label: "Downloads",
                value: currentStats.totalDownloads,
                icon: Download,
              },
              {
                label: "Developers",
                value: currentStats.totalDevelopers,
                icon: Users,
              },
              { label: "Uptime", value: currentStats.uptime, icon: Zap },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center text-center"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-2 p-2 rounded-lg bg-white/5 text-primary-400">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                  {typeof stat.value === "number" ? (
                    <CountUp value={stat.value} compact suffix="+" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm text-white/40 font-medium uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateOnScroll>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll
            animation="fadeUp"
            duration={700}
            threshold={0.2}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              Get your beta app into testers&apos; hands in minutes, not days.
              Simple, fast, and secure distribution.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fadeUp" duration={600} threshold={0.2}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Upload",
                  description: "Drag and drop your IPA or APK file directly.",
                  icon: FileBox,
                  color: "text-blue-400",
                },
                {
                  step: "02",
                  title: "Get Link",
                  description:
                    "Receive a secure, shareable install link instantly.",
                  icon: Share2,
                  color: "text-purple-400",
                },
                {
                  step: "03",
                  title: "Share",
                  description:
                    "Send the link to testers via any messaging app.",
                  icon: Globe,
                  color: "text-pink-400",
                },
                {
                  step: "04",
                  title: "Install",
                  description:
                    "Testers tap to install directly on their device.",
                  icon: Smartphone,
                  color: "text-emerald-400",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="h-full p-6 glass rounded-3xl hover:bg-white/10 transition-all duration-300 group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 font-bold text-4xl group-hover:scale-110 transition-transform">
                    {item.step}
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 ${item.color}`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 relative z-10 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll
            animation="fadeUp"
            duration={700}
            threshold={0.2}
            className="text-center mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6">
              Why Choose BetaDrop?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto">
              Everything you need for professional beta distribution, without
              the complexity.
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll animation="fadeUp" duration={600} threshold={0.15}>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "30-Day Hosting",
                  description:
                    "Sign in to get links available for 30 days. Guest uploads expire in 3 days.",
                  icon: InfinityIcon,
                  gradient: "from-green-500/20 to-emerald-500/20",
                  iconColor: "text-emerald-400",
                },
                {
                  title: "iOS OTA Install",
                  description:
                    "Install IPA files directly on iOS devices without TestFlight or enterprise certificates.",
                  icon: Smartphone,
                  gradient: "from-blue-500/20 to-cyan-500/20",
                  iconColor: "text-blue-400",
                },
                {
                  title: "Instant Sharing",
                  description:
                    "Get a shareable link the moment your upload completes. Share via any channel.",
                  icon: Zap,
                  gradient: "from-yellow-500/20 to-orange-500/20",
                  iconColor: "text-orange-400",
                },
                {
                  title: "No App Store Required",
                  description:
                    "Bypass app store review processes. Perfect for internal builds and quick testing.",
                  icon: Lock,
                  gradient: "from-red-500/20 to-rose-500/20",
                  iconColor: "text-rose-400",
                },
                {
                  title: "Device Detection",
                  description:
                    "Smart install pages that show the right options for iOS, Android, or desktop users.",
                  icon: Smartphone,
                  gradient: "from-purple-500/20 to-violet-500/20",
                  iconColor: "text-purple-400",
                },
                {
                  title: "Privacy First",
                  description:
                    "Private by default with AES-256 encryption, signed secure links, and clear retention rules. We don't sell data.",
                  icon: Shield,
                  gradient: "from-cyan-500/20 to-teal-500/20",
                  iconColor: "text-cyan-400",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="h-full p-8 rounded-3xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed text-xs sm:text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* MacBook Product Showcase - Different component for mobile (no GSAP) */}
      {isMobile ? <MacBookShowcaseMobile /> : <MacBookShowcase />}

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll
            animation="fadeUp"
            duration={700}
            threshold={0.2}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-white/60">
              Common questions about beta app distribution
            </p>
          </AnimateOnScroll>

          <AnimateOnScroll
            animation="fadeUp"
            duration={600}
            delay={100}
            threshold={0.2}
          >
            <Accordion
              items={[
                {
                  q: "What is beta app distribution?",
                  a: "Beta app distribution is the process of sharing pre-release iOS or Android apps with testers using secure installation links without publishing them to app stores. It allows developers to gather feedback before public release.",
                },
                {
                  q: "How do I install an IPA without TestFlight?",
                  a: "BetaDrop uses Over-The-Air (OTA) distribution to install IPA files directly on iOS devices. When you upload an IPA, we generate a manifest.plist and install link that uses Apple's itms-services protocol. Testers simply tap the link to install.",
                },
                {
                  q: "Is BetaDrop really free?",
                  a: "Yes! BetaDrop is 100% free with no paid plans. We believe beta testing should be accessible to all developers, regardless of budget.",
                },
                {
                  q: "Do testers need to create accounts?",
                  a: "No, testers don't need accounts. They simply open the install link you share with them and tap to install. However, for iOS apps, their device UUID must be registered in your provisioning profile.",
                },
                {
                  q: "What file types are supported?",
                  a: "BetaDrop supports iOS IPA files (up to 512MB) and Android APK files (up to 512MB).",
                },
              ]}
              className="space-y-4"
            />
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA Section */}
      <AnimateOnScroll
        animation="scaleIn"
        duration={800}
        threshold={0.2}
        className="py-24 px-4 relative z-10"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-indigo-500/20 to-purple-500/20 border border-white/10 p-12 md:p-20">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Distribute?
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-white/60 mb-10 max-w-xl mx-auto">
                Join developers who trust BetaDrop for their testing needs. Get
                specific shareable links in seconds.
              </p>
              <Link
                href="/login"
                className="btn-primary text-lg px-8 py-4 shadow-xl shadow-primary-500/30 hover:scale-105 transition-transform inline-block"
              >
                Get Started Free
              </Link>
            </div>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Footer */}
      <AnimateOnScroll
        animation="fadeUp"
        duration={600}
        threshold={0.3}
        once={true}
      >
        <footer className="py-12 px-4 border-t border-white/10 relative z-10 bg-black/20">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <Logo />
                <span className="text-white/40 text-sm hidden sm:inline">
                  Free iOS & Android beta distribution
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/40">
                <Link
                  href="/blog"
                  className="hover:text-white transition-colors"
                >
                  Blog
                </Link>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms
                </Link>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  href="/login"
                  className="hover:text-white transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 text-center text-sm text-white/30">
              © {new Date().getFullYear()} BetaDrop. All rights reserved.
            </div>
          </div>
        </footer>
      </AnimateOnScroll>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
