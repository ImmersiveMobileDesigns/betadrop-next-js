'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

import { fetchFromLaravel } from '@/lib/api-client';

function VerifyForm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const verifiedRef = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setError('No verification token provided');
      return;
    }

    if (verifiedRef.current) return;
    verifiedRef.current = true;

    const verifyToken = async () => {
      try {
        const data = await fetchFromLaravel<{success: boolean, error?: string}>('/api/auth/verify', {
          method: 'POST',
          body: JSON.stringify({ token }),
        });

        if (data.success) {
           setStatus('success');
        } else {
           throw new Error(data.error || 'Verification failed');
        }
      } catch (err) {
         console.log(err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Verification failed');
      }
    };

    verifyToken();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center py-12">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verifying...</h1>
            <p className="text-white/60">Please wait while we sign you in</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Welcome!</h1>
            <p className="text-white/60 mb-6">You&apos;re signed in successfully.</p>
            
            {/* Passkey Setup Prompt */}
            <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
                <span className="text-primary-400 font-medium">Enable Quick Sign-in</span>
              </div>
              <p className="text-white/50 text-sm mb-4">
                Set up a passkey to sign in instantly with Face ID, fingerprint, or security key next time.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/settings')}
                  className="flex-1 bg-primary-500 hover:bg-primary-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Set Up Passkey
                </button>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white/70 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  Skip for Now
                </button>
              </div>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Verification Failed</h1>
            <p className="text-white/60 mb-6">{error}</p>
            <Link href="/login" className="btn-primary">
              Try Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full" />
      </div>
    }>
      <VerifyForm />
    </Suspense>
  );
}
