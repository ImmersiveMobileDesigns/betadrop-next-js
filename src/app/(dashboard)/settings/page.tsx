"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import {
  Fingerprint,
  Plus,
  Trash2,
  Shield,
  ArrowLeft,
  Smartphone,
  Laptop,
  Key,
  CheckCircle,
  AlertCircle,
  Package,
  Link,
  Download,
  Clock,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { getDeviceId } from "@/lib/device-id";
import { fetchFromLaravel } from "@/lib/api-client";
import {
  useUserSession,
  usePasskeys,
  useGuestUploads,
  type Passkey,
  type GuestUpload,
} from "@/hooks/queries";
import { DataPrivacySection } from "@/components/compliance/DataPrivacySection";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimToken, setClaimToken] = useState("");
  const [searchToken, setSearchToken] = useState<string | undefined>(undefined);

  // Use React Query hooks - prevents duplicate API calls
  const { data: user, isLoading: isLoadingUser } = useUserSession();
  const {
    data: passkeys = [],
    isLoading: isLoadingPasskeys,
    refetch: refetchPasskeys,
  } = usePasskeys();

  const deviceId = typeof window !== "undefined" ? getDeviceId() : null;
  const {
    data: guestData,
    isLoading: isLoadingGuest,
    refetch: refetchGuestUploads,
  } = useGuestUploads(deviceId, searchToken);

  const guestUploads = guestData?.available || [];
  const claimedUploads = guestData?.claimed || [];
  const isLoading = isLoadingPasskeys;

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [isLoadingUser, user, router]);

  const claimGuestUpload = async (guestUploadId: string) => {
    setClaimingId(guestUploadId);
    setMessage(null);

    try {
      const data = await fetchFromLaravel<{
        success: boolean;
        message?: string;
        error?: string;
      }>("/api/guest/claim", {
        method: "POST",
        body: JSON.stringify({ guestUploadId }),
      });

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Upload claimed successfully!",
        });
        refetchGuestUploads(); // Refresh the list
        queryClient.invalidateQueries({ queryKey: ["builds"] });
        queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
        router.refresh();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to claim upload",
        });
      }
    } catch (err) {
      console.error("Failed to claim upload:", err);
      setMessage({ type: "error", text: "Failed to claim upload" });
    } finally {
      setClaimingId(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleClaimByToken = () => {
    if (claimToken.trim()) {
      setSearchToken(claimToken.trim()); // This will trigger a refetch with the new token
    }
  };

  const registerPasskey = async () => {
    setIsRegistering(true);
    setMessage(null);

    try {
      // Check WebAuthn support
      if (!window.PublicKeyCredential) {
        setMessage({
          type: "error",
          text: "Your browser does not support passkeys.",
        });
        return;
      }

      // Check if platform authenticator is available
      const available =
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      if (!available) {
        setMessage({
          type: "error",
          text: "No passkey authenticator found on this device.",
        });
        return;
      }

      // Get registration options
      const optionsData = await fetchFromLaravel<{
        success: boolean;
        data: { options: any };
        error?: string;
      }>("/api/auth/passkey/register");

      if (!optionsData.success) {
        setMessage({
          type: "error",
          text: optionsData.error || "Failed to start registration",
        });
        return;
      }

      const { options } = optionsData.data;

      // Start WebAuthn registration
      const { startRegistration } = await import("@simplewebauthn/browser");
      const regResponse = await startRegistration({ optionsJSON: options });

      // Verify with server
      const verifyData = await fetchFromLaravel<{
        success: boolean;
        error?: string;
      }>("/api/auth/passkey/register", {
        method: "POST",
        body: JSON.stringify({ response: regResponse }),
      });

      if (!verifyData.success) {
        setMessage({
          type: "error",
          text: verifyData.error || "Registration failed",
        });
        return;
      }

      setMessage({
        type: "success",
        text: "Passkey registered successfully! You can now use it to sign in.",
      });
      refetchPasskeys();
    } catch (err: unknown) {
      console.error("Passkey registration error:", err);
      if (err instanceof Error && err.name === "NotAllowedError") {
        setMessage({ type: "error", text: "Registration was cancelled." });
      } else if (err instanceof Error && err.name === "InvalidStateError") {
        setMessage({
          type: "error",
          text: "This passkey is already registered.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Failed to register passkey. Please try again.",
        });
      }
    } finally {
      setIsRegistering(false);
    }
  };

  const deletePasskey = async (id: string) => {
    if (!confirm("Are you sure you want to delete this passkey?")) return;

    try {
      const data = await fetchFromLaravel<{ success: boolean; error?: string }>(
        `/api/auth/passkey/register?id=${id}`,
        {
          method: "DELETE",
        },
      );

      if (data.success) {
        setMessage({ type: "success", text: "Passkey deleted successfully." });
        refetchPasskeys();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete passkey",
        });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete passkey" });
    }
  };

  const getDeviceIcon = (deviceType: string | null) => {
    if (!deviceType) return Key;
    if (deviceType.includes("single") || deviceType === "singleDevice")
      return Smartphone;
    return Laptop;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen relative">
      {/* Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.05]" />
        <div className="bg-blob bg-blob-1 animate-float opacity-20" />
        <div
          className="bg-blob bg-blob-2 animate-float opacity-20"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-dark-900/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white/70" />
              </button>
              <Logo width={32} height={32} />
              <div>
                <h1 className="text-xl font-bold text-white">Settings</h1>
                <p className="text-sm text-white/50">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Message */}
        {message && (
          <div
            className={`mb-6 rounded-xl p-4 flex items-start gap-3 ${
              message.type === "success"
                ? "bg-emerald-500/10 border border-emerald-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={
                message.type === "success" ? "text-emerald-400" : "text-red-400"
              }
            >
              {message.text}
            </p>
          </div>
        )}

        {/* Passkeys Section */}
        <div className="glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                  <Fingerprint className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Passkeys</h2>
                  <p className="text-sm text-white/50">
                    Sign in with fingerprint, Face ID, or security key
                  </p>
                </div>
              </div>
              <button
                onClick={registerPasskey}
                disabled={isRegistering}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-400 text-white font-medium transition-colors disabled:opacity-50"
              >
                {isRegistering ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
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
                    <span>Registering...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Add Passkey</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
              </div>
            ) : passkeys.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-white font-medium mb-2">
                  No passkeys registered
                </h3>
                <p className="text-white/50 text-sm max-w-sm mx-auto">
                  Add a passkey to sign in faster and more securely using your
                  fingerprint, Face ID, or security key.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {passkeys.map((passkey) => {
                  const DeviceIcon = getDeviceIcon(passkey.deviceType);
                  return (
                    <div
                      key={passkey.id}
                      className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                          <DeviceIcon className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {passkey.deviceType === "singleDevice"
                              ? "This Device"
                              : "Synced Passkey"}
                          </p>
                          <p className="text-sm text-white/50">
                            Added {formatDate(passkey.createdAt)}
                            {passkey.lastUsedAt &&
                              ` • Last used ${formatDate(passkey.lastUsedAt)}`}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => deletePasskey(passkey.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/50 hover:text-red-400 transition-colors"
                        title="Delete passkey"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Claim Guest Uploads Section */}
        <div className="mt-6 glass rounded-2xl border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Claim Guest Uploads
                </h2>
                <p className="text-sm text-white/50">
                  Convert guest uploads to full builds with analytics
                </p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Search by Token */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Have a guest upload link?
              </label>
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  <input
                    type="text"
                    value={claimToken}
                    onChange={(e) => setClaimToken(e.target.value)}
                    placeholder="Paste your guest upload token..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
                <button
                  onClick={handleClaimByToken}
                  className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>

            {isLoadingGuest ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
              </div>
            ) : guestUploads.length === 0 && claimedUploads.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Package className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="text-white font-medium mb-2">
                  No guest uploads available
                </h3>
                <p className="text-white/50 text-sm max-w-sm mx-auto">
                  If you uploaded files as a guest, paste the share link token
                  above to find and claim them.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Available to Claim */}
                {guestUploads.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-white/70 mb-3">
                      Available to Claim
                    </h3>
                    <div className="space-y-3">
                      {guestUploads.map((upload) => (
                        <div
                          key={upload.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                upload.file_type === "ipa"
                                  ? "bg-blue-500/20"
                                  : "bg-green-500/20"
                              }`}
                            >
                              <span
                                className={`text-sm font-bold ${
                                  upload.file_type === "ipa"
                                    ? "text-blue-400"
                                    : "text-green-400"
                                }`}
                              >
                                {upload.file_type.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {upload.app_name}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-white/50">
                                <span>v{upload.version}</span>
                                <span>•</span>
                                <span>{formatFileSize(upload.file_size)}</span>
                                {upload.download_count !== undefined &&
                                  upload.download_count > 0 && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center gap-1">
                                        <Download className="w-3 h-3" />
                                        {upload.download_count}
                                      </span>
                                    </>
                                  )}
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Expires{" "}
                                  {new Date(
                                    upload.expires_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => claimGuestUpload(upload.id)}
                            disabled={claimingId === upload.id}
                            className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {claimingId === upload.id ? (
                              <>
                                <svg
                                  className="animate-spin h-4 w-4"
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
                                Claiming...
                              </>
                            ) : (
                              "Claim"
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Already Claimed */}
                {claimedUploads.length > 0 && (
                  <div className={guestUploads.length > 0 ? "mt-6" : ""}>
                    <h3 className="text-sm font-medium text-white/70 mb-3">
                      Already Claimed
                    </h3>
                    <div className="space-y-3">
                      {claimedUploads.map((upload) => (
                        <div
                          key={upload.id}
                          className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-emerald-500/20"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                upload.file_type === "ipa"
                                  ? "bg-blue-500/20"
                                  : "bg-green-500/20"
                              }`}
                            >
                              <span
                                className={`text-sm font-bold ${
                                  upload.file_type === "ipa"
                                    ? "text-blue-400"
                                    : "text-green-400"
                                }`}
                              >
                                {upload.file_type.toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {upload.app_name}
                              </p>
                              <div className="flex items-center gap-3 text-sm text-white/50">
                                <span>v{upload.version}</span>
                                <span>•</span>
                                <span>{formatFileSize(upload.file_size)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Claimed</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-6 glass rounded-2xl border border-white/10 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-2">About Passkeys</h3>
              <ul className="text-sm text-white/60 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>
                    Passkeys are a modern, phishing-resistant alternative to
                    passwords
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>
                    They use your device&apos;s biometrics (fingerprint, Face
                    ID) or a security key
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-1">•</span>
                  <span>
                    Synced passkeys work across your devices via iCloud
                    Keychain, Google Password Manager, etc.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Data & Privacy Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Data & Privacy
          </h2>
          <div className="space-y-4">
            {user && <DataPrivacySection user={user} />}
          </div>
        </div>
      </main>
    </div>
  );
}
