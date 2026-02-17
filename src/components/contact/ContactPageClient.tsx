"use client";

import { useState } from "react";
import axios from "axios";
import { Send, Mail, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import Logo from "@/components/ui/Logo";
import Header from "@/components/layout/Header";
import { useToast } from "@/components/ui/Toast";
import ScrollToTop from "@/components/ui/ScrollToTop";
import {
  BlurIn,
  AnimateOnScroll,
} from "@/components/animations/AnimateOnScroll";

export default function ContactPageClient() {
  const { error, success } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/contact`, form);
      success("Message sent successfully! We'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (err: any) {
      console.error(err);
      error(
        err.response?.data?.message ||
          "Failed to send message. Please try again later.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="bg-blob bg-blob-1 opacity-50" />
        <div className="bg-blob bg-blob-2 opacity-50" />
        <div className="bg-grid fixed inset-0 z-0 pointer-events-none opacity-50" />

        <div className="max-w-6xl mx-auto relative z-10">
          <BlurIn duration={600} className="w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
              {/* Left Column: Text Content */}
              <div className="space-y-8 lg:sticky lg:top-32">
                <div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                    Get in{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Touch
                    </span>
                  </h1>
                  <p className="text-lg text-white/60 leading-relaxed max-w-lg">
                    Have questions about BetaDrop? Need help with an upload?
                    We're here to help you simplify your app distribution
                    workflow.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                        <Mail className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Email Us
                        </h3>
                        <p className="text-white/40 text-sm mb-2">
                          For general inquiries and support
                        </p>
                        <a
                          href="mailto:info@imobiledesigns.com"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          info@imobiledesigns.com
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors group">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          Support
                        </h3>
                        <p className="text-white/40 text-sm mb-2">
                          Technical issues or bug reports
                        </p>
                        <span className="text-white/60">
                          Fill out the form for the fastest response
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Contact Form */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                {/* Glow effect under form */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur-xl opacity-50" />

                <div className="relative bg-[#0B1121]/80 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl">
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    Send us a Message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/50 pl-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/50 pl-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-white/50 pl-1">
                        Message
                      </label>
                      <textarea
                        rows={5}
                        value={form.message}
                        onChange={(e) =>
                          setForm({ ...form, message: e.target.value })
                        }
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-[1px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
                      <div className="relative bg-[#0B1121] bg-opacity-90 hover:bg-opacity-0 transition-all duration-300 rounded-[11px] py-4 px-6 flex items-center justify-center gap-2">
                        <span className="font-semibold text-white">
                          {isSubmitting ? "Sending Message..." : "Send Message"}
                        </span>
                        {!isSubmitting && (
                          <Send className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          </BlurIn>
        </div>
      </main>

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
                  href="/contact"
                  className="hover:text-white transition-colors text-white"
                >
                  Contact
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

      <ScrollToTop />
    </>
  );
}
