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
    <div className="min-h-screen relative overflow-hidden pb-16 bg-[#0F172A]">
      {/* Background Ambient Glows (Midnight Cyber) */}
      <div className="glow-spot-cyan top-10 left-1/4 -translate-x-1/2"></div>
      <div className="glow-spot-indigo top-80 right-10"></div>

      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F8FAFC] max-w-4xl mx-auto leading-tight">
          <span className="cyber-gradient-text">Versa</span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          The syllabus-aligned study repository. Access curated module PPTs, PYQs, reference books.
        </p>

        {/* Hero Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative glass-panel bg-[#1E293B]/90 rounded-2xl p-2 border border-slate-700 shadow-2xl flex items-center">
            <Search className="w-5 h-5 text-slate-400 ml-3" />
            <input
              type="text"
              placeholder="Search Applied Maths, BEE Thevenin, Physics Lasers, C Pointers, PYQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none px-4 py-2.5 text-sm text-[#F8FAFC] placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white mr-2"
              >
                Clear
              </button>
            )}
            <Link
              href={`/resources?q=${encodeURIComponent(searchQuery)}&sem=${selectedSemester <= 2 ? selectedSemester : 1}`}
              className="px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/50 transition flex items-center space-x-1.5"
            >
              <span>Explore Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Year Selector: First Year / Second Year */}
        <div className="flex flex-col items-center justify-center gap-3 mt-7">
          <div className="flex bg-[#1E293B]/90 p-1.5 rounded-2xl border border-slate-700 shadow-xl gap-1">
            <button
              onClick={() => {
                setSelectedYear(1);
                setSelectedSemester(1);
                setSelectedSubjectId('all');
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedYear === 1
                  ? 'bg-[#38BDF8] text-slate-950 shadow-lg shadow-cyan-950/40 font-extrabold'
                  : 'text-slate-400 hover:text-white'
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
                  ? 'bg-[#38BDF8] text-slate-950 shadow-lg shadow-cyan-950/40 font-extrabold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Second Year</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold ${
                  selectedYear === 2
                    ? 'bg-slate-950/30 text-slate-950'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                Soon
              </span>
            </button>
          </div>

          {/* Nested Semester Selector for Selected Year */}
          {selectedYear === 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 animate-in fade-in">
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-md">
                <button
                  onClick={() => {
                    setSelectedSemester(1);
                    setSelectedSubjectId('all');
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 1
                      ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
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
                      ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Semester 2 ({sem2Credits} Credits)
                </button>
              </div>

              <button
                onClick={() => setIsCreditSchemeOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 text-xs font-semibold shadow-md transition"
              >
                <Award className="w-3.5 h-3.5 text-[#818CF8]" />
                <span>View Credit Scheme & PDF</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2 animate-in fade-in">
              <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-md">
                <button
                  onClick={() => setSelectedSemester(3)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 3
                      ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Semester 3
                </button>
                <button
                  onClick={() => setSelectedSemester(4)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedSemester === 4
                      ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white'
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
            <div className="glass-panel bg-[#1E293B]/70 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
                  <span>Semester {selectedSemester} Subjects ({semSubjects.length}):</span>
                </span>
                <button
                  onClick={() => setSelectedSubjectId('all')}
                  className={`text-[11px] font-semibold hover:underline ${
                    selectedSubjectId === 'all' ? 'text-[#38BDF8]' : 'text-slate-400'
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
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 bg-slate-900/90 text-slate-300 border-slate-700/80 hover:border-[#38BDF8] hover:text-[#38BDF8]"
                    >
                      <span className="font-mono text-[10px] text-[#818CF8] font-bold">{sub.code}</span>
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
              {/* Card 1: Notes (Lecture Notes & Slides) */}
              <Link
                href={`/resources?type=notes&sem=${selectedSemester}`}
                className="glass-card bg-[#1E293B]/80 p-6 rounded-3xl border border-slate-800 group hover:border-[#38BDF8]/60 transition shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-[#38BDF8] mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F8FAFC] text-base mb-1">Notes</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Comprehensive handwritten & faculty theory notes and slide presentations module by module.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[#38BDF8] group-hover:translate-x-1 transition-transform">
                  <span>View Notes</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              {/* Card 2: Practice Questions */}
              <Link
                href={`/resources?type=practice_ques&sem=${selectedSemester}`}
                className="glass-card bg-[#1E293B]/80 p-6 rounded-3xl border border-slate-800 group hover:border-emerald-500/60 transition shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                  <FileCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F8FAFC] text-base mb-1">Practice Ques</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Topic-wise solved questions and numerical problem banks with step-by-step methods.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
                  <span>View Practice Ques</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              {/* Card 3: Year-wise PYQs */}
              <Link
                href={`/resources?type=pyq&sem=${selectedSemester}`}
                className="glass-card bg-[#1E293B]/80 p-6 rounded-3xl border border-slate-800 group hover:border-[#818CF8]/60 transition shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-[#818CF8] mb-4 group-hover:scale-110 transition-transform">
                  <FileCode className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F8FAFC] text-base mb-1">PYQs (Mid & End Sem)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Official year-wise Mid-Semester and End-Semester question papers for the whole course.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-[#818CF8] group-hover:translate-x-1 transition-transform">
                  <span>View Subject PYQs</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>

              {/* Card 4: Video Lectures */}
              <Link
                href="/youtube"
                className="glass-card bg-[#1E293B]/80 p-6 rounded-3xl border border-slate-800 group hover:border-purple-500/60 transition shadow-xl"
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                  <Tv className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-[#F8FAFC] text-base mb-1">Video Lectures</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Ad-free module video playlists organized by syllabus topics for focused learning.
                </p>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-400 group-hover:translate-x-1 transition-transform">
                  <span>Watch Lectures</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            </div>
          </section>
        </>
      ) : (
        /* Second Year: Notes to be added soon Container */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in">
          <div className="glass-panel bg-[#1E293B]/60 p-12 sm:p-16 rounded-3xl text-center border border-dashed border-slate-700/80 space-y-5 shadow-2xl max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-indigo-500/15 border border-indigo-500/30 text-[#818CF8] flex items-center justify-center mx-auto shadow-inner">
              <Clock className="w-8 h-8 text-[#38BDF8]" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold uppercase tracking-wider">
                <span>Second Year • Semester {selectedSemester}</span>
              </div>
              <h3 className="font-extrabold text-[#F8FAFC] text-2xl sm:text-3xl tracking-tight">
                Notes to be added soon
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                Curated module PPTs, handwritten faculty notes, solved PYQs, and reference books for Second Year are currently being compiled.
              </p>
            </div>

            <div className="pt-3">
              <button
                onClick={() => {
                  setSelectedYear(1);
                  setSelectedSemester(1);
                }}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-950/40"
              >
                <span>Explore First Year Notes</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
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
