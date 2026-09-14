'use client';

import React, { useState } from 'react';
import { Subject } from '@/lib/types';
import { Award, X, ShieldCheck, FileText, Table } from 'lucide-react';
import Link from 'next/link';
import OfficialSchemeSnapshot from './OfficialSchemeSnapshot';

interface CreditSchemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  semester: 1 | 2;
  subjects: Subject[];
  onSemesterChange?: (sem: 1 | 2) => void;
}

export default function CreditSchemeModal({
  isOpen,
  onClose,
  semester,
  subjects,
  onSemesterChange,
}: CreditSchemeModalProps) {
  const [activeTab, setActiveTab] = useState<'interactive' | 'pdf_screenshot'>('interactive');

  if (!isOpen) return null;

  const semSubjects = subjects.filter((s) => s.semester === semester);
  const totalCredits = semSubjects.reduce((sum, s) => sum + (s.credits || 0), 0);

  // Group by category
  const categorySummary = semSubjects.reduce<Record<string, number>>((acc, s) => {
    const cat = s.category || 'General';
    acc[cat] = (acc[cat] || 0) + (s.credits || 0);
    return acc;
  }, {});

  const getCategoryBadgeColor = (category?: string) => {
    const c = (category || '').toUpperCase();
    if (c.includes('BSC') || c.includes('BASIC SCIENCE') || c === 'BS') {
      return 'bg-blue-500/20 text-[#38BDF8] border-blue-500/30';
    }
    if (c.includes('ESC') || c.includes('ENGINEERING SCIENCE') || c === 'ES') {
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
    if (c.includes('HSMC') || c.includes('HUMANITIES') || c.includes('COMMUNICATION') || c === 'HS' || c === 'HSS') {
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
    if (c.includes('PCC') || c.includes('CORE') || c === 'PC') {
      return 'bg-purple-500/20 text-[#818CF8] border-purple-500/30';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="glass-panel bg-[#1E293B] w-full max-w-4xl rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Award className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-[#F8FAFC] text-base leading-tight">
                Semester {semester} Credit Scheme & Syllabus Structure
              </h3>
              <p className="text-[11px] text-slate-400">
                R-2025 course categorization, contact hours, and credit evaluation scheme
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#0F172A]/90 text-xs">
          {/* Top Bar: Semester Switcher + View Mode Toggle + Total Credits Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            {/* Semester Tabs */}
            {onSemesterChange && (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Semester:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onSemesterChange(1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      semester === 1
                        ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Semester 1
                  </button>
                  <button
                    onClick={() => onSemesterChange(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      semester === 2
                        ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Semester 2
                  </button>
                </div>
              </div>
            )}

            {/* View Mode Toggle: Interactive vs Official Screenshot */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('interactive')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'interactive'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Interactive Breakdown</span>
              </button>
              <button
                onClick={() => setActiveTab('pdf_screenshot')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'pdf_screenshot'
                    ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Official PDF Document Screenshot</span>
              </button>
            </div>

            {/* Total Credits */}
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Core Credits:</span>
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold text-sm border border-emerald-500/30">
                {totalCredits} Credits
              </span>
            </div>
          </div>

          {/* TAB 1: Interactive Table Breakdown */}
          {activeTab === 'interactive' ? (
            <>
              {/* Courses Table */}
              <div className="rounded-2xl border border-slate-800 overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/90 text-slate-400 font-semibold border-b border-slate-800">
                    <tr>
                      <th className="p-3 pl-4">Course Code</th>
                      <th className="p-3">Course Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Theory (L)</th>
                      <th className="p-3 text-center">Tutorial/Lab (T/P)</th>
                      <th className="p-3 pr-4 text-right">Total Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {semSubjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-500">
                          No subjects configured for Semester {semester} yet.
                        </td>
                      </tr>
                    ) : (
                      semSubjects.map((sub) => {
                        const theory = sub.theoryCredits ?? (sub.credits > 1 ? sub.credits - 1 : sub.credits);
                        const practical = sub.practicalCredits ?? (sub.credits > 1 ? 1 : 0);

                        return (
                          <tr key={sub.id} className="hover:bg-slate-900/40 transition">
                            <td className="p-3 pl-4 font-mono font-bold text-slate-300 text-[11px]">
                              {sub.code}
                            </td>
                            <td className="p-3 font-semibold text-slate-100">{sub.name}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeColor(
                                  sub.category
                                )}`}
                              >
                                {sub.category || 'BS'}
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono text-slate-300">{theory}</td>
                            <td className="p-3 text-center font-mono text-slate-300">{practical}</td>
                            <td className="p-3 pr-4 text-right font-mono font-extrabold text-emerald-400 text-sm">
                              {sub.credits}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Category-Wise Breakdown Pill Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
                  Category Distribution (Semester {semester})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categorySummary).map(([cat, cr]) => (
                    <div
                      key={cat}
                      className="px-3 py-1.5 rounded-xl bg-[#1E293B] border border-slate-700/80 flex items-center space-x-2"
                    >
                      <span className="font-bold text-slate-200">{cat}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-[#38BDF8] font-mono font-bold">{cr} Credits</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* TAB 2: Official Document Screenshot / Replica from the PDF */
            <OfficialSchemeSnapshot semester={semester} />
          )}

          {/* Guidelines Footer */}
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 flex items-start space-x-3 text-[11px]">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#818CF8] mt-0.5" />
            <div>
              <p className="font-bold">Official Autonomous Scheme</p>
              <p className="text-indigo-200/80 mt-0.5">
                All credits and teaching hours comply with the R-2025 First Year Engineering Curriculum scheme (Version 3.0). Maker Space and Basket courses have been filtered per your preference.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between">
          <Link
            href="/admin/hierarchy"
            onClick={onClose}
            className="text-[11px] text-[#38BDF8] hover:underline font-semibold"
          >
            ✏️ Edit Courses, Categories & Credits in Hierarchy Manager →
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs transition shadow-md"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
