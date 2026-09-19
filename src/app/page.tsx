'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  ArrowRight,
  FileText,
  FileCode,
  FileCheck,
  Tv,
  Award,
  Clock,
  BookOpen,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject } from '@/lib/types';
import CreditSchemeModal from '@/components/CreditSchemeModal';

export default function HomePage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState<1 | 2>(1);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2 | 3 | 4>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all');
  const [isCreditSchemeOpen, setIsCreditSchemeOpen] = useState(false);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setSubjects(HubStore.getSubjects());
  };

  const semSubjects = subjects.filter((s) => s.semester === (selectedSemester as 1 | 2));
  const sem1Credits = subjects.filter((s) => s.semester === 1).reduce((sum, s) => sum + (s.credits || 0), 0);
  const sem2Credits = subjects.filter((s) => s.semester === 2).reduce((sum, s) => sum + (s.credits || 0), 0);

  return (
    <div className="min-h-screen relative overflow-hidden pb-16">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F0FDF4] max-w-4xl mx-auto leading-tight">
          <span>Versa</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-[#86998A] max-w-2xl mx-auto leading-relaxed">
          The syllabus-aligned study repository. Access curated module PPTs, PYQs, and reference books.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative bg-[#0F1410]/80 backdrop-blur-md rounded-2xl p-2 border border-[#1C271E] shadow-lg flex items-center">
            <Search className="w-5 h-5 text-[#86998A] ml-3" />
            <input
              type="text"
              placeholder="Search Applied Maths, BEE Thevenin, Physics Lasers, C Pointers, PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none px-4 py-2.5 text-sm text-[#F0FDF4] placeholder-[#627766] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#86998A] hover:text-[#F0FDF4] mr-2"
              >
                Clear
              </button>
            )}
            <Link
              href={`/resources?q=${encodeURIComponent(searchQuery)}&sem=${selectedSemester <= 2 ? selectedSemester : 1}`}
              className="px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold shadow-sm transition flex items-center space-x-1.5"
            >
              <span>Explore Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Year Selector: First Year / Second Year */}
        <div className="flex flex-col items-center justify-center gap-3 mt-7">
          <div className="flex bg-[#0F1410] p-1.5 rounded-2xl border border-[#1C271E] shadow-sm gap-1">
            <button
              onClick={() => {
                setSelectedYear(1);
                setSelectedSemester(1);
                setSelectedSubjectId('all');
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedYear === 1
                  ? 'bg-[#10B981] text-black shadow-sm font-extrabold'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              <span>First Year</span>
            </button>
            <button
              onClick={() => {
                setSelectedYear(2);
                setSelectedSemester(3);
                setSelectedSubjectId('all');
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedYear === 2
                  ? 'bg-[#10B981] text-black shadow-sm font-extrabold'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              <span>Second Year</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                  selectedYear === 2
                    ? 'bg-black/20 text-black'
                    : 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
                }`}
              >
                Soon
              </span>
            </button>
          </div>

          {/* Nested Semester Selector for Selected Year */}
          {selectedYear === 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 animate-in fade-in">
              <div className="flex bg-[#0F1410] p-1 rounded-xl border border-[#1C271E] shadow-sm">
                <button
                  onClick={() => {
                    setSelectedSemester(1);
                    setSelectedSubjectId('all');
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 1
                      ? 'bg-[#10B981] text-black font-bold shadow-sm'
                      : 'text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  Semester 1 ({sem1Credits} Credits)
                </button>
                <button
                  onClick={() => {
                    setSelectedSemester(2);
                    setSelectedSubjectId('all');
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 2
                      ? 'bg-[#10B981] text-black font-bold shadow-sm'
                      : 'text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  Semester 2 ({sem2Credits} Credits)
                </button>
              </div>

              <button
                onClick={() => setIsCreditSchemeOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/30 hover:bg-[#10B981]/20 text-xs font-semibold shadow-sm transition"
              >
                <Award className="w-3.5 h-3.5 text-[#34D399]" />
                <span>View Credit Scheme & PDF</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 animate-in fade-in">
              <div className="flex bg-[#0F1410] p-1 rounded-xl border border-[#1C271E] shadow-sm">
                <button
                  onClick={() => setSelectedSemester(3)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 3
                      ? 'bg-[#10B981] text-black font-bold shadow-sm'
                      : 'text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  Semester 3
                </button>
                <button
                  onClick={() => setSelectedSemester(4)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 4
                      ? 'bg-[#10B981] text-black font-bold shadow-sm'
                      : 'text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  Semester 4
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area based on Year */}
      {selectedYear === 1 ? (
        <>
          {/* Subject Quick Jump Bar */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="bg-[#0F1410]/80 backdrop-blur-md p-4 rounded-2xl border border-[#1C271E] shadow-sm">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-[#F0FDF4] uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                  <span>Semester {selectedSemester} Subjects ({semSubjects.length}):</span>
                </span>
                <button
                  onClick={() => setSelectedSubjectId('all')}
                  className={`text-[11px] font-semibold hover:underline ${
                    selectedSubjectId === 'all' ? 'text-[#34D399]' : 'text-[#86998A]'
                  }`}
                >
                  Show All Subjects
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {semSubjects.map((sub) => {
                  return (
                    <Link
                      key={sub.id}
                      href={`/resources?subject=${sub.id}&sem=${selectedSemester}`}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 bg-[#151D17] text-[#86998A] border-[#1C271E] hover:border-[#34D399] hover:text-[#F0FDF4]"
                    >
                      <span className="font-mono text-[10px] text-[#34D399] font-bold">{sub.code}</span>
                      <span>{sub.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          {/* 4 Core Notes Pillars */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Notes */}
              <Link
                href={`/resources?type=notes&sem=${selectedSemester}`}
                className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] group hover:border-[#34D399] hover:bg-[#131A14] transition shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F0FDF4] text-base mb-1">Notes</h3>
                <p className="text-xs text-[#86998A] leading-relaxed">
                  Comprehensive handwritten & faculty theory notes and slide presentations module by module.
                </p>
              </Link>

              {/* Card 2: Formula Sheet */}
              <Link
                href={`/resources?type=formula_sheet&sem=${selectedSemester}`}
                className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] group hover:border-[#A3E635] hover:bg-[#131A14] transition shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#A3E635]/15 border border-[#A3E635]/30 flex items-center justify-center text-[#A3E635] mb-4 group-hover:scale-110 transition-transform">
                  <FileCode className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F0FDF4] text-base mb-1">Formula Sheet</h3>
                <p className="text-xs text-[#86998A] leading-relaxed">
                  High-yield equations, proofs, theorems, and shortcut sheets for exam revision.
                </p>
              </Link>

              {/* Card 3: Solved PYQs */}
              <Link
                href={`/resources?type=pyq&sem=${selectedSemester}`}
                className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] group hover:border-[#F59E0B] hover:bg-[#131A14] transition shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B] mb-4 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F0FDF4] text-base mb-1">Solved PYQs</h3>
                <p className="text-xs text-[#86998A] leading-relaxed">
                  Past university and autonomous question papers with step-by-step model answer solutions.
                </p>
              </Link>

              {/* Card 4: Video Lectures */}
              <Link
                href="/youtube"
                className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] group hover:border-[#34D399] hover:bg-[#131A14] transition shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] mb-4 group-hover:scale-110 transition-transform">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F0FDF4] text-base mb-1">Video Lectures</h3>
                <p className="text-xs text-[#86998A] leading-relaxed">
                  Curated YouTube playlists mapped to university syllabus units by top engineering educators.
                </p>
              </Link>
            </div>
          </section>
        </>
      ) : (
        /* Second Year Placeholder */
        <section className="max-w-2xl mx-auto px-4 py-12 text-center animate-in fade-in">
          <div className="bg-[#0F1410]/80 backdrop-blur-md p-10 rounded-3xl border border-dashed border-[#1C271E] shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] flex items-center justify-center mx-auto">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#F0FDF4]">Second Year Notes Coming Soon</h3>
            <p className="text-xs text-[#86998A] max-w-sm mx-auto">
              We are actively verifying syllabus-aligned materials for Semester 3 and Semester 4.
            </p>
            <button
              onClick={() => {
                setSelectedYear(1);
                setSelectedSemester(1);
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-sm transition"
            >
              <span>View First Year Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      )}

      {/* Credit Scheme Modal */}
      <CreditSchemeModal
        isOpen={isCreditSchemeOpen}
        onClose={() => setIsCreditSchemeOpen(false)}
        semester={selectedSemester === 2 ? 2 : 1}
        subjects={subjects}
        onSemesterChange={(sem) => setSelectedSemester(sem)}
      />
    </div>
  );
}
