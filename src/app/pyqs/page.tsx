'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  FileQuestion,
  GraduationCap,
  Layers,
  Search,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject, AcademicResource, UserProfile } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';

type ExamType = 'MSE' | 'ESE';
type YearLevel = 'FY' | 'SY';

export default function PyqsPage() {
  const [examType, setExamType] = useState<ExamType>('ESE');
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

  // Filtered PYQ Resources for the selected Exam Type, Year, and Semester
  const pyqResources = useMemo(() => {
    return resources.filter((res) => {
      // Must be a PYQ resource
      const isPyq =
        res.type === 'pyq' ||
        res.title.toLowerCase().includes('pyq') ||
        res.title.toLowerCase().includes('question paper') ||
        res.tags?.some((t) => t.toLowerCase().includes('pyq'));

      if (!isPyq) return false;

      // Match subject and semester
      const subject = subjects.find((s) => s.id === res.subjectId);
      if (!subject) return false;
      if (subject.semester !== selectedSemester) return false;

      // If a specific subject is selected, match subject ID
      if (selectedSubjectId && res.subjectId !== selectedSubjectId) return false;

      // Filter by Exam Type (MSE vs ESE)
      const titleLower = res.title.toLowerCase();
      const tagsStr = (res.tags || []).join(' ').toLowerCase();

      if (examType === 'MSE') {
        // If specifically tagged or marked for MSE / in-sem
        const isMse =
          res.examType === 'mid_sem' ||
          res.examType === 'in_sem' ||
          titleLower.includes('mse') ||
          titleLower.includes('in-sem') ||
          titleLower.includes('mid-sem') ||
          titleLower.includes('test') ||
          tagsStr.includes('mse') ||
          tagsStr.includes('in-sem');
        
        // If not explicitly marked as ESE/End-Sem, consider general PYQ papers as relevant
        const isExplicitEse =
          res.examType === 'end_sem' ||
          titleLower.includes('ese') ||
          titleLower.includes('end-sem') ||
          tagsStr.includes('ese');

        if (!isMse && isExplicitEse) return false;
      } else {
        // ESE (End Semester Exam)
        const isExplicitMse =
          (res.examType === 'mid_sem' || res.examType === 'in_sem') ||
          (titleLower.includes('mse') && !titleLower.includes('ese')) ||
          (tagsStr.includes('mse') && !tagsStr.includes('ese'));

        if (isExplicitMse) return false;
      }

      // Search query filtering
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = res.title.toLowerCase().includes(q);
        const matchSubName = subject.name.toLowerCase().includes(q);
        const matchTags = res.tags?.some((t) => t.toLowerCase().includes(q));
        const matchYear = res.academicYear?.toLowerCase().includes(q) || res.examYear?.toLowerCase().includes(q);
        if (!matchTitle && !matchSubName && !matchTags && !matchYear) return false;
      }

      return true;
    });
  }, [resources, subjects, selectedSemester, selectedSubjectId, examType, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 🏷️ HEADER SECTION                                                        */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold">
          <FileQuestion className="w-4 h-4 text-[#34D399]" />
          <span>Previous Year Questions • Solved Papers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
          Previous Year Questions (PYQs)
        </h1>
        <p className="text-sm text-[#86998A] max-w-2xl leading-relaxed">
          Access past university Mid-Semester (MSE) and End-Semester (ESE) examination question papers, marking schemes, and verified model answer solutions.
        </p>
      </div>

      {/* ========================================================================= */}
      {/* 📦 STEP 1: EXAM TYPE BOXES (MSE vs ESE)                                    */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#86998A] flex items-center space-x-2">
          <span>Step 1: Select Exam Pattern</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* MSE Box */}
          <button
            onClick={() => setExamType('MSE')}
            className={`p-5 sm:p-6 rounded-3xl border text-left transition-all duration-200 relative overflow-hidden flex items-center justify-between group cursor-pointer ${
              examType === 'MSE'
                ? 'bg-[#10B981]/15 border-[#10B981] shadow-xl shadow-emerald-950/30'
                : 'bg-[#0F1410]/80 border-[#1C271E] hover:border-[#34D399]/50 hover:bg-[#131A14]'
            }`}
          >
            <div className="space-y-1.5 z-10">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black text-[#F0FDF4]">MSE</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30">
                  Mid-Sem Exam
                </span>
              </div>
              <p className="text-xs text-[#86998A]">
                Internal Assessment & In-Semester Examination Papers (30 Marks)
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                examType === 'MSE'
                  ? 'bg-[#10B981] text-black font-bold shadow-md'
                  : 'bg-[#151D17] text-[#86998A] group-hover:text-[#34D399]'
              }`}
            >
              {examType === 'MSE' ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </button>

          {/* ESE Box */}
          <button
            onClick={() => setExamType('ESE')}
            className={`p-5 sm:p-6 rounded-3xl border text-left transition-all duration-200 relative overflow-hidden flex items-center justify-between group cursor-pointer ${
              examType === 'ESE'
                ? 'bg-[#10B981]/15 border-[#10B981] shadow-xl shadow-emerald-950/30'
                : 'bg-[#0F1410]/80 border-[#1C271E] hover:border-[#34D399]/50 hover:bg-[#131A14]'
            }`}
          >
            <div className="space-y-1.5 z-10">
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-black text-[#F0FDF4]">ESE</span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30">
                  End-Sem Exam
                </span>
              </div>
              <p className="text-xs text-[#86998A]">
                Final University Autonomous End-Semester Question Papers (60/100 Marks)
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
                examType === 'ESE'
                  ? 'bg-[#10B981] text-black font-bold shadow-md'
                  : 'bg-[#151D17] text-[#86998A] group-hover:text-[#34D399]'
              }`}
            >
              {examType === 'ESE' ? <CheckCircle2 className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🎓 STEP 2: YEAR LEVEL BOXES (FY vs SY)                                     */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#86998A] flex items-center space-x-2">
          <span>Step 2: Select Academic Year</span>
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
              <p className="text-xs text-[#86998A]">Applied Sciences & Core Engineering Foundation</p>
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
              <p className="text-xs text-[#86998A]">Computer Engineering Core Disciplines & Labs</p>
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
      {/* 🗓️ STEP 3: SEMESTER BREAKDOWN BOXES                                        */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#86998A] flex items-center space-x-2">
          <span>Step 3: Select Semester</span>
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
      {/* 📚 STEP 4: SUBJECT FILTER PILLS                                           */}
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
          placeholder={`Search ${examType} question papers, years, subject codes...`}
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
      {/* 📄 PYQ PAPERS LIST                                                        */}
      {/* ========================================================================= */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between text-xs text-[#86998A]">
          <span>
            Showing <strong className="text-[#34D399]">{pyqResources.length}</strong> {examType} papers for{' '}
            <strong>
              {yearLevel} • Semester {selectedSemester}
            </strong>
          </span>
        </div>

        {pyqResources.length > 0 ? (
          <div className="space-y-3">
            {pyqResources.map((res) => {
              const sub = subjects.find((s) => s.id === res.subjectId);
              return (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  siblingResources={pyqResources}
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
              <FileQuestion className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-[#F0FDF4] text-lg">No {examType} Papers Found</h3>
              <p className="text-xs text-[#86998A] leading-relaxed">
                {yearLevel === 'SY'
                  ? 'Second Year papers are currently being archived and verified for upload.'
                  : `No ${examType} question papers matched your current filters. Try changing semester or search terms.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
