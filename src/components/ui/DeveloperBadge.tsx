"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import styles from "./DeveloperBadge.module.css";

export default function DeveloperBadge() {
  return (
    <div className={`fixed bottom-2 left-2 sm:bottom-4 sm:left-4 z-50 ${styles.fadeInUp}`}>
      <Link
        href="https://imobiledesigns.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={`
            flex items-center gap-1.5 sm:gap-2
            bg-white/90 backdrop-blur-md
            border border-gray-200
            rounded-full px-2 py-1.5 sm:px-3 sm:py-2
            shadow-lg
            ${styles.badge}
          `}
        >
          {/* Logo */}
          <div className="w-5 h-5 sm:w-6 sm:h-6 relative flex-shrink-0">
            <Image
              src="/images/logo/imd-small-logo.png"
              alt="iMobile Designs"
              fill
              className="object-contain"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col">
            <span className="text-[10px] sm:text-xs font-medium text-[#0B3C5D] whitespace-nowrap">
              Developed by{" "}
              <span className="text-[#0A84FF] font-semibold">
                iMobile Designs
              </span>
            </span>

            {/* India Section */}
            <div className="flex items-center gap-1 text-[9px] sm:text-[11px] font-medium text-[#0B3C5D]/80 whitespace-nowrap">
              <span>Made with</span>
              <Heart className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-500 fill-red-500" />
              <span>in India</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
