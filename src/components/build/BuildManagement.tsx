"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { fetchFromLaravel } from "@/lib/api-client";
import {
  useBuildAnalytics,
  useBuildShareLinks,
  useBuildFeedback,
  useUpdateBuild,
} from "@/hooks/queries";
import type {
  Build,
  ShareLink,
  FullBuildAnalytics,
  LinkType,
  BuildFeedback,
} from "@/types";
import {
  formatFileSize,
  formatRelativeTime,
  copyToClipboard,
} from "@/lib/utils";
import {
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  Download,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Calendar,
  Package,
  Smartphone,
  QrCode,
  BarChart3,
  Settings,
  Share2,
  Plus,
  Users,
  Clock,
  AlertCircle,
  TrendingUp,
  Globe,
  Zap,
  Link as LinkIcon,
  MessageSquare,
  Palette,
  History,
  Bug,
  Lightbulb,
  HelpCircle,
  Image as ImageIcon,
  Star,
} from "lucide-react";
import QRCodeComponent from "@/components/ui/QRCode";
import BuildSettings from "./BuildSettings";
import ShareLinkDetailsModal from "./ShareLinkDetailsModal";
import BuildBranding from "./BuildBranding";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { ConfirmationModal } from "@/components/ui/Modal";

interface BuildManagementProps {
  build: Build;
}

