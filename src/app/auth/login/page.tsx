'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  AlertOctagon,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { UserProfile } from '@/lib/types';
import { signInWithSomaiyaGoogle } from '@/lib/firebase-services';
import { isFirebaseConfigured } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [welcomeUser, setWelcomeUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleFirebaseSignIn = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (isFirebaseConfigured) {
      const res = await signInWithSomaiyaGoogle();
      setIsLoading(false);
      if (res.success && res.user) {
        HubStore.setCurrentUser(res.user);
        setWelcomeUser(res.user);
        setTimeout(() => {
          router.push('/resources');
        }, 2000);
      } else {
        setErrorMsg(res.error || 'Google Sign-in failed. Please try again.');
      }
    } else {
      setIsLoading(false);
      setErrorMsg('Firebase is not yet configured. Please check your environment variables.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 relative">
      <div className="bg-[#0F1410]/90 w-full max-w-md rounded-3xl p-7 sm:p-9 border border-[#1C271E] shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Somaiya Brand Header */}
        <div className="text-center space-y-2.5">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981] mx-auto flex items-center justify-center text-black shadow-xl shadow-[#10B981]/20 mb-3">
            <GraduationCap className="w-9 h-9 text-black" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-[11px] font-bold uppercase tracking-wider">
            <span>Institutional Login</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight">
            Versa Study Portal
          </h2>
          <p className="text-xs sm:text-sm text-[#86998A] max-w-xs mx-auto">
            Sign in using your official <span className="text-[#34D399] font-semibold">@somaiya.edu</span> Google account
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2.5 animate-in fade-in">
            <AlertOctagon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed">
              <strong className="block text-rose-200 font-semibold mb-0.5">Authentication Error</strong>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={handleGoogleFirebaseSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] text-black font-bold text-sm shadow-lg shadow-[#10B981]/25 hover:shadow-[#10B981]/40 transition-all disabled:opacity-50 group cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#000000"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#000000"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#000000"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#000000"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with @somaiya.edu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* POP-UP: WELCOME MODAL ON SUCCESSFUL LOGIN                 */}
      {/* ======================================================== */}
      {welcomeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0F1410] border border-[#10B981]/40 rounded-3xl p-7 sm:p-8 w-full max-w-sm text-center shadow-2xl shadow-[#10B981]/20 space-y-5 animate-in zoom-in-95 duration-200 relative overflow-hidden">
            {/* Ambient Neon Glow */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-44 h-44 bg-[#10B981]/25 rounded-full blur-3xl pointer-events-none" />

            {/* Avatar Profile Ring */}
            <div className="relative mx-auto w-20 h-20">
              {welcomeUser.avatarUrl ? (
                <img
                  src={welcomeUser.avatarUrl}
                  alt={welcomeUser.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-[#10B981] shadow-xl shadow-[#10B981]/30 mx-auto"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#10B981] flex items-center justify-center text-2xl font-black text-black shadow-xl shadow-[#10B981]/30 mx-auto">
                  {welcomeUser.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#10B981] text-black flex items-center justify-center shadow-md border-2 border-[#0F1410]">
                <CheckCircle2 className="w-4 h-4 text-black" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-1.5 relative z-10">
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-[#34D399]" />
                <span>Verified Somaiya Account</span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#F0FDF4] tracking-tight">
                Welcome, {welcomeUser.fullName}!
              </h3>
              <p className="text-xs text-[#86998A] font-mono break-all">
                {welcomeUser.email}
              </p>
            </div>

            {/* Redirecting bar & Action Button */}
            <div className="space-y-3 pt-1 relative z-10">
              <div className="w-full bg-[#1C271E] h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full w-full animate-[pulse_1.5s_ease-in-out_infinite] rounded-full" />
              </div>

              <button
                onClick={() => router.push('/resources')}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] text-black font-bold text-xs shadow-lg shadow-[#10B981]/25 transition cursor-pointer"
              >
                <span>Continue to Study Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

