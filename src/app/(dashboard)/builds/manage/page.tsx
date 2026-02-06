'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUserSession, useBuild } from '@/hooks/queries';
import DashboardHeader from '@/components/layout/DashboardHeader';
import EnhancedBuildManagement from '@/components/build/BuildManagement';

function BuildManagePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  
  // Use React Query hooks - automatically cached and deduplicated
  const { data: user, isLoading: isLoadingUser } = useUserSession();
  const { data: build, isLoading: isLoadingBuild, error: buildError } = useBuild(id);

  // Redirect to login if not authenticated
  if (!isLoadingUser && !user) {
    router.push('/login');
    return null;
  }

  const isLoading = isLoadingUser || isLoadingBuild;
  const notFound = !id || buildError || (!isLoadingBuild && !build);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !build) {
    return (
      <div className="min-h-screen">
        <DashboardHeader user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Build Not Found</h1>
          <p className="text-white/60">The build you are looking for does not exist or you don't have permission to view it.</p>
          <button 
            onClick={() => router.push('/builds')}
            className="mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            Back to Builds
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />
      <EnhancedBuildManagement build={build} />
    </div>
  );
}

export default function BuildManagePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BuildManagePageContent />
    </Suspense>
  );
}
