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
      return 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30';
    }
    if (c.includes('ESC') || c.includes('ENGINEERING SCIENCE') || c === 'ES') {
      return 'bg-[#A3E635]/15 text-[#A3E635] border-[#A3E635]/30';
    }
    if (c.includes('HSMC') || c.includes('HUMANITIES') || c.includes('COMMUNICATION') || c === 'HS' || c === 'HSS') {
      return 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30';
    }
    if (c.includes('PCC') || c.includes('CORE') || c === 'PC') {
      return 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/40';
    }
    return 'bg-[#151D17] text-[#86998A] border-[#1C271E]';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#0F1410] w-full max-w-4xl rounded-3xl border border-[#1C271E] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#080A08] border-b border-[#1C271E] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-black font-bold shadow-md">
              <Award className="w-4 h-4 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-[#F0FDF4] text-base leading-tight">
                Semester {semester} Credit Scheme & Syllabus Structure
              </h3>
              <p className="text-[11px] text-[#86998A]">
                R-2025 course categorization, contact hours, and credit evaluation scheme
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#86998A] hover:text-[#F0FDF4] hover:bg-[#151D17] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 bg-[#0F1410] text-xs">
          {/* Top Bar: Semester Switcher + View Mode Toggle + Total Credits Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#080A08] border border-[#1C271E]">
            {/* Semester Tabs */}
            {onSemesterChange && (
              <div className="flex items-center space-x-2">
                <span className="text-[11px] text-[#86998A] font-semibold uppercase">Semester:</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => onSemesterChange(1)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      semester === 1
                        ? 'bg-[#10B981] text-black font-bold shadow-md'
                        : 'bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4]'
                    }`}
                  >
                    Semester 1
                  </button>
                  <button
                    onClick={() => onSemesterChange(2)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      semester === 2
                        ? 'bg-[#10B981] text-black font-bold shadow-md'
                        : 'bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4]'
                    }`}
                  >
                    Semester 2
                  </button>
                </div>
              </div>
            )}

            {/* View Mode Toggle: Interactive vs Official Screenshot */}
            <div className="flex items-center bg-[#151D17] p-1 rounded-xl border border-[#1C271E]">
              <button
                onClick={() => setActiveTab('interactive')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'interactive'
                    ? 'bg-[#10B981] text-black font-bold shadow-md'
                    : 'text-[#86998A] hover:text-[#F0FDF4]'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Interactive Breakdown</span>
              </button>
              <button
                onClick={() => setActiveTab('pdf_screenshot')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  activeTab === 'pdf_screenshot'
                    ? 'bg-[#10B981] text-black font-bold shadow-md'
                    : 'text-[#86998A] hover:text-[#F0FDF4]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Official PDF Document Screenshot</span>
              </button>
            </div>

            {/* Total Credits */}
            <div className="flex items-center space-x-2">
              <span className="text-[#86998A] font-medium">Core Credits:</span>
              <span className="px-3 py-1 rounded-xl bg-[#10B981]/15 text-[#34D399] font-bold text-sm border border-[#10B981]/30">
                {totalCredits} Credits
              </span>
            </div>
          </div>

          {/* TAB 1: Interactive Table Breakdown */}
          {activeTab === 'interactive' ? (
            <>
              {/* Courses Table */}
              <div className="rounded-2xl border border-[#1C271E] overflow-hidden shadow-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080A08] text-[#86998A] font-semibold border-b border-[#1C271E]">
                    <tr>
                      <th className="p-3 pl-4">Course Code</th>
                      <th className="p-3">Course Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3 text-center">Theory (L)</th>
                      <th className="p-3 text-center">Tutorial/Lab (T/P)</th>
                      <th className="p-3 pr-4 text-right">Total Credits</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1C271E] text-[#F0FDF4]">
                    {semSubjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-[#86998A]">
                          No subjects configured for Semester {semester} yet.
                        </td>
                      </tr>
                    ) : (
                      semSubjects.map((sub) => {
                        const theory = sub.theoryCredits ?? (sub.credits > 1 ? sub.credits - 1 : sub.credits);
                        const practical = sub.practicalCredits ?? (sub.credits > 1 ? 1 : 0);

                        return (
                          <tr key={sub.id} className="hover:bg-[#151D17] transition">
                            <td className="p-3 pl-4 font-mono font-bold text-[#34D399] text-[11px]">
                              {sub.code}
                            </td>
                            <td className="p-3 font-semibold text-[#F0FDF4]">{sub.name}</td>
                            <td className="p-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryBadgeColor(
                                  sub.category
                                )}`}
                              >
                                {sub.category || 'BS'}
                              </span>
                            </td>
                            <td className="p-3 text-center font-mono text-[#86998A]">{theory}</td>
                            <td className="p-3 text-center font-mono text-[#86998A]">{practical}</td>
                            <td className="p-3 pr-4 text-right font-mono font-extrabold text-[#34D399] text-sm">
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
              <div className="p-4 rounded-2xl bg-[#080A08] border border-[#1C271E] space-y-2">
                <h4 className="font-bold text-[#86998A] text-xs uppercase tracking-wider">
                  Category Distribution (Semester {semester})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(categorySummary).map(([cat, cr]) => (
                    <div
                      key={cat}
                      className="px-3 py-1.5 rounded-xl bg-[#151D17] border border-[#1C271E] flex items-center space-x-2"
                    >
                      <span className="font-bold text-[#F0FDF4]">{cat}</span>
                      <span className="text-[#86998A]">•</span>
                      <span className="text-[#34D399] font-mono font-bold">{cr} Credits</span>
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
          <div className="p-4 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#34D399] flex items-start space-x-3 text-[11px]">
            <ShieldCheck className="w-5 h-5 flex-shrink-0 text-[#10B981] mt-0.5" />
            <div>
              <p className="font-bold text-[#F0FDF4]">Official Autonomous Scheme</p>
              <p className="text-[#86998A] mt-0.5">
                All credits and teaching hours comply with the R-2025 First Year Engineering Curriculum scheme (Version 3.0). Maker Space and Basket courses have been filtered per your preference.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#080A08] border-t border-[#1C271E] flex items-center justify-between">
          <Link
            href="/admin/hierarchy"
            onClick={onClose}
            className="text-[11px] text-[#34D399] hover:underline font-semibold"
          >
            ✏️ Edit Courses, Categories & Credits in Hierarchy Manager →
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition shadow-md"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