export default function EnhancedBuildManagement({
  build: initialBuild,
}: BuildManagementProps) {
  const router = useRouter();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [build, setBuild] = useState(initialBuild);
  const [activeTab, setActiveTab] = useState<
    "overview" | "analytics" | "share" | "branding" | "feedback" | "settings"
  >("overview");
  const [isEnabled, setIsEnabled] = useState(initialBuild.is_enabled);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [logoError, setLogoError] = useState(false);

  // Share Link State
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [newLinkType, setNewLinkType] = useState<LinkType>("qa");
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkMaxUses, setNewLinkMaxUses] = useState<number | undefined>(
    undefined,
  );
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal State
  const [selectedLink, setSelectedLink] = useState<ShareLink | null>(null);

  // Use React Query hooks for data fetching - prevents duplicate calls
  const { data: analytics, isLoading: isLoadingAnalytics } = useBuildAnalytics(
    activeTab === "analytics" ? build.id : "",
  );
  const {
    data: shareLinksData = initialBuild.share_links || [],
    refetch: refetchShareLinks,
  } = useBuildShareLinks(activeTab === "share" ? build.id : "");
  const { data: feedbackList = [] } = useBuildFeedback(
    activeTab === "feedback" ? build.id : "",
  );

  // Maintain local state for share links so we can update it optimistically
  const [shareLinks, setShareLinks] = useState<ShareLink[]>(
    initialBuild.share_links || [],
  );

  // Sync share links from query when data changes
  useEffect(() => {
    if (shareLinksData.length > 0) {
      setShareLinks(shareLinksData);
    }
  }, [shareLinksData]);

  const appUrl =
    process.env.NEXT_PUBLIC_FRONT_APP_URL || "http://localhost:3001";
  const installUrl = `${appUrl}/install/?i=${build.default_short_id || build.id}`;

  const createShareLink = async () => {
    setIsCreatingLink(true);
    try {
      const data = await fetchFromLaravel<{
        success: boolean;
        data: ShareLink;
        error?: string;
      }>(`/api/builds/${build.id}/share-links`, {
        method: "POST",
        // fetchFromLaravel automatically adds Content-Type: application/json
        body: JSON.stringify({
          link_type: newLinkType,
          label: newLinkLabel || undefined,
          max_uses: newLinkMaxUses || undefined,
        }),
      });

      if (data.success) {
        setShareLinks([
          { ...data.data, last_used_at: null, unique_devices: 0 },
          ...shareLinks,
        ]);
        setNewLinkLabel("");
        setNewLinkMaxUses(undefined);
        toast.success("Share link created successfully");
      } else {
        toast.error(data.error || "Failed to create share link");
      }
    } catch (error) {
      console.error("Error creating share link:", error);
      toast.error("An error occurred");
    } finally {
      setIsCreatingLink(false);
    }
  };

  const copyLink = async (url: string, id: string) => {
    const success = await copyToClipboard(url);
    if (success) {
      setCopiedId(id);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // Mutations
  const updateBuild = useUpdateBuild();

  const toggleEnabled = async () => {
    setIsToggling(true);
    try {
      await updateBuild.mutateAsync({
        id: build.id,
        updates: { is_enabled: !isEnabled },
      });

      setIsEnabled(!isEnabled);
      toast.success(!isEnabled ? "Build enabled" : "Build disabled");
    } catch (error) {
      console.error("Error toggling build:", error);
      toast.error("Failed to update build status");
    } finally {
      setIsToggling(false);
    }
  };

  const deleteBuild = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await fetchFromLaravel(`/api/builds/${build.id}`, {
        method: "DELETE",
      });

      toast.success("Build deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["builds"] });
      queryClient.invalidateQueries({ queryKey: ["platform-stats"] });
      router.push("/builds");
      router.refresh();
    } catch (error) {
      console.error("Error deleting build:", error);
      toast.error("Failed to delete build");
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const platformIcon =
    build.platform === "ios" ? (
      <Image
        src="/images/logo/apple-logo-svgrepo-com.svg"
        alt="iOS"
        width={24}
        height={24}
        className="w-6 h-6 text-current"
      />
    ) : (
      <Image
        src="/images/logo/android-logo-svgrepo-com.svg"
        alt="Android"
        width={24}
        height={24}
        className="w-6 h-6 text-current"
      />
    );

  const getLinkTypeColor = (type: LinkType) => {
    switch (type) {
      case "qa":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "stakeholder":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "beta_tester":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "reviewer":
        return "text-orange-400 bg-orange-500/10 border-orange-500/20";
      default:
        return "text-white/60 bg-white/5 border-white/10";
    }
  };

  const getLinkTypeLabel = (type: LinkType) => {
    switch (type) {
      case "qa":
        return "QA Team";
      case "stakeholder":
        return "Stakeholder";
      case "beta_tester":
        return "Beta Tester";
      case "reviewer":
        return "Reviewer";
      default:
        return type;
    }
  };

  const logoUrl = build.custom_logo_path || build.icon_url;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <Link
        href="/builds"
        className="inline-flex items-center text-white/60 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Builds
      </Link>

      {/* Header */}
      <div className="card mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden relative ${
                logoUrl && !logoError
                  ? "bg-transparent"
                  : build.platform === "ios"
                    ? "bg-gradient-to-br from-gray-600 to-gray-800 text-white"
                    : "bg-gradient-to-br from-gray-600 to-gray-800 text-white"
              }`}
            >
              {logoUrl && !logoError ? (
                <Image
                  src={logoUrl}
                  alt={build.name}
                  fill
                  unoptimized
                  className="w-full h-full object-cover"
                  onError={() => setLogoError(true)}
                />
              ) : (
                platformIcon
              )}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">{build.name}</h1>
                {!!build.is_latest && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    LATEST
                  </span>
                )}
                {!!build.is_deprecated && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    DEPRECATED
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-3 text-sm text-white/60">
                <span>v{build.version}</span>
                {build.build_number && build.build_number !== "0" && (
                  <>
                    <span>•</span>
                    <span>Build {build.build_number}</span>
                  </>
                )}
                <span>•</span>
                <span>{formatFileSize(build.file_size)}</span>
              </div>
              {build.bundle_id && (
                <div className="text-xs text-white/40 mt-1 font-mono">
                  {build.bundle_id}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                isEnabled
                  ? "bg-green-500/20 text-green-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {isEnabled ? "Active" : "Disabled"}
            </span>
          </div>
        </div>

        {/* Expiry Info */}
        {build.expiry_type !== "none" && build.expires_at && (
          <div className="mt-4 p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-start gap-2">
            <Clock className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <div className="text-orange-300 font-medium">Expiry Active</div>
              <div className="text-orange-400/80">
                Expires {formatRelativeTime(build.expires_at)}
                {build.expiry_download_limit &&
                  ` • ${build.download_count}/${build.expiry_download_limit} downloads`}
                {build.expiry_device_limit &&
                  ` • ${build.unique_devices_count}/${build.expiry_device_limit} devices`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-white/10">
        <div className="flex gap-6 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "overview", label: "Overview", icon: Package },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "share", label: "Share Links", icon: Share2 },
            { id: "branding", label: "Brand", icon: Palette },
            { id: "feedback", label: "Feedback", icon: MessageSquare },
            { id: "settings", label: "Settings", icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-primary-500 text-white"
                  : "border-transparent text-white/60 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2 text-primary-400" />
                Quick Actions
              </h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  onClick={toggleEnabled}
                  disabled={isToggling}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors disabled:opacity-50"
                >
                  {isEnabled ? (
                    <>
                      <ToggleRight className="w-5 h-5 mr-2 text-green-400" />{" "}
                      Disable Build
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-5 h-5 mr-2 text-white/40" />{" "}
                      Enable Build
                    </>
                  )}
                </button>

                <Link
                  href={`/install?i=${build.default_short_id || build.id}`}
                  target="_blank"
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  View Install Page
                </Link>

                <button
                  onClick={() => setShowQR(!showQR)}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  {showQR ? "Hide" : "Show"} QR Code
                </button>

                <button
                  onClick={deleteBuild}
                  disabled={isDeleting}
                  className="flex items-center justify-center px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete Build"}
                </button>
              </div>
            </div>

            {/* QR Code */}
            {showQR && (
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">
                  QR Code
                </h2>
                <div className="flex flex-col items-center">
                  <div className="bg-white rounded-xl p-4 mb-4">
                    <QRCodeComponent url={installUrl} size={200} />
                  </div>
                  <p className="text-white/60 text-sm text-center">
                    Scan this QR code to install the app on your device
                  </p>
                </div>
              </div>
            )}

            {/* Build Details */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary-400" />
                Build Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Platform</span>
                  <span className="text-white font-medium capitalize">
                    {build.platform}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Version</span>
                  <span className="text-white font-medium">
                    {build.version}
                  </span>
                </div>
                {build.build_number && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/60">Build Number</span>
                    <span className="text-white font-medium">
                      {build.build_number}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">File Size</span>
                  <span className="text-white font-medium">
                    {formatFileSize(build.file_size)}
                  </span>
                </div>
                {build.bundle_id && (
                  <div className="flex justify-between py-2 border-b border-white/5">
                    <span className="text-white/60">Bundle ID</span>
                    <span className="text-white font-medium font-mono text-sm">
                      {build.bundle_id}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-white/60">Created</span>
                  <span className="text-white font-medium">
                    {formatRelativeTime(build.created_at)}
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-white/60">Last Updated</span>
                  <span className="text-white font-medium">
                    {formatRelativeTime(build.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Release Notes */}
            {build.notes && (
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Release Notes
                </h2>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70 whitespace-pre-wrap">
                    {build.notes}
                  </p>
                </div>
              </div>
            )}

            {/* Custom Message */}
            {build.custom_message && (
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-primary-400" />
                  Custom Message
                </h2>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/70">{build.custom_message}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats Summary */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-primary-400" />
                Statistics
              </h2>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">
                      Total Downloads
                    </span>
                    <Download className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {build.download_count}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">
                      Unique Devices
                    </span>
                    <Smartphone className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {build.unique_devices_count}
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Success Rate</span>
                    <TrendingUp className="w-4 h-4 text-white/40" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {build.download_count > 0
                      ? Math.round(
                          (build.install_success_count / build.download_count) *
                            100,
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Share Link */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-4">
                Share Link
              </h2>
              <div className="bg-white/5 rounded-lg p-3 mb-3">
                <div className="text-xs text-white/40 mb-1">Install URL</div>
                <div className="text-sm text-white font-mono break-all">
                  {installUrl}
                </div>
              </div>
              <button
                onClick={() => copyLink(installUrl, "main")}
                className="w-full btn-primary"
              >
                {copiedId === "main" ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Install Link
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="space-y-6">
          {isLoadingAnalytics ? (
            <div className="card flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : analytics ? (
            <>
              {/* Analytics Summary Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">
                      Total Downloads
                    </span>
                    <Download className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {analytics.summary.total_downloads}
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">
                      Unique Devices
                    </span>
                    <Smartphone className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {analytics.summary.unique_devices}
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Success Rate</span>
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {Math.round(analytics.summary.install_success_rate)}%
                  </div>
                </div>

                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-sm">Countries</span>
                    <Globe className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="text-3xl font-bold text-white">
                    {analytics.summary.geographic_distribution.length}
                  </div>
                </div>
              </div>

              {/* Device Breakdown */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Device Type Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(analytics.summary.device_breakdown).filter(
                      ([_, count]) => count > 0,
                    ).length > 0 ? (
                      Object.entries(analytics.summary.device_breakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([type, count]) => (
                          <div
                            key={type}
                            className="flex items-center justify-between"
                          >
                            <span className="text-white/70 capitalize">
                              {type}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                  style={{
                                    width: `${(count / analytics.summary.total_downloads) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-white font-medium w-12 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-white/40 text-sm italic">
                        No device data available
                      </p>
                    )}
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Platform Breakdown
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(
                      analytics.summary.platform_breakdown,
                    ).filter(([_, count]) => count > 0).length > 0 ? (
                      Object.entries(analytics.summary.platform_breakdown)
                        .filter(([_, count]) => count > 0)
                        .map(([platform, count]) => (
                          <div
                            key={platform}
                            className="flex items-center justify-between"
                          >
                            <span className="text-white/70 capitalize">
                              {platform}
                            </span>
                            <div className="flex items-center gap-3">
                              <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                  style={{
                                    width: `${(count / analytics.summary.total_downloads) * 100}%`,
                                  }}
                                />
                              </div>
                              <span className="text-white font-medium w-12 text-right">
                                {count}
                              </span>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-white/40 text-sm italic">
                        No platform data available
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Top Devices */}
              {analytics.summary.top_devices.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Top Devices
                  </h3>
                  <div className="space-y-2">
                    {analytics.summary.top_devices.map((device, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                      >
                        <span className="text-white/70">{device.model}</span>
                        <span className="text-white font-medium">
                          {device.count} installs
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Geographic Distribution */}
              {analytics.summary.geographic_distribution.length > 0 && (
                <div className="card">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary-400" />
                    Geographic Distribution
                  </h3>
                  <div className="space-y-2">
                    {analytics.summary.geographic_distribution.map(
                      (geo, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4 text-white/30" />
                            <span className="text-white/70">{geo.country}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                                style={{
                                  width: `${(geo.count / analytics.summary.total_downloads) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-white font-medium w-16 text-right">
                              {geo.count} installs
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* Recent Downloads - shows individual downloads with country */}
              {analytics.recent_installs &&
                analytics.recent_installs.length > 0 && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <History className="w-5 h-5 text-primary-400" />
                      Recent Downloads
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="text-xs text-white/40 bg-white/5">
                            <th className="px-4 py-3 font-medium">Device</th>
                            <th className="px-4 py-3 font-medium">Country</th>
                            <th className="px-4 py-3 font-medium">City</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {analytics.recent_installs.map((record) => (
                            <tr
                              key={record.id}
                              className="text-sm text-white/80 hover:bg-white/5 transition-colors"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  {record.device_type === "mobile" ? (
                                    <Smartphone className="w-3.5 h-3.5 text-blue-400" />
                                  ) : record.device_type === "tablet" ? (
                                    <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                                  ) : (
                                    <Globe className="w-3.5 h-3.5 text-white/40" />
                                  )}
                                  <span className="truncate max-w-[120px]">
                                    {record.device_type
                                      ? record.device_type
                                          .charAt(0)
                                          .toUpperCase() +
                                        record.device_type.slice(1)
                                      : "Unknown"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <Globe className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
                                  <span
                                    className={
                                      record.country
                                        ? "text-white/80"
                                        : "text-white/30 italic"
                                    }
                                  >
                                    {record.country || "Unknown"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={
                                    record.city
                                      ? "text-white/60"
                                      : "text-white/30 italic"
                                  }
                                >
                                  {record.city || "—"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    record.install_status === "success"
                                      ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                      : record.install_status === "failure"
                                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                  }`}
                                >
                                  {record.install_status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-white/50 whitespace-nowrap">
                                {formatRelativeTime(record.installed_at)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </>
          ) : (
            <div className="card text-center py-12">
              <BarChart3 className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No analytics data available yet</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "share" && (
        <div className="space-y-6">
          {/* Create New Share Link */}
          <div className="card relative z-20">
            <h3 className="text-lg font-semibold text-white mb-4">
              Create Role-Based Share Link
            </h3>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Link Type
                </label>
                <Select
                  value={newLinkType}
                  onChange={(value) => setNewLinkType(value as LinkType)}
                  options={[
                    { value: "qa", label: "QA Team" },
                    { value: "stakeholder", label: "Stakeholder" },
                    { value: "beta_tester", label: "Beta Tester" },
                    { value: "reviewer", label: "Reviewer (with feedback)" },
                  ]}
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Label (Optional)
                </label>
                <input
                  type="text"
                  value={newLinkLabel}
                  onChange={(e) => setNewLinkLabel(e.target.value)}
                  placeholder="e.g., Internal QA Round 2"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-white/60 mb-2">
                  Max Uses (Optional)
                </label>
                <input
                  type="number"
                  value={newLinkMaxUses || ""}
                  onChange={(e) =>
                    setNewLinkMaxUses(
                      e.target.value ? parseInt(e.target.value) : undefined,
                    )
                  }
                  placeholder="Unlimited"
                  min="1"
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 transition-colors"
                />
              </div>
            </div>
            <button
              onClick={createShareLink}
              disabled={isCreatingLink}
              className="btn-primary"
            >
              {isCreatingLink ? (
                <>
                  <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Share Link
                </>
              )}
            </button>
          </div>

          {/* Existing Share Links */}
          <div className="card">
            <h3 className="text-lg font-semibold text-white mb-4">
              Active Share Links
            </h3>
            {shareLinks.length > 0 ? (
              <div className="space-y-3">
                {shareLinks.map((link) => (
                  <div
                    key={link.id}
                    className="p-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/[0.07] transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getLinkTypeColor(link.link_type)}`}
                          >
                            {getLinkTypeLabel(link.link_type)}
                          </span>
                          {link.label && (
                            <span className="text-white/60 text-sm">
                              {link.label}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-white/40">
                          Created {formatRelativeTime(link.created_at)}
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        {link.max_uses ? (
                          <div className="text-white/60">
                            {link.current_uses}/{link.max_uses} uses
                          </div>
                        ) : (
                          <div className="text-white/60">Unlimited uses</div>
                        )}
                        <div className="text-xs text-white/40 mt-1">
                          {link.unique_devices} devices
                          {link.last_used_at &&
                            ` • Last use ${formatRelativeTime(link.last_used_at)}`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 px-3 py-2 bg-black/40 rounded-lg font-mono text-xs text-white/50 break-all border border-white/5">
                        {`${appUrl}/install?i=${link.short_id ? link.short_id : link.token.substring(0, 8) + "..."}`}
                      </div>

                      <button
                        onClick={() => setSelectedLink(link)}
                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-xs font-medium border border-white/10"
                      >
                        Manage
                      </button>

                      <Link
                        href={`${appUrl}/install?i=${link.short_id || link.token}`}
                        target="_blank"
                        className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors text-xs font-medium border border-white/10 flex items-center justify-center"
                        title="Open Link"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() =>
                          copyLink(
                            `${appUrl}/install?i=${link.short_id || link.token}`,
                            link.id,
                          )
                        }
                        className={`px-3 py-2 rounded-lg transition-colors border ${
                          copiedId === link.id
                            ? "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                            : "bg-primary-500/10 text-primary-400 border-primary-500/20 hover:bg-primary-500/20"
                        }`}
                        title="Copy Link"
                      >
                        {copiedId === link.id ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-white/60 border border-white/5 rounded-2xl bg-white/5">
                <LinkIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p>No share links created yet</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "branding" && (
        <BuildBranding
          build={build}
          onUpdate={(updatedBuild) => setBuild(updatedBuild)}
        />
      )}

      {activeTab === "settings" && (
        <BuildSettings
          build={build}
          onUpdate={(updatedBuild) => setBuild(updatedBuild)}
        />
      )}

      {activeTab === "feedback" && (
        <div className="space-y-6">
          {feedbackList.length > 0 ? (
            <div className="grid gap-4">
              {feedbackList.map((item) => {
                const getFeedbackIcon = (type: string) => {
                  switch (type) {
                    case "bug":
                      return <Bug className="w-4 h-4" />;
                    case "suggestion":
                      return <Lightbulb className="w-4 h-4" />;
                    case "question":
                      return <HelpCircle className="w-4 h-4" />;
                    default:
                      return <MessageSquare className="w-4 h-4" />;
                  }
                };

                const getSeverityColor = (severity: string) => {
                  switch (severity) {
                    case "critical":
                      return "bg-red-500/20 text-red-500 border-red-500/30";
                    case "high":
                      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
                    case "medium":
                      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
                    default:
                      return "bg-green-500/20 text-green-400 border-green-500/30";
                  }
                };

                return (
                  <div
                    key={item.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-white">
                            {item.title}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${
                              item.feedback_type === "bug"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : item.feedback_type === "suggestion"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            }`}
                          >
                            {getFeedbackIcon(item.feedback_type)}
                            {item.feedback_type}
                          </span>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border capitalize ${getSeverityColor(item.severity)}`}
                          >
                            {item.severity} Priority
                          </span>

                          {item.rating && item.rating > 0 && (
                            <div
                              className="flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20"
                              title={`Rating: ${item.rating}/5`}
                            >
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  fill={
                                    i < item.rating! ? "currentColor" : "none"
                                  }
                                  className={`w-3 h-3 ${i < item.rating! ? "text-yellow-500" : "text-yellow-500/20"}`}
                                />
                              ))}
                              <span className="ml-1 text-xs font-bold text-yellow-500">
                                {item.rating}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/40">
                          <span>
                            Reported by{" "}
                            <span className="text-white/70 font-medium">
                              {item.reporter_name ||
                                item.reporter_email ||
                                "Anonymous"}
                            </span>
                          </span>
                          <span>•</span>
                          <span>{formatRelativeTime(item.created_at)}</span>
                        </div>
                      </div>

                      {item.status && (
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                            item.status === "new"
                              ? "bg-primary-500/10 text-primary-400 border-primary-500/20"
                              : item.status === "resolved"
                                ? "bg-green-500/10 text-green-400 border-green-500/20"
                                : "bg-white/5 text-white/50 border-white/10"
                          }`}
                        >
                          {item.status.replace("_", " ")}
                        </div>
                      )}
                    </div>

                    <div className="bg-black/20 rounded-xl p-4 text-gray-300 leading-relaxed font-light mb-4 border border-white/5">
                      {item.description}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      {item.device_info && (
                        <div className="flex items-center gap-2 text-xs font-mono text-white/50 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                          <Smartphone className="w-3.5 h-3.5" />
                          <span className="truncate max-w-xs">
                            {item.device_info}
                          </span>
                        </div>
                      )}

                      {item.screenshot_path && (
                        <a
                          href={item.screenshot_path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-medium text-primary-400 hover:text-primary-300 bg-primary-500/10 hover:bg-primary-500/20 px-3 py-1.5 rounded-lg border border-primary-500/20 transition-colors"
                        >
                          <ImageIcon className="w-3.5 h-3.5" />
                          View Screenshot
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-12 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-10 h-10 text-white/30" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No feedback yet
                </h3>
                <p className="text-gray-400 max-w-sm mx-auto">
                  Feedback from your testers will appear here. Share your build
                  to get started!
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Build"
        description={`Are you sure you want to delete ${build.name}? This action cannot be undone.`}
        confirmLabel={isDeleting ? "Deleting..." : "Delete Build"}
        isDestructive={true}
        isLoading={isDeleting}
      />

      {selectedLink && (
        <ShareLinkDetailsModal
          isOpen={!!selectedLink}
          onClose={() => setSelectedLink(null)}
          shareLink={selectedLink}
          buildId={build.id}
          analytics={build.analytics}
        />
      )}
    </main>
  );
}
