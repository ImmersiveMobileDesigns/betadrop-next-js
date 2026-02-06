"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";
import { User } from "lucide-react";
import { useUserSession } from "@/hooks/queries";

interface SessionUser {
  id: string;
  email: string;
  name?: string;
  role: string;
}

export default function Header() {
  /* 
   * React Query handles data fetching and state (loading, error, data). 
   * The 'user' variable will automatically update.
   */
  const { data: user, isLoading } = useUserSession();
  const pathname = usePathname();
  const router = useRouter();

  // useEffect removed as logic is now handled by the hook

  // Handle navigation with hash scrolling
  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Check if this is a hash link to the home page
    if (href.startsWith("/#")) {
      const hash = href.substring(1); // Get the hash part (e.g., "#features")
      
      if (pathname === "/") {
        // Already on home page, just scroll to the section
        e.preventDefault();
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
          // Remove hash from URL after scrolling
          window.history.replaceState(null, "", "/");
        }
      } else {
        // On a different page, navigate to home with hash
        e.preventDefault();
        
        // Navigate to home page with the hash
        router.push("/" + hash);
        
        // Poll for the element to appear and scroll to it
        const scrollToElement = () => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
            // Remove hash from URL after scrolling
            setTimeout(() => {
              window.history.replaceState(null, "", "/");
            }, 100);
            return true;
          }
          return false;
        };
        
        // Try immediately, then poll every 50ms for up to 2 seconds
        let attempts = 0;
        const maxAttempts = 40; // 40 * 50ms = 2 seconds
        const pollInterval = setInterval(() => {
          if (scrollToElement() || attempts >= maxAttempts) {
            clearInterval(pollInterval);
          }
          attempts++;
        }, 50);
      }
    }
  };

  // Extract display name from email (part before @)
  const getDisplayName = (email: string) => {
    return email.split("@")[0];
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 pt-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Outer glow effect container */}
        <div className="relative group">
          {/* Animated gradient border */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Main navbar container */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between h-14 px-4 sm:px-6">
              {/* Left side - Logo with optional breadcrumb */}
              <div className="flex items-center gap-3">
                <Logo />
              </div>

              {/* Center - Navigation links (hidden on mobile) */}
              <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                {[
                  { name: "Features", href: "/#features" },
                  { name: "How it Works", href: "/#how-it-works" },
                  { name: "FAQ", href: "/#faq" },
                  { name: "Blog", href: "/blog" },
                ].map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavigation(e, link.href)}
                    className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Right side - CTA Buttons */}
              <div className="flex items-center gap-3">
                {/* Loading state */}
                {isLoading ? (
                  <div className="px-5 py-2 text-sm font-semibold text-white/40 rounded-xl bg-white/5">
                    <span className="inline-block w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                  </div>
                ) : user ? (
                  /* Logged in - Show "Continue as [name]" button */
                  <Link
                    href="/dashboard"
                    className="relative group/btn inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Button gradient background - green/teal for logged in state */}
                    <span className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-600" />
                    {/* Shimmer effect on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    {/* Glow */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-emerald-500/50 blur-xl rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">
                        Continue as{" "}
                        <span className="font-bold">
                          {getDisplayName(user.email)}
                        </span>
                      </span>
                      <span className="sm:hidden">Dashboard</span>
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Link>
                ) : (
                  /* Not logged in - Show "Sign In" button */
                  <Link
                    href="/login"
                    className="relative group/btn inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02]"
                  >
                    {/* Button gradient background */}
                    <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600" />
                    {/* Shimmer effect on hover */}
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                    {/* Glow */}
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-blue-500/50 blur-xl rounded-full opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-2">
                      Sign In
                      <svg
                        className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
