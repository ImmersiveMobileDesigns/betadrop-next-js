'use client';

import { useRouter } from 'next/navigation';
import { useUserSession } from '@/hooks/queries';
import DashboardHeader from '@/components/layout/DashboardHeader';
import BuildsList from '@/components/build/BuildsList';

export default function BuildsPage() {
  const router = useRouter();
  
  // Use React Query hooks - automatically cached and deduplicated
  const { data: user, isLoading: isLoadingUser } = useUserSession();

  // Redirect to login if not authenticated
  if (!isLoadingUser && !user) {
    router.push('/login');
    return null;
  }

  if (isLoadingUser || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader user={user} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BuildsList />
      </main>
    </div>
  );
}
