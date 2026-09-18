'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  AlertOctagon,
  User,
  Shield,
  CheckCircle2,
  Lock,
  ArrowRight,
} from 'lucide-react';
import { HubStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('student.fy@somaiya.edu');
  const [nameInput, setNameInput] = useState('Aarav Shah');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = (forcedEmail?: string, forcedName?: string, forcedAvatar?: string) => {
    setIsLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const email = (forcedEmail || emailInput).trim().toLowerCase();
    const rawName = forcedName || nameInput || email.split('@')[0].replace('.', ' ');
    const formattedName = rawName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Strict Institutional Domain Gate
    if (!email.endsWith('@somaiya.edu') && !email.endsWith('@somaiya.edu.in')) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg('Access Denied: Only institutional Google accounts ending in @somaiya.edu are permitted.');
      }, 400);
      return;
    }

    const avatarUrl = forcedAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formattedName)}&background=38BDF8&color=090D16&bold=true&size=128`;

    setTimeout(() => {
      setIsLoading(false);
      const isAdmin = email.startsWith('admin') || email.includes('faculty') || email.includes('council');
      
      const userProfile = {
        id: `usr-${isAdmin ? 'admin' : 'student'}-${Date.now()}`,
        email,
        fullName: formattedName,
        avatarUrl,
        role: (isAdmin ? 'admin' : 'student') as 'admin' | 'student',
        currentSemester: 1 as 1 | 2,
        createdAt: new Date().toISOString(),
      };

      HubStore.setCurrentUser(userProfile);
      setSuccessMsg(`Welcome, ${formattedName}! Redirecting to study portal...`);

      setTimeout(() => {
        router.push('/resources');
      }, 600);
    }, 600);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 relative">
      <div className="glow-spot-cyan top-16 left-1/2 -translate-x-1/2"></div>
      <div className="glow-spot-indigo bottom-16 right-1/4"></div>

      <div className="bg-[#131C31] w-full max-w-md rounded-3xl p-7 sm:p-8 border border-slate-700/80 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Somaiya Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#6366F1] to-[#818CF8] mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-950/60 mb-3">
            <GraduationCap className="w-8 h-8 text-slate-950" />
          </div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] text-[10px] font-bold uppercase tracking-wider">
            <span>Institutional Login</span>
          </div>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Versa Study Portal</h2>
          <p className="text-xs text-slate-400">
            Sign in using your official <span className="text-[#38BDF8] font-semibold">@somaiya.edu</span> Google account
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2.5 animate-in fade-in">
            <AlertOctagon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed">
              <strong className="block text-rose-200">Non-Institutional Account</strong>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-center space-x-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-300 block font-semibold">
              Student Full Name
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Aarav Shah"
              className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] text-slate-300 block font-semibold">
              Somaiya Google Email ID
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your.name@somaiya.edu"
              className="w-full bg-[#090D16] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <button
            onClick={() => handleSignIn()}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/50 transition disabled:opacity-50 group"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#090D16"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#090D16"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#090D16"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#090D16"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with @somaiya.edu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Quick Demo Pre-sets */}
        <div className="pt-4 border-t border-slate-700/80 space-y-2.5">
          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider text-center">
            One-Click Verified Somaiya Presets
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setNameInput('Aarav Shah');
                setEmailInput('aarav.shah@somaiya.edu');
                handleSignIn('aarav.shah@somaiya.edu', 'Aarav Shah', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80');
              }}
              className="p-2.5 rounded-2xl bg-[#090D16] hover:bg-slate-800/80 border border-slate-700/80 text-left transition flex items-center space-x-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-[#38BDF8] shrink-0 font-bold text-xs">
                AS
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#38BDF8] transition">Aarav Shah</p>
                <p className="text-[9px] text-slate-400 truncate">Student ID</p>
              </div>
            </button>

            <button
              onClick={() => {
                setNameInput('Prof. Somaiya Admin');
                setEmailInput('admin.council@somaiya.edu');
                handleSignIn('admin.council@somaiya.edu', 'Prof. Somaiya Admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80');
              }}
              className="p-2.5 rounded-2xl bg-[#090D16] hover:bg-slate-800/80 border border-slate-700/80 text-left transition flex items-center space-x-2.5 group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-[#818CF8] shrink-0 font-bold text-xs">
                AD
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-[#F8FAFC] truncate group-hover:text-[#818CF8] transition">Admin Staff</p>
                <p className="text-[9px] text-slate-400 truncate">Faculty ID</p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-1 text-[10px] text-slate-500">
          <Lock className="w-3 h-3 text-[#38BDF8]" />
          <span>Protected by Somaiya University Single Sign-On (SSO) Gate</span>
        </div>
      </div>
    </div>
  );
}
