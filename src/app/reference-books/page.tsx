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
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject, AcademicResource, UserProfile } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';

type YearLevel = 'FY' | 'SY';

export default function ReferenceBooksPage() {
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

  // Update semester when year changes
  const handleYearChange = (year: YearLevel) => {
    setYearLevel(year);
    if (year === 'FY') {
      setSelectedSemester(1);
    } else {
      setSelectedSemester(3);
    }
    setSelectedSubjectId(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 🏷️ HEADER SECTION                                                        */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold">
          <BookMarked className="w-4 h-4 text-[#34D399]" />
          <span>Standard Textbooks & Academic References</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          Reference Books
        </h1>
        <p className="text-sm text-[#86998A] max-w-2xl leading-relaxed">
          Curated author textbooks, international editions, and standard engineering reference books aligned with university syllabus units.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 🎓 STEP 1: YEAR LEVEL BOXES (FY vs SY)                                     */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#86998A] flex items-center space-x-2">
          <span>Step 1: Select Academic Year</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* FY Box */}
          <button
            onClick={() => handleYearChange('FY')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
              yearLevel === 'FY'
                ? 'bg-[#10B981]/15 border-[#10B981] shadow-lg shadow-emerald-950/20'
                : 'bg-[#0F1410]/80 border-[#1C271E] hover:border-[#34D399]/40 hover:bg-[#131A14]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold text-[#F0FDF4]">First Year (FY)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] font-bold">
                  Sem 1 & 2
                </span>
              </div>
              <p className="text-xs text-[#86998A]">Applied Math, Physics, Chemistry, BEE, Programming Textbooks</p>
            </div>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                yearLevel === 'FY' ? 'bg-[#10B981] text-black' : 'bg-[#151D17] text-[#86998A]'
              }`}
            >
              {yearLevel === 'FY' ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </button>

          {/* SY Box */}
          <button
            onClick={() => handleYearChange('SY')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-center justify-between group cursor-pointer ${
              yearLevel === 'SY'
                ? 'bg-[#10B981]/15 border-[#10B981] shadow-lg shadow-emerald-950/20'
                : 'bg-[#0F1410]/80 border-[#1C271E] hover:border-[#34D399]/40 hover:bg-[#131A14]'
            }`}
          >
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-lg font-extrabold text-[#F0FDF4]">Second Year (SY)</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#34D399] font-bold">
                  Sem 3 & 4
                </span>
              </div>
              <p className="text-xs text-[#86998A]">DSA, Computer Architecture, OS, DBMS, Networks References</p>
            </div>
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                yearLevel === 'SY' ? 'bg-[#10B981] text-black' : 'bg-[#151D17] text-[#86998A]'
              }`}
            >
              {yearLevel === 'SY' ? <CheckCircle2 className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🗓️ STEP 2: SEMESTER BREAKDOWN BOXES                                        */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#86998A] flex items-center space-x-2">
          <span>Step 2: Select Semester</span>
        </label>
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
                className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm border transition-all flex items-center space-x-2.5 ${
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
      </div>

      {/* ========================================================================= */}
      {/* 📚 STEP 3: SUBJECT FILTER PILLS                                           */}
      {/* ========================================================================= */}
      {semesterSubjects.length > 0 && (
        <div className="space-y-3 pt-2">
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
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
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
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition ${
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
          className="w-full bg-transparent border-none px-4 py-2.5 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none"
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

      {/* ========================================================================= */}
      {/* 📖 REFERENCE BOOKS LIST                                                   */}
      {/* ========================================================================= */}
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
  );
}
