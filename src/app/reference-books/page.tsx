'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BookMarked,
  BookOpen,
  GraduationCap,
  Search,
  Calendar,
  Layers,
  ChevronRight,
  CheckCircle2,
  Library,
  BookText,
  Bookmark,
  Sparkles,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject, AcademicResource, UserProfile } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';

type YearLevel = 'FY' | 'SY';
type Step = 'year' | 'content';

export default function ReferenceBooksPage() {
  const [step, setStep] = useState<Step>('year');
  const [yearLevel, setYearLevel] = useState<YearLevel>('FY');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Sync with HubStore
  useEffect(() => {
    setSubjects(HubStore.getSubjects());
    setResources(HubStore.getResources());
    setCurrentUser(HubStore.getCurrentUser());

    const handleUpdate = () => {
      setSubjects(HubStore.getSubjects());
      setResources(HubStore.getResources());
      setCurrentUser(HubStore.getCurrentUser());
    };

    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  // Step Transitions
  const handleSelectYear = (year: YearLevel) => {
    setYearLevel(year);
    if (year === 'FY') {
      setSelectedSemester(1);
    } else {
      setSelectedSemester(3);
    }
    setSelectedSubjectId(null);
    setStep('content');
  };

  // Available semesters for the selected year
  const availableSemesters = yearLevel === 'FY' ? [1, 2] : [3, 4];

  // Subjects for the active semester
  const semesterSubjects = useMemo(() => {
    return subjects.filter((s) => s.semester === selectedSemester);
  }, [subjects, selectedSemester]);

  // Filtered Reference Book Resources
  const referenceBookResources = useMemo(() => {
    return resources.filter((res) => {
      // Must be a Reference Book or PDF Textbook
      const isReference =
        res.type === 'pdf' ||
        res.type === 'reference_book' ||
        res.title.toLowerCase().includes('reference') ||
        res.title.toLowerCase().includes('textbook') ||
        res.title.toLowerCase().includes('book') ||
        res.tags?.some((t) => t.toLowerCase().includes('reference') || t.toLowerCase().includes('book'));

      if (!isReference) return false;

      // Match subject and semester
      const subject = subjects.find((s) => s.id === res.subjectId);
      if (!subject) return false;
      if (subject.semester !== selectedSemester) return false;

      // If a specific subject is selected, match subject ID
      if (selectedSubjectId && res.subjectId !== selectedSubjectId) return false;

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchSubName = subject.name.toLowerCase().includes(q);
        const matchTags = res.tags?.some((t) => t.toLowerCase().includes(q));
        const matchAuthor = res.uploaderName?.toLowerCase().includes(q);
        if (!matchTitle && !matchSubName && !matchTags && !matchAuthor) return false;
      }

      return true;
    });
  }, [resources, subjects, selectedSemester, selectedSubjectId, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 🧭 BREADCRUMBS & NAVIGATION BAR                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C271E] pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <button
            onClick={() => setStep('year')}
            className={`hover:text-[#34D399] transition ${
              step === 'year' ? 'text-[#34D399] font-bold' : 'text-[#86998A]'
            }`}
          >
            Reference Books
          </button>

          {step === 'content' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#627766]" />
              <span className="text-[#F0FDF4] font-bold">
                {yearLevel} • Semester {selectedSemester}
              </span>
            </>
          )}
        </div>

        {step !== 'year' && (
          <button
            onClick={() => setStep('year')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0F1410] hover:bg-[#151D17] border border-[#1C271E] text-xs font-semibold text-[#86998A] hover:text-[#F0FDF4] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Year Selection</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 🎓 VIEW 1: YEAR SELECTION (FY vs SY)                                      */}
      {/* ========================================================================= */}
      {step === 'year' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold">
              <BookMarked className="w-4 h-4 text-[#34D399]" />
              <span>Standard Textbooks & Academic References</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
              Select Academic Year
            </h1>
            <p className="text-sm text-[#86998A] max-w-2xl leading-relaxed">
              Explore curated standard author textbooks and university syllabus reference books for your academic year.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* FY Box */}
            <div
              onClick={() => handleSelectYear('FY')}
              className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-[#10B981] rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10B981]/20 transition-all" />

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
                  <BookOpen className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-black text-[#F0FDF4] group-hover:text-[#34D399] transition">
                      First Year (FY)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30">
                      Sem 1 & 2
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F0FDF4] mb-1">Engineering Sciences & Mathematics</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    B.S. Grewal, Gaur & Gupta Physics, Jain & Jain Chemistry, B.L. Theraja BEE, and Balagurusamy C Programming.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
                <span>Browse FY Reference Books</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* SY Box */}
            <div
              onClick={() => handleSelectYear('SY')}
              className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-[#10B981] rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10B981]/20 transition-all" />

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
                  <Library className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-black text-[#F0FDF4] group-hover:text-[#34D399] transition">
                      Second Year (SY)
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30">
                      Sem 3 & 4
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F0FDF4] mb-1">Computer Engineering Core Textbooks</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    CLRS Algorithms, Rosen Discrete Math, Silberschatz OS & DBMS, Tanenbaum Networks, and Patterson COA.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
                <span>Browse SY Reference Books</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📚 VIEW 2: SEMESTERS, SUBJECTS & BOOKS LIST                               */}
      {/* ========================================================================= */}
      {step === 'content' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-xs font-bold">
              <span>
                {yearLevel} (Semester {selectedSemester}) • Reference Books
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight">
              Reference Books & Textbooks — {yearLevel}
            </h1>
          </div>

          {/* Semester Selector Tabs */}
          <div className="flex flex-wrap gap-3">
            {availableSemesters.map((sem) => {
              const isSelected = selectedSemester === sem;
              return (
                <button
                  key={sem}
                  onClick={() => {
                    setSelectedSemester(sem);
                    setSelectedSubjectId(null);
                  }}
                  className={`px-6 py-3.5 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center space-x-2.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#10B981] text-black border-[#10B981] shadow-lg shadow-emerald-950/30'
                      : 'bg-[#0F1410]/90 text-[#86998A] border-[#1C271E] hover:border-[#34D399]/40 hover:text-[#F0FDF4]'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Semester {sem}</span>
                </button>
              );
            })}
          </div>

          {/* Subject Filter Pills */}
          {semesterSubjects.length > 0 && (
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#86998A]">
                  Filter by Subject
                </label>
                {selectedSubjectId && (
                  <button
                    onClick={() => setSelectedSubjectId(null)}
                    className="text-xs text-[#34D399] hover:underline font-semibold"
                  >
                    View All Subjects
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubjectId(null)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                    selectedSubjectId === null
                      ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399]'
                      : 'bg-[#0F1410] border-[#1C271E] text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  All Subjects ({semesterSubjects.length})
                </button>
                {semesterSubjects.map((sub) => {
                  const isSubSelected = selectedSubjectId === sub.id;
                  return (
                    <button
                      key={sub.id}
                      onClick={() => setSelectedSubjectId(sub.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        isSubSelected
                          ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399]'
                          : 'bg-[#0F1410] border-[#1C271E] text-[#86998A] hover:text-[#F0FDF4]'
                      }`}
                    >
                      {sub.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative bg-[#0F1410]/80 backdrop-blur-md rounded-2xl p-2 border border-[#1C271E] shadow-sm flex items-center">
            <Search className="w-5 h-5 text-[#86998A] ml-3" />
            <input
              type="text"
              placeholder="Search reference books by title, author name, course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none px-4 py-2 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#86998A] hover:text-[#F0FDF4] mr-3"
              >
                Clear
              </button>
            )}
          </div>

          {/* Books List */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between text-xs text-[#86998A]">
              <span>
                Showing <strong className="text-[#34D399]">{referenceBookResources.length}</strong> reference books for{' '}
                <strong>
                  {yearLevel} • Semester {selectedSemester}
                </strong>
              </span>
            </div>

            {referenceBookResources.length > 0 ? (
              <div className="space-y-3">
                {referenceBookResources.map((res) => {
                  const sub = subjects.find((s) => s.id === res.subjectId);
                  return (
                    <ResourceCard
                      key={res.id}
                      resource={res}
                      siblingResources={referenceBookResources}
                      subjectName={sub?.name}
                      subjects={subjects}
                      modules={[]}
                      onDownload={(id) => HubStore.incrementDownload(id)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="bg-[#0F1410]/60 backdrop-blur-md p-12 rounded-3xl border border-dashed border-[#1C271E] text-center space-y-4 max-w-xl mx-auto my-6">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 text-[#34D399] flex items-center justify-center mx-auto">
                  <Library className="w-7 h-7" />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-[#F0FDF4] text-lg">No Reference Books Found</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    {yearLevel === 'SY'
                      ? 'Second Year reference books and standard author texts are being digitized.'
                      : 'No reference books matched your current filters. Try changing semester or search terms.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
