'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  AlertOctagon,
  User,
  Shield,
} from 'lucide-react';
import { HubStore } from '@/lib/store';

export default function LoginPage() {
  const router = useRouter();
  const [emailInput, setEmailInput] = useState('aarav.shah@somaiya.edu');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = (forcedEmail?: string) => {
    setIsLoading(true);
    setErrorMsg(null);

    const email = (forcedEmail || emailInput).trim().toLowerCase();

    // Domain Gate validation (enforced under the hood)
    if (!email.endsWith('@somaiya.edu') && !email.endsWith('@somaiya.edu.in')) {
      setTimeout(() => {
        setIsLoading(false);
        setErrorMsg('Access Denied: Only institutional accounts ending in @somaiya.edu are permitted.');
      }, 500);
      return;
    }

    // Success
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes('admin')) {
        HubStore.setCurrentUser({
          id: `usr-admin-${Date.now()}`,
          email,
          fullName: 'Prof. Somaiya Admin',
          role: 'admin',
          currentSemester: 1,
          createdAt: new Date().toISOString(),
        });
      } else {
        HubStore.setCurrentUser({
          id: `usr-student-${Date.now()}`,
          email,
          fullName: email.split('@')[0].replace('.', ' ').toUpperCase(),
          role: 'student',
          currentSemester: 1,
          createdAt: new Date().toISOString(),
        });
      }
      router.push('/resources');
    }, 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="glow-spot-cyan top-20 left-1/2 -translate-x-1/2"></div>

      <div className="bg-[#1E293B] w-full max-w-md rounded-3xl p-8 border border-slate-700/80 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] mx-auto flex items-center justify-center text-slate-950 shadow-xl shadow-cyan-950/60 mb-3">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">Versa</h2>
          <p className="text-xs text-slate-400">
            Sign in to access your study repository, notes, and video lectures
          </p>
        </div>

        {/* Error Alert if non-institutional email is used */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start space-x-2.5 animate-in fade-in">
            <AlertOctagon className="w-4 h-4 text-rose-400 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed">
              <strong className="block text-rose-200">Invalid Account</strong>
              {errorMsg}
            </div>
          </div>
        )}

        {/* Google OAuth Form */}
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1 font-medium">
              Google Account Email
            </label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="your.name@somaiya.edu"
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            />
          </div>

          <button
            onClick={() => handleGoogleSignIn()}
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-3 py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#0F172A"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#0F172A"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#0F172A"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#0F172A"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>
        </div>

        {/* Quick Demo Pre-sets */}
        <div className="pt-4 border-t border-slate-700/80 space-y-2">
          <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider text-center">
            One-Click Quick Login
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setEmailInput('student.kjsce@somaiya.edu');
                handleGoogleSignIn('student.kjsce@somaiya.edu');
              }}
              className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800/80 border border-slate-700/70 text-left transition flex items-center space-x-2"
            >
              <User className="w-3.5 h-3.5 text-[#38BDF8]" />
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Student Account</p>
                <p className="text-[9px] text-slate-400">@somaiya.edu</p>
              </div>
            </button>

            <button
              onClick={() => {
                setEmailInput('admin.council@somaiya.edu');
                handleGoogleSignIn('admin.council@somaiya.edu');
              }}
              className="p-2.5 rounded-xl bg-[#0F172A] hover:bg-slate-800/80 border border-slate-700/70 text-left transition flex items-center space-x-2"
            >
              <Shield className="w-3.5 h-3.5 text-[#818CF8]" />
              <div>
                <p className="text-xs font-semibold text-[#F8FAFC]">Admin Account</p>
                <p className="text-[9px] text-slate-400">@somaiya.edu</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
