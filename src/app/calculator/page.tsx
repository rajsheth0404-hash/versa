'use client';

import React, { useState } from 'react';
import { Calculator, Clock, Sparkles, CheckCircle2, ShieldCheck, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CalculatorPage() {
  const [isNotified, setIsNotified] = useState(false);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    setIsNotified(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#38BDF8', '#818CF8', '#10B981'],
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-8 bg-[#0F172A] min-h-screen">
      {/* Badge */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#38BDF8]/10 border border-[#38BDF8]/30 text-[#38BDF8] text-xs font-semibold">
        <Clock className="w-3.5 h-3.5 animate-spin" />
        <span>Coming in Future Update</span>
      </div>

      {/* Main Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
          SGPA & CGPA Academic Planner
        </h1>
        <p className="text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
          The official 10-point grade point calculator and multi-semester CGPA forecasting tool is currently being calibrated for the revised syllabus and will be enabled in an upcoming release.
        </p>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
        <div className="glass-panel bg-[#1E293B]/80 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-[#38BDF8] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#F8FAFC] text-sm">Weighted SGPA</h3>
          <p className="text-[11px] text-slate-400">
            Auto-calculates weighted grades across all Semester 1 & 2 course credits.
          </p>
        </div>

        <div className="glass-panel bg-[#1E293B]/80 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#F8FAFC] text-sm">Target CGPA Forecast</h3>
          <p className="text-[11px] text-slate-400">
            Simulate required grades in End-Sem exams to maintain a target 9.0+ CGPA.
          </p>
        </div>

        <div className="glass-panel bg-[#1E293B]/80 p-5 rounded-3xl border border-slate-800 space-y-2">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-[#818CF8] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#F8FAFC] text-sm">10-Point Grading Scale</h3>
          <p className="text-[11px] text-slate-400">
            Fully mapped to Autonomous O, A+, A, B+, B, C grade boundaries.
          </p>
        </div>
      </div>

      {/* Notify Me Form */}
      <div className="glass-panel bg-[#1E293B]/90 p-6 sm:p-8 rounded-3xl border border-slate-800 max-w-lg mx-auto space-y-4 shadow-2xl">
        <div className="flex items-center justify-center space-x-2 text-slate-300 text-xs font-semibold">
          <Bell className="w-4 h-4 text-[#38BDF8]" />
          <span>Get notified as soon as SGPA Calculator launches</span>
        </div>

        {isNotified ? (
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>You will be notified via email upon release!</span>
          </div>
        ) : (
          <form onSubmit={handleNotifyMe} className="flex gap-2">
            <input
              type="email"
              placeholder="student@university.edu"
              required
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-[#38BDF8]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
