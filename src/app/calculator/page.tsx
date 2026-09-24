'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calculator, Clock, Sparkles, CheckCircle2, ShieldCheck, Bell, ArrowLeft, GraduationCap } from 'lucide-react';
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
      colors: ['#10B981', '#34D399', '#A3E635'],
    });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Top Standalone Header */}
      <header className="w-full border-b border-[#1C271E] bg-[#080A08]/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="inline-flex items-center space-x-2 text-xs font-semibold text-[#86998A] hover:text-[#34D399] transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Versa Home</span>
        </Link>
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-black">
            <GraduationCap className="w-4 h-4 text-black" />
          </div>
          <span className="font-extrabold text-sm text-[#F0FDF4]">Versa</span>
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-8 flex-1 flex flex-col justify-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold mx-auto">
          <Clock className="w-3.5 h-3.5 animate-spin" />
          <span>Coming in Future Update</span>
        </div>

      {/* Main Heading */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F0FDF4] tracking-tight">
          SGPA & CGPA Academic Planner
        </h1>
        <p className="text-[#86998A] text-sm max-w-xl mx-auto leading-relaxed">
          The official 10-point grade point calculator and multi-semester CGPA forecasting tool is currently being calibrated for the revised syllabus and will be enabled in an upcoming release.
        </p>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-5 rounded-3xl border border-[#1C271E] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center">
            <Calculator className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#F0FDF4] text-sm">Weighted SGPA</h3>
          <p className="text-[11px] text-[#86998A]">
            Auto-calculates weighted grades across all Semester 1 & 2 course credits.
          </p>
        </div>

        <div className="bg-[#0F1410]/80 backdrop-blur-md p-5 rounded-3xl border border-[#1C271E] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#F0FDF4] text-sm">Target CGPA Forecast</h3>
          <p className="text-[11px] text-[#86998A]">
            Simulate required grades in End-Sem exams to maintain a target 9.0+ CGPA.
          </p>
        </div>

        <div className="bg-[#0F1410]/80 backdrop-blur-md p-5 rounded-3xl border border-[#1C271E] space-y-2">
          <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#34D399] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-[#F0FDF4] text-sm">10-Point Grading Scale</h3>
          <p className="text-[11px] text-[#86998A]">
            Fully mapped to Autonomous O, A+, A, B+, B, C grade boundaries.
          </p>
        </div>
      </div>

      {/* Notify Me Form */}
      <div className="bg-[#0F1410]/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg mx-auto space-y-4 shadow-2xl">
        <div className="flex items-center justify-center space-x-2 text-[#86998A] text-xs font-semibold">
          <Bell className="w-4 h-4 text-[#34D399]" />
          <span>Get notified as soon as SGPA Calculator launches</span>
        </div>

        {isNotified ? (
          <div className="p-3 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs flex items-center justify-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>You will be notified via email upon release!</span>
          </div>
        ) : (
          <form onSubmit={handleNotifyMe} className="flex gap-2">
            <input
              type="email"
              placeholder="student@university.edu"
              required
              className="flex-1 bg-[#080A08] border border-[#1C271E] rounded-xl px-3.5 py-2 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-emerald-950/40 transition"
            >
              Notify Me
            </button>
          </form>
        )}
      </div>
      </div>
    </div>
  );
}
