"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserSession, useBuilds } from "@/hooks/queries";
import { formatFileSize } from "@/lib/utils";
import DashboardHeader from "@/components/layout/DashboardHeader";
import BuildCard from "@/components/ui/BuildCard";
import {
  BarChart3,
  Upload,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const [page, setPage] = useState(1);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Use React Query hooks - automatically cached and deduplicated
  const { data: user, isLoading: isLoadingUser } = useUserSession({
    // Redirect to login if not authenticated
  });

  const { data, isLoading: isLoadingBuilds } = useBuilds(!!user, page);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoadingUser && !user) {
      router.push("/login");
    }
  }, [isLoadingUser, user, router]);

  const isLoading = isLoadingUser || isLoadingBuilds;

  // Use stats from API
  const allBuildsCount = data?.stats.total_builds || 0;
  const totalDownloads = data?.stats.total_downloads || 0;
  const totalSize = data?.stats.total_size || 0;
  const builds = data?.builds.data || [];
  const pagination = data?.builds;

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70 tracking-tight mb-2">
              Dashboard
            </h1>
            <p className="text-lg text-gray-400">
              Overview of your builds and performance
            </p>
          </div>
          <Link
            href="/upload"
            className="group flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-0.5 hover:shadow-primary-500/40 active:scale-95 border border-white/10"
          >
            <div className="p-1 rounded-lg bg-white/20 mr-3 group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            Upload New Build
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Builds */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Package className="w-24 h-24 text-primary-500" />
            </div>
            <div className="relative">
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Total Builds
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {allBuildsCount}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  applications
                </span>
              </div>
            </div>
          </div>

          {/* Total Downloads */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg
                className="w-24 h-24 text-emerald-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
            </div>
            <div className="relative">
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Total Downloads
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {totalDownloads}
                </span>
                <span className="text-sm text-gray-500 font-medium">
                  installs
                </span>
              </div>
            </div>
          </div>

          {/* Storage Used */}
          <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 hover:bg-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <BarChart3 className="w-24 h-24 text-purple-500" />
            </div>
            <div className="relative">
              <div className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">
                Storage Used
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">
                  {formatFileSize(totalSize)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Builds Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
            {builds.length > 0 && (
              <Link
                href="/builds"
                className="group flex items-center text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                View All Builds
                <svg
                  className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            )}
          </div>

          {builds.length === 0 ? (
            <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-12 text-center pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-50" />
              <div className="relative pointer-events-auto">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-800 to-black ring-1 ring-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Package className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No builds yet
                </h3>
                <p className="text-gray-400 max-w-sm mx-auto mb-8 text-lg">
                  Upload your first IPA or APK file to get started sharing your
                  apps.
                </p>
                <Link
                  href="/upload"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 transition-colors shadow-lg shadow-white/10"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Your First Build
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-5">
              {builds.map((build) => (
                <BuildCard key={build.id} build={build} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.total > pagination.per_page && (
            <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-6">
              <div className="text-sm text-gray-400">
                Showing{" "}
                <span className="font-medium text-white">
                  {pagination.from || 0}
                </span>{" "}
                to{" "}
                <span className="font-medium text-white">
                  {pagination.to || 0}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
                  {pagination.total}
                </span>{" "}
                results
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!pagination.prev_page_url}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!pagination.next_page_url}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
