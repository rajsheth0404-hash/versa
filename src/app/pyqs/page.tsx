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
  ArrowLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  FileText,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject, AcademicResource, UserProfile } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';

type ExamType = 'MSE' | 'ESE';
type YearLevel = 'FY' | 'SY';
type Step = 'exam' | 'year' | 'content';

export default function PyqsPage() {
  const [step, setStep] = useState<Step>('exam');
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

  // Step Transitions
  const handleSelectExam = (type: ExamType) => {
    setExamType(type);
    setStep('year');
  };

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
        const isMse =
          res.examType === 'mid_sem' ||
          res.examType === 'in_sem' ||
          titleLower.includes('mse') ||
          titleLower.includes('in-sem') ||
          titleLower.includes('mid-sem') ||
          titleLower.includes('test') ||
          tagsStr.includes('mse') ||
          tagsStr.includes('in-sem');

        const isExplicitEse =
          res.examType === 'end_sem' ||
          titleLower.includes('ese') ||
          titleLower.includes('end-sem') ||
          tagsStr.includes('ese');

        if (!isMse && isExplicitEse) return false;
      } else {
        const isExplicitMse =
          res.examType === 'mid_sem' ||
          res.examType === 'in_sem' ||
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
        const matchYear =
          res.academicYear?.toLowerCase().includes(q) || res.examYear?.toLowerCase().includes(q);
        if (!matchTitle && !matchSubName && !matchTags && !matchYear) return false;
      }

      return true;
    });
  }, [resources, subjects, selectedSemester, selectedSubjectId, examType, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      {/* ========================================================================= */}
      {/* 🧭 BREADCRUMBS & NAVIGATION BAR                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C271E] pb-4">
        <div className="flex items-center space-x-2 text-xs font-semibold">
          <button
            onClick={() => setStep('exam')}
            className={`hover:text-[#34D399] transition ${
              step === 'exam' ? 'text-[#34D399] font-bold' : 'text-[#86998A]'
            }`}
          >
            PYQs
          </button>

          {step !== 'exam' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#627766]" />
              <button
                onClick={() => setStep('year')}
                className={`hover:text-[#34D399] transition ${
                  step === 'year' ? 'text-[#34D399] font-bold' : 'text-[#86998A]'
                }`}
              >
                {examType === 'MSE' ? 'Mid-Sem Exam (MSE)' : 'End-Sem Exam (ESE)'}
              </button>
            </>
          )}

          {step === 'content' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#627766]" />
              <span className="text-[#F0FDF4] font-bold">
                {yearLevel} • Semester {selectedSemester}
              </span>
            </>
          )}
        </div>

        {step !== 'exam' && (
          <button
            onClick={() => {
              if (step === 'content') setStep('year');
              else if (step === 'year') setStep('exam');
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#0F1410] hover:bg-[#151D17] border border-[#1C271E] text-xs font-semibold text-[#86998A] hover:text-[#F0FDF4] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 📄 VIEW 1: EXAM TYPE SELECTION (MSE vs ESE)                               */}
      {/* ========================================================================= */}
      {step === 'exam' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold">
              <FileQuestion className="w-4 h-4 text-[#34D399]" />
              <span>Previous Year Questions • Step 1</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
              Select Exam Pattern
            </h1>
            <p className="text-sm text-[#86998A] max-w-2xl leading-relaxed">
              Choose whether you want to browse Mid-Semester Exam (MSE) papers or University End-Semester Exam (ESE) question papers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            {/* MSE Box */}
            <div
              onClick={() => handleSelectExam('MSE')}
              className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-[#10B981] rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10B981]/20 transition-all" />

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
                  <FileText className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-black text-[#F0FDF4] group-hover:text-[#34D399] transition">
                      MSE
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30">
                      30 Marks
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F0FDF4] mb-1">Mid-Semester Examinations</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    Internal assessments, 30-mark mid-term tests, unit-wise question banks, and marking schemes.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
                <span>Browse MSE Question Papers</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>

            {/* ESE Box */}
            <div
              onClick={() => handleSelectExam('ESE')}
              className="group bg-[#0F1410]/90 hover:bg-[#131A14] border border-[#1C271E] hover:border-[#10B981] rounded-3xl p-8 flex flex-col justify-between shadow-2xl transition-all duration-200 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md cursor-pointer min-h-[220px]"
            >
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#10B981]/10 rounded-full blur-2xl pointer-events-none group-hover:bg-[#10B981]/20 transition-all" />

              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] group-hover:scale-105 transition-transform">
                  <GraduationCap className="w-7 h-7" />
                </div>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xl font-black text-[#F0FDF4] group-hover:text-[#34D399] transition">
                      ESE
                    </span>
                    <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#34D399] font-bold border border-[#10B981]/30">
                      60 / 100 Marks
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#F0FDF4] mb-1">End-Semester Examinations</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    Final autonomous university examination papers, model answer papers, and past session papers.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
                <span>Browse ESE Question Papers</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🎓 VIEW 2: YEAR SELECTION (FY vs SY)                                      */}
      {/* ========================================================================= */}
      {step === 'year' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#34D399] text-xs font-semibold">
              <span className="font-bold">{examType}</span>
              <span>• Step 2: Select Academic Year</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F0FDF4] tracking-tight">
              Select Academic Year for {examType}
            </h1>
            <p className="text-sm text-[#86998A] max-w-2xl leading-relaxed">
              Choose your engineering academic year to browse Semester-wise question papers.
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
                  <h3 className="text-base font-bold text-[#F0FDF4] mb-1">Common Engineering Foundation</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    Applied Mathematics I & II, Engineering Physics, Chemistry, BEE, Drawing, and Programming.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
                <span>Explore FY {examType} Papers</span>
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
                  <Layers className="w-7 h-7" />
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
                  <h3 className="text-base font-bold text-[#F0FDF4] mb-1">Computer Engineering Core</h3>
                  <p className="text-xs text-[#86998A] leading-relaxed">
                    Data Structures, Discrete Math, Computer Architecture, OS, DBMS, Networks, and Theory of Computation.
                  </p>
                </div>
              </div>

              <div className="pt-6 mt-4 border-t border-[#1C271E] flex items-center justify-between text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-transform">
                <span>Explore SY {examType} Papers</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📚 VIEW 3: SEMESTERS, SUBJECTS & PAPERS LIST                              */}
      {/* ========================================================================= */}
      {step === 'content' && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-xs font-bold">
              <span>
                {examType} • {yearLevel} (Semester {selectedSemester})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight">
              {examType} Question Papers — {yearLevel}
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
              placeholder={`Search ${examType} question papers, session years, topics...`}
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

          {/* Papers List */}
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
                      ? 'Second Year examination papers are currently being compiled for upload.'
                      : `No ${examType} question papers matched your current filters. Try changing semester or search terms.`}
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
