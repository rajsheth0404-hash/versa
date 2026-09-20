'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Tv,
  Calculator,
  ArrowRight,
  GraduationCap,
  Sparkles,
  LogIn,
  X,
  Lock,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { UserProfile } from '@/lib/types';
import { signInWithSomaiyaGoogle } from '@/lib/firebase-services';
import { isFirebaseConfigured } from '@/lib/firebase';

interface TargetTab {
  name: string;
  href: string;
  icon: any;
  color: string;
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [authPromptTab, setAuthPromptTab] = useState<TargetTab | null>(null);

  useEffect(() => {
    setUser(HubStore.getCurrentUser());

    const handleUpdate = () => {
      setUser(HubStore.getCurrentUser());
    };

    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const handleCardClick = (e: React.MouseEvent, tab: TargetTab) => {
    if (!user) {
      e.preventDefault();
      setAuthPromptTab(tab);
    } else {
      router.push(tab.href);
    }
  };

  const handleDirectSignIn = async (targetHref: string = '/resources') => {
    if (!isFirebaseConfigured) {
      router.push('/auth/login');
      return;
    }

    setIsSigningIn(true);
    setLoginError(null);

    const res = await signInWithSomaiyaGoogle();
    setIsSigningIn(false);

    if (res.success && res.user) {
      HubStore.setCurrentUser(res.user);
      setAuthPromptTab(null);
      router.push(targetHref);
    } else {
      setLoginError(res.error || 'Google Sign-in failed. Please try again with your @somaiya.edu account.');
    }
  };

  return (
    <div className="min-h-[88vh] flex flex-col justify-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8 relative">
      {/* Header Brand */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-xs font-bold uppercase tracking-wider">
          <GraduationCap className="w-4 h-4 text-[#34D399]" />
          <span>Somaiya Vidyavihar University</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold text-[#F0FDF4] tracking-tight">
          Versa
        </h1>
        <p className="text-sm sm:text-base text-[#86998A] max-w-xl mx-auto">
          Computer Engineering Academic Portal • Syllabus-Aligned Study Hub
        </p>
      </div>

      {/* Main 3-Card Row: Notes | YT | SGPA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
        {/* Card 1: Notes */}
        <div
          onClick={(e) =>
            handleCardClick(e, {
              name: 'Notes & Study Materials',
              href: '/resources',
              icon: BookOpen,
              color: 'text-[#34D399]',
            })
          }
          className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-[#10B981] rounded-3xl p-7 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10B981]/20 transition-all" />

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-extrabold text-[#F0FDF4] tracking-tight group-hover:text-[#34D399] transition">
                  Notes
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 uppercase">
                  Sem 1 & 2
                </span>
              </div>
              <p className="text-xs text-[#86998A] mt-2 leading-relaxed">
                Subject PPTs, handwritten theory, question banks, PYQs & formula sheets.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-0.5 transition-transform">
            <span>{!user ? 'Sign In to Access' : 'Explore Notes & PDFs'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 2: YT (Video Lectures) */}
        <div
          onClick={(e) =>
            handleCardClick(e, {
              name: 'Video Lectures & Playlists',
              href: '/youtube',
              icon: Tv,
              color: 'text-red-400',
            })
          }
          className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-red-500/50 rounded-3xl p-7 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-red-500/20 transition-all" />

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
              <Tv className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-extrabold text-[#F0FDF4] tracking-tight group-hover:text-red-400 transition">
                  YT
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-red-500/20 text-red-400 border border-red-500/30 uppercase">
                  Playlists
                </span>
              </div>
              <p className="text-xs text-[#86998A] mt-2 leading-relaxed">
                Handpicked video lectures and crash courses mapped unit-by-unit to syllabus.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-red-400 group-hover:translate-x-0.5 transition-transform">
            <span>{!user ? 'Sign In to Access' : 'Watch Video Lectures'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        {/* Card 3: SGPA Calculator */}
        <div
          onClick={(e) =>
            handleCardClick(e, {
              name: 'SGPA & CGPA Calculator',
              href: '/calculator',
              icon: Calculator,
              color: 'text-[#34D399]',
            })
          }
          className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-[#34D399] rounded-3xl p-7 flex flex-col justify-between shadow-xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#34D399]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#34D399]/20 transition-all" />

          <div className="space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
              <Calculator className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-extrabold text-[#F0FDF4] tracking-tight group-hover:text-[#34D399] transition">
                  SGPA
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 uppercase">
                  Calculator
                </span>
              </div>
              <p className="text-xs text-[#86998A] mt-2 leading-relaxed">
                Semester GPA and credit breakdown based on Somaiya grading scales.
              </p>
            </div>
          </div>

          <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-0.5 transition-transform">
            <span>{!user ? 'Sign In to Access' : 'Calculate SGPA'}</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Login Error Notification if any */}
      {loginError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 text-center animate-in fade-in">
          {loginError}
        </div>
      )}

      {/* Bottom Full-Width Prominent Row: Sign In with Somaiya */}
      <div className="pt-2">
        {user ? (
          <div className="bg-[#0F1410]/90 border border-[#10B981]/40 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl backdrop-blur-md">
            <div className="flex items-center space-x-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-[#10B981] shadow-lg flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-[#10B981] flex items-center justify-center font-bold text-black text-sm flex-shrink-0">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-base text-[#F0FDF4]">{user.fullName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30 uppercase">
                    Logged In
                  </span>
                </div>
                <p className="text-xs text-[#86998A] font-mono">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <Link
                href="/resources"
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-6 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-[#10B981]/20 transition"
              >
                <span>Go to Notes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <button
            onClick={() => handleDirectSignIn('/resources')}
            disabled={isSigningIn}
            className="w-full bg-[#0F1410]/90 hover:bg-[#151D17] border-2 border-[#10B981]/40 hover:border-[#10B981] rounded-3xl p-5 sm:p-6 flex items-center justify-between shadow-2xl shadow-[#10B981]/15 transition-all group cursor-pointer backdrop-blur-md"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981] flex items-center justify-center text-black shadow-lg shadow-[#10B981]/30 flex-shrink-0 group-hover:scale-105 transition-transform">
                {isSigningIn ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
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
              </div>
              <div className="text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-lg sm:text-xl font-extrabold text-[#F0FDF4] group-hover:text-[#34D399] transition">
                    Sign in with Somaiya
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/15 text-[#34D399] font-bold border border-[#10B981]/30 uppercase">
                    @somaiya.edu
                  </span>
                </div>
                <p className="text-xs text-[#86998A] mt-0.5">
                  Unlock semester sync, saved study resources, and cloud access
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {/* ======================================================== */}
      {/* AUTH REQUIRED MODAL PROMPT FOR HOMEPAGE TABS             */}
      {/* ======================================================== */}
      {authPromptTab && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-[#0F1410] border border-[#1C271E] hover:border-[#10B981]/40 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative space-y-6 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setAuthPromptTab(null)}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] transition"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="text-center space-y-3 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mx-auto shadow-lg shadow-[#10B981]/20">
                <Lock className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                <span>Institutional Gate</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#F0FDF4] tracking-tight">
                Sign in to open {authPromptTab.name.split(' ')[0]}
              </h3>
              <p className="text-xs text-[#86998A] leading-relaxed max-w-xs mx-auto">
                Please authenticate using your official <span className="text-[#34D399] font-semibold">@somaiya.edu</span> Google ID to access this academic section.
              </p>
            </div>

            {/* Sign in button */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleDirectSignIn(authPromptTab.href)}
                disabled={isSigningIn}
                className="w-full flex items-center justify-center space-x-3 py-3.5 px-4 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:scale-[0.99] text-black font-bold text-xs shadow-lg shadow-[#10B981]/25 transition disabled:opacity-50 cursor-pointer"
              >
                {isSigningIn ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
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
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthPromptTab(null)}
                className="w-full py-2 text-center text-[11px] text-[#86998A] hover:text-[#F0FDF4] transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


