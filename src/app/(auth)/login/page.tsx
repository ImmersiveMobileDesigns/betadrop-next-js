"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Mail,
  ArrowRight,
  Sparkles,
  Shield,
  Zap,
  Fingerprint,
  KeyRound,
  RefreshCw,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useToast } from "@/components/ui/Toast";

import { fetchFromLaravel } from "@/lib/api-client";

// ─── OTP Input Component ─────────────────────────────────────────────────────
function OtpInput({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, char: string) => {
    if (!/^\d*$/.test(char)) return; // digits only
    const digits = value.split("");
    digits[index] = char.slice(-1); // take last char
    const next = digits.join("").padEnd(6, "").slice(0, 6);
    onChange(next);
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const digits = value.split("");
      if (digits[index]) {
        digits[index] = "";
        onChange(digits.join("").padEnd(6, "").slice(0, 6));
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const d = value.split("");
        d[index - 1] = "";
        onChange(d.join("").padEnd(6, "").slice(0, 6));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    onChange(pasted.padEnd(6, "").slice(0, 6));
    const nextFocus = Math.min(pasted.length, 5);
    inputRefs.current[nextFocus]?.focus();
  };

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border transition-all duration-200
            bg-white/5 text-white placeholder-white/20
            ${
              value[i]
                ? "border-primary-500/70 bg-primary-500/10 shadow-lg shadow-primary-500/20"
                : "border-white/10 focus:border-primary-500/50 focus:bg-white/10 focus:ring-2 focus:ring-primary-500/20"
            }
            disabled:opacity-50 disabled:cursor-not-allowed outline-none`}
        />
      ))}
    </div>
  );
}

// ─── Main Login Form ──────────────────────────────────────────────────────────
function LoginForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // OTP state
  const [otpMode, setOtpMode] = useState(false); // true = show OTP input after email sent
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  // Resend cooldown — seconds remaining (0 = can resend)
  const [resendCooldown, setResendCooldown] = useState(0);
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Tick the cooldown timer down every second
  useEffect(() => {
    if (resendCooldown <= 0) return;
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(cooldownRef.current!);
  }, [resendCooldown]);

  const searchParams = useSearchParams();
  const { error: toastError, success: toastSuccess } = useToast();

  const errorParam = searchParams.get("error");
  const errorMessages: Record<string, string> = {
    missing_token: "Login link is missing. Please request a new one.",
    invalid_token:
      "Login link has expired or is invalid. Please request a new one.",
    google_auth_failed: "Google Sign-In failed. Please try again.",
    missing_params: "Google Sign-In was cancelled or failed. Please try again.",
    invalid_state: "For your security, please sign in again.",
    unverified_email: "Please verify your Google email address first.",
  };

  // ── Send magic link + OTP email (optimistic) ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Immediately show the "check your email" screen — don't wait for the API
    setIsSent(true);
    setOtpMode(false);

    // Fire the API in the background; snap back if it fails
    fetchFromLaravel("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    }).catch((err) => {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Please try again later";
      // Revert to the form and show the error
      setIsSent(false);
      setError(message);
      toastError(message);
    });
  };

  // ── Resend email (with cooldown + success toast) ──
  const handleResend = () => {
    if (resendCooldown > 0) return;

    // Start 60-second cooldown immediately
    setResendCooldown(60);
    setOtp("");
    setOtpError("");

    fetchFromLaravel("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
      .then(() => {
        toastSuccess("Email resent! Check your inbox.");
      })
      .catch((err) => {
        console.error(err);
        const message =
          err instanceof Error
            ? err.message
            : "Failed to resend. Please try again.";
        toastError(message);
        // Reset cooldown so they can try again right away after an error
        setResendCooldown(0);
      });
  };

  // ── Verify OTP ──
  const handleVerifyOtp = async () => {
    if (otp.replace(/\s/g, "").length !== 6) {
      setOtpError("Please enter the full 6-digit code.");
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError("");

    try {
      await fetchFromLaravel("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });
      toastSuccess("Signed in successfully!");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "Invalid or expired OTP. Please try again.";
      setOtpError(message);
      toastError(message);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // ── Passkey login ──
  const handlePasskeyLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      if (!window.PublicKeyCredential) {
        setError(
          "Your current browser doesn't support Passkeys. Please use Chrome, Edge, or Safari.",
        );
        return;
      }

      const optionsRes = await fetchFromLaravel<{
        success: boolean;
        data: any;
        error?: string;
      }>("/api/auth/passkey/login");

      if (!optionsRes.success) {
        setError(optionsRes.error || "Failed to start passkey login");
        return;
      }

      const { options, challenge } = optionsRes.data;
      const { startAuthentication } = await import("@simplewebauthn/browser");
      const authResponse = await startAuthentication({ optionsJSON: options });

      const verifyRes = await fetchFromLaravel<{
        success: boolean;
        error?: string;
      }>("/api/auth/passkey/login", {
        method: "POST",
        body: JSON.stringify({ response: authResponse, challenge }),
      });

      if (!verifyRes.success) {
        setError(verifyRes.error || "Passkey authentication failed");
        return;
      }

      window.location.href = "/dashboard";
    } catch (err: unknown) {
      console.error("Passkey login error:", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        setError("Passkey sign-in was cancelled.");
      } else if (err instanceof Error && err.name === "SecurityError") {
        setError("Security error. Make sure you're using HTTPS.");
      } else {
        setError(
          "Failed to authenticate with Passkey. Please try email login.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────
  // SENT STATE: show "check email" + OTP entry option
  // ─────────────────────────────────────────────────────────────────────────
  if (isSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-grid opacity-[0.05]" />
          <div className="bg-blob bg-blob-1 animate-float opacity-20" />
          <div
            className="bg-blob bg-blob-2 animate-float opacity-20"
            style={{ animationDelay: "2s" }}
          />
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="glass rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl shadow-black/20 text-center">
            {/* Icon */}
            <div className="relative mx-auto mb-8 w-20 h-20">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/30 to-green-500/30 animate-pulse" />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Mail className="w-9 h-9 text-white" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-white mb-3">
              Check Your Inbox
            </h1>
            <p className="text-white/60 mb-2 text-lg">
              We sent a sign-in link &amp; code to
            </p>
            <p className="text-white font-semibold text-lg mb-6 bg-white/5 rounded-xl py-2 px-4 inline-block">
              {email}
            </p>

            {/* Tab switcher */}
            <div className="flex rounded-xl overflow-hidden border border-white/10 mb-6">
              <button
                onClick={() => {
                  setOtpMode(false);
                  setOtpError("");
                  setOtp("");
                }}
                className={`flex-1 py-3 text-sm font-medium transition-all ${
                  !otpMode
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <Mail className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Magic Link
              </button>
              <button
                onClick={() => {
                  setOtpMode(true);
                  setOtpError("");
                }}
                className={`flex-1 py-3 text-sm font-medium transition-all ${
                  otpMode
                    ? "bg-white/10 text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                <KeyRound className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Enter OTP
              </button>
            </div>

            {/* Magic Link tab */}
            {!otpMode && (
              <p className="text-white/40 text-sm leading-relaxed">
                Click the link in the email to sign in instantly.
                <br />
                The link expires in 15 minutes.
              </p>
            )}

            {/* OTP tab */}
            {otpMode && (
              <div className="space-y-5">
                <p className="text-white/50 text-sm">
                  Enter the 6-digit code from your email
                </p>

                <OtpInput
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    setOtpError("");
                  }}
                  disabled={isVerifyingOtp}
                />

                {otpError && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                    {otpError}
                  </div>
                )}

                <button
                  onClick={handleVerifyOtp}
                  disabled={
                    isVerifyingOtp || otp.replace(/\s/g, "").length !== 6
                  }
                  className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  {isVerifyingOtp ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <span>Verify &amp; Sign In</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/10 flex flex-col gap-3">
              <button
                onClick={() => {
                  setIsSent(false);
                  setOtp("");
                  setOtpError("");
                  setOtpMode(false);
                }}
                className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors flex items-center justify-center gap-2 mx-auto group"
              >
                <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                Use a different email
              </button>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-white/30 hover:text-white/60 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors flex items-center justify-center gap-1.5 mx-auto"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${resendCooldown > 0 ? "animate-spin" : ""}`}
                  style={resendCooldown > 0 ? { animationDuration: "2s" } : {}}
                />
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend email"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DEFAULT: Email entry form
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="bg-blob bg-blob-1 animate-float opacity-20" />
        <div
          className="bg-blob bg-blob-2 animate-float opacity-20"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Left Side - Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10 items-center justify-center p-12">
        <div className="max-w-lg">
          <Logo width={56} height={56} className="mb-12" />

          <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
            Ship Your Apps <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-400">
              Faster Than Ever
            </span>
          </h1>

          <p className="text-xl text-white/60 mb-12 leading-relaxed">
            The simplest way to distribute iOS and Android beta apps to your
            testers. No waiting, no complexity.
          </p>

          {/* Feature Pills */}
          <div className="space-y-4">
            {[
              {
                icon: Zap,
                text: "Instant OTA Installation",
                color: "from-yellow-400 to-orange-500",
              },
              {
                icon: Shield,
                text: "Secure Access Links",
                color: "from-blue-400 to-cyan-500",
              },
              {
                icon: Sparkles,
                text: "Start for Free",
                color: "from-purple-400 to-pink-500",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-4 glass rounded-2xl px-5 py-4 border border-white/10 hover:border-white/20 transition-colors group"
              >
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-10">
            <Logo width={48} height={48} />
          </div>

          {/* Login Card */}
          <div className="glass rounded-3xl p-6 sm:p-8 lg:p-10 border border-white/10 shadow-2xl shadow-black/20">
            <div className="text-center mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-white/50">Sign in to access your dashboard</p>
            </div>

            {/* Error from URL params */}
            {errorParam && errorMessages[errorParam] && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs">!</span>
                </div>
                <p className="text-red-400 text-sm">
                  {errorMessages[errorParam]}
                </p>
              </div>
            )}

            {/* Error from form */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-5 py-4 mb-6 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-red-400 text-xs">!</span>
                </div>
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white/70 mb-3"
                >
                  Email Address
                </label>
                <div
                  className={`relative transition-all duration-300 ${isFocused ? "scale-[1.02]" : ""}`}
                >
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail
                      className={`w-5 h-5 transition-colors ${isFocused ? "text-primary-400" : "text-white/30"}`}
                    />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="you@example.com"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-400 hover:to-accent-400 text-white font-semibold py-4 rounded-xl shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <span>Continue with Email</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-white/30 text-sm">Or</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>
            {/* Google Sign-In Button */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || ""}/api/auth/google`}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group my-8"
            >
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </div>
              <span className="text-white/90">Continue with Google</span>
            </a>
            <button
              type="button"
              onClick={handlePasskeyLogin}
              disabled={isLoading}
              className="w-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-medium py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group mb-8"
            >
              <div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                <Fingerprint className="w-5 h-5 text-primary-400" />
              </div>
              <span className="text-white/90">Sign in with Passkey</span>
            </button>

            {/* Info Section */}
            <div className="flex items-center gap-4 glass rounded-2xl p-4 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-white/50 text-sm leading-relaxed">
                We&apos;ll send you a magic link{" "}
                <strong className="text-white/70">and</strong> a 6-digit OTP for
                instant, secure sign-in. No password needed!
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-white/30 text-sm mt-8">
            By signing in, you agree to our{" "}
            <Link
              href="/terms"
              className="text-white/50 hover:text-white transition-colors"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-white/50 hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center relative">
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-[0.05]" />
          </div>
          <div className="relative z-10">
            <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
