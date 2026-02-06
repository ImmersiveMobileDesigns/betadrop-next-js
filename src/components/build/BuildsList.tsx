'use client';

import { useState, useEffect } from 'react';
import BuildCard from '@/components/ui/BuildCard';
import Link from 'next/link';
import { useBuilds } from '@/hooks/queries';

export default function BuildsList() {
  const [filter, setFilter] = useState<'all' | 'ios' | 'android'>('all');
  const [page, setPage] = useState(1);
  
  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filter]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  const { data, isLoading } = useBuilds(true, page, filter);
  
  const builds = data?.builds.data || [];
  const pagination = data?.builds;
  const totalBuilds = data?.stats.total_builds || 0;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">All Builds</h1>
          <p className="text-white/60 mt-1">
            {isLoading ? 'Loading...' : `${pagination?.total || 0} total builds`}
          </p>
        </div>
        <Link href="/upload" className="btn-primary">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload Build
        </Link>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:bg-white/5'
          }`}
        >
          All
        </button>
        <button 
          onClick={() => setFilter('ios')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'ios' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:bg-white/5'
          }`}
        >
          iOS
        </button>
        <button 
          onClick={() => setFilter('android')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'android' 
              ? 'bg-white/10 text-white' 
              : 'text-white/60 hover:bg-white/5'
          }`}
        >
          Android
        </button>
      </div>

      {/* Builds List */}
      {isLoading ? (
        <div className="py-12 flex justify-center">
            <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : builds.length === 0 ? (
        <div className="card text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No builds found</h3>
          <p className="text-white/60 mb-6">Try adjusting your filters or upload a new build</p>
          <Link href="/upload" className="btn-primary">
            Upload Your First Build
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {builds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && pagination && pagination.total > pagination.per_page && (
        <div className="flex items-center justify-between border-t border-white/10 pt-6 mt-6">
            <div className="text-sm text-gray-400">
                Showing <span className="font-medium text-white">{pagination.from || 0}</span> to <span className="font-medium text-white">{pagination.to || 0}</span> of <span className="font-medium text-white">{pagination.total}</span> results
            </div>
            <div className="flex gap-2">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!pagination.prev_page_url}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Previous
                </button>
                <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pagination.next_page_url}
                    className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Next
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
      )}
    </>
  );
}
