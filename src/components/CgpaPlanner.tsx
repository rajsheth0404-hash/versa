'use client';

import React, { useState, useEffect } from 'react';
import { CourseGrade, CgpaRecord } from '@/lib/types';
import { HubStore } from '@/lib/store';
import { Calculator, Plus, Trash2, Award, TrendingUp, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

const SOMAIYA_GRADE_SCALE: Record<CourseGrade['grade'], number> = {
  'O': 10,
  'A+': 9,
  'A': 8,
  'B+': 7,
  'B': 6,
  'C': 5,
  'P': 4,
  'F': 0,
};

const FY_SEM1_COURSES: CourseGrade[] = [
  { courseName: 'Applied Mathematics I', courseCode: 'BSC101', credits: 4, grade: 'O', gradePoints: 10 },
  { courseName: 'Engineering Physics', courseCode: 'BSC102', credits: 3, grade: 'A+', gradePoints: 9 },
  { courseName: 'Basic Electrical & Electronics Engineering', courseCode: 'ESC101', credits: 4, grade: 'A+', gradePoints: 9 },
  { courseName: 'Structured Programming with C', courseCode: 'ESC103', credits: 3, grade: 'O', gradePoints: 10 },
  { courseName: 'Physics Laboratory', courseCode: 'BSL101', credits: 1, grade: 'O', gradePoints: 10 },
  { courseName: 'BEE Laboratory', courseCode: 'ESL101', credits: 1, grade: 'O', gradePoints: 10 },
];

const FY_SEM2_COURSES: CourseGrade[] = [
  { courseName: 'Applied Mathematics II', courseCode: 'BSC201', credits: 4, grade: 'O', gradePoints: 10 },
  { courseName: 'Engineering Chemistry', courseCode: 'BSC202', credits: 3, grade: 'A+', gradePoints: 9 },
  { courseName: 'Engineering Graphics & CAD', courseCode: 'ESC201', credits: 3, grade: 'A', gradePoints: 8 },
  { courseName: 'Object Oriented Programming with C++', courseCode: 'ESC202', credits: 3, grade: 'O', gradePoints: 10 },
  { courseName: 'Chemistry Laboratory', courseCode: 'BSL201', credits: 1, grade: 'O', gradePoints: 10 },
  { courseName: 'OOP / CAD Laboratory', courseCode: 'ESL201', credits: 1, grade: 'O', gradePoints: 10 },
];

export default function CgpaPlanner() {
  const [records, setRecords] = useState<CgpaRecord[]>([]);
  const [activeSem, setActiveSem] = useState<1 | 2>(1);

  // Current working semester courses
  const [courses, setCourses] = useState<CourseGrade[]>(FY_SEM1_COURSES);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setRecords(HubStore.getCgpaRecords());
    const handleUpdate = () => setRecords(HubStore.getCgpaRecords());
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const handleSemesterSwitch = (sem: 1 | 2) => {
    setActiveSem(sem);
    const existing = records.find((r) => r.semester === sem);
    if (existing && existing.courseBreakdown?.length > 0) {
      setCourses(existing.courseBreakdown);
    } else {
      setCourses(sem === 1 ? FY_SEM1_COURSES : FY_SEM2_COURSES);
    }
  };

  const handleGradeChange = (index: number, newGrade: CourseGrade['grade']) => {
    const updated = [...courses];
    updated[index].grade = newGrade;
    updated[index].gradePoints = SOMAIYA_GRADE_SCALE[newGrade];
    setCourses(updated);
  };

  const handleCreditsChange = (index: number, newCredits: number) => {
    const updated = [...courses];
    updated[index].credits = Math.max(1, Number(newCredits));
    setCourses(updated);
  };

  const handleCourseNameChange = (index: number, newName: string) => {
    const updated = [...courses];
    updated[index].courseName = newName;
    setCourses(updated);
  };

  const addCourseRow = () => {
    setCourses((prev) => [
      ...prev,
      {
        courseName: `Additional Course ${prev.length + 1}`,
        courseCode: `ESC${activeSem}0${prev.length + 1}`,
        credits: 3,
        grade: 'A',
        gradePoints: 8,
      },
    ]);
  };

  const removeCourseRow = (index: number) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Calculations
  const totalSemesterCredits = courses.reduce((sum, c) => sum + c.credits, 0);
  const totalWeightedPoints = courses.reduce((sum, c) => sum + c.credits * c.gradePoints, 0);
  const currentSgpa = totalSemesterCredits > 0 ? totalWeightedPoints / totalSemesterCredits : 0;

  // Cumulative CGPA calculation for First Year
  const allSemestersForCgpa = [
    ...records.filter((r) => r.semester !== activeSem),
    {
      id: `current-${activeSem}`,
      userId: 'usr-fy-student-1',
      semester: activeSem,
      sgpa: Number(currentSgpa.toFixed(2)),
      totalCredits: totalSemesterCredits,
      courseBreakdown: courses,
      updatedAt: new Date().toISOString(),
    },
  ].sort((a, b) => a.semester - b.semester);

  const totalOverallCredits = allSemestersForCgpa.reduce((sum, r) => sum + r.totalCredits, 0);
  const totalOverallPoints = allSemestersForCgpa.reduce((sum, r) => sum + r.sgpa * r.totalCredits, 0);
  const cumulativeCgpa = totalOverallCredits > 0 ? totalOverallPoints / totalOverallCredits : currentSgpa;

  const saveCurrentSemester = () => {
    HubStore.saveCgpaRecord({
      id: `cgpa-sem${activeSem}`,
      userId: 'usr-fy-student-1',
      semester: activeSem,
      sgpa: Number(currentSgpa.toFixed(2)),
      totalCredits: totalSemesterCredits,
      courseBreakdown: courses,
      updatedAt: new Date().toISOString(),
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);

    if (currentSgpa >= 9.0) {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#A3E635', '#F59E0B'],
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Semester SGPA */}
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] flex flex-col justify-between shadow-xl hover:border-[#2B3C2E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86998A]">
              Semester {activeSem} SGPA
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-black font-bold text-xs">
              Sem {activeSem}
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-[#34D399] tracking-tight">
                {currentSgpa.toFixed(2)}
              </span>
              <span className="text-xs text-[#86998A] font-medium">/ 10.00 Scale</span>
            </div>
            <p className="text-xs text-[#86998A] mt-1">
              Total Credits: {totalSemesterCredits} • Points: {totalWeightedPoints}
            </p>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-[#86998A] pt-2 border-t border-[#1C271E]">
            <Sparkles className="w-3.5 h-3.5 text-[#34D399]" />
            <span>KJSCE SVU 2025 Standard</span>
          </div>
        </div>

        {/* Target Cumulative CGPA */}
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] flex flex-col justify-between shadow-xl hover:border-[#2B3C2E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86998A]">
              First Year Cumulative CGPA
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#A3E635]/15 text-[#A3E635] border border-[#A3E635]/30 flex items-center justify-center font-bold text-xs">
              FY
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-extrabold text-[#A3E635] tracking-tight">
                {cumulativeCgpa.toFixed(2)}
              </span>
              <span className="text-xs text-[#86998A] font-medium">/ 10.00</span>
            </div>
            <p className="text-xs text-[#86998A] mt-1">
              Across Sem 1 & Sem 2 ({totalOverallCredits} Credits)
            </p>
          </div>

          <div className="flex items-center space-x-1.5 text-xs text-[#86998A] pt-2 border-t border-[#1C271E]">
            <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
            <span>First Class with Distinction (Target: 8.5+)</span>
          </div>
        </div>

        {/* Semester Selector & Quick Save */}
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] flex flex-col justify-between shadow-xl hover:border-[#2B3C2E] transition-all">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86998A]">
              First Year Semester
            </span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleSemesterSwitch(1)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                  activeSem === 1
                    ? 'bg-[#10B981] text-black font-bold shadow-md shadow-[#10B981]/20'
                    : 'bg-[#080A08] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E]'
                }`}
              >
                Semester 1
              </button>
              <button
                onClick={() => handleSemesterSwitch(2)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold transition ${
                  activeSem === 2
                    ? 'bg-[#10B981] text-black font-bold shadow-md shadow-[#10B981]/20'
                    : 'bg-[#080A08] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E]'
                }`}
              >
                Semester 2
              </button>
            </div>
          </div>

          <button
            onClick={saveCurrentSemester}
            className="w-full mt-3 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold shadow-lg shadow-[#10B981]/20 transition"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-black" /> : <Award className="w-4 h-4 text-black" />}
            <span>{savedSuccess ? 'Saved to Profile!' : `Save Sem ${activeSem} SGPA`}</span>
          </button>
        </div>
      </div>

      {/* Grade Points Reference Table & Course Breakdown */}
      <div className="bg-[#0F1410]/80 backdrop-blur-md rounded-3xl border border-[#1C271E] overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#080A08]/80 border-b border-[#1C271E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-[#F0FDF4] text-base">
              Semester {activeSem} Course Grade Point Allocation
            </h3>
            <p className="text-xs text-[#86998A] mt-0.5">
              Select expected grades to calculate precise SGPA based on official SVU 2025 revision scheme.
            </p>
          </div>

          <button
            onClick={addCourseRow}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 hover:bg-[#10B981]/25 text-xs font-bold transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Courses Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080A08]/90 text-[#86998A] font-semibold border-b border-[#1C271E]">
              <tr>
                <th className="p-4 pl-6">Course Name</th>
                <th className="p-4">Code</th>
                <th className="p-4">Credits</th>
                <th className="p-4">Grade (O, A+, A...)</th>
                <th className="p-4">Points</th>
                <th className="p-4">Weighted Points</th>
                <th className="p-4 pr-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C271E] text-[#86998A]">
              {courses.map((course, idx) => (
                <tr key={idx} className="hover:bg-[#151D17]/60 transition">
                  <td className="p-4 pl-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={course.courseName}
                        onChange={(e) => handleCourseNameChange(idx, e.target.value)}
                        className="bg-[#080A08] border border-[#1C271E] rounded-lg px-2.5 py-1 text-[#F0FDF4] font-medium w-full focus:outline-none focus:border-[#10B981]"
                        placeholder="Subject Name"
                      />
                    </div>
                  </td>
                  <td className="p-4 text-[#86998A] font-mono text-[11px]">
                    <input
                      type="text"
                      value={course.courseCode}
                      onChange={(e) => {
                        const next = [...courses];
                        next[idx].courseCode = e.target.value;
                        setCourses(next);
                      }}
                      className="bg-[#080A08] border border-[#1C271E] rounded-lg px-2 py-1 text-[#F0FDF4] font-mono w-24 focus:outline-none focus:border-[#10B981]"
                      placeholder="CODE"
                    />
                  </td>
                  <td className="p-4">
                    <select
                      value={course.credits}
                      onChange={(e) => handleCreditsChange(idx, Number(e.target.value))}
                      className="bg-[#080A08] border border-[#1C271E] rounded-lg px-2.5 py-1 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                    >
                      {[1, 2, 3, 4, 5].map((c) => (
                        <option key={c} value={c}>
                          {c} Credits
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4">
                    <select
                      value={course.grade}
                      onChange={(e) => handleGradeChange(idx, e.target.value as CourseGrade['grade'])}
                      className="bg-[#080A08] border border-[#1C271E] rounded-lg px-3 py-1 font-bold text-[#A3E635] focus:outline-none focus:border-[#10B981]"
                    >
                      {Object.keys(SOMAIYA_GRADE_SCALE).map((g) => (
                        <option key={g} value={g}>
                          {g} (GP: {SOMAIYA_GRADE_SCALE[g as CourseGrade['grade']]})
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-4 font-mono font-semibold text-[#F0FDF4]">{course.gradePoints}</td>
                  <td className="p-4 font-mono font-bold text-[#34D399]">
                    {course.credits * course.gradePoints}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button
                      onClick={() => removeCourseRow(idx)}
                      className="p-1.5 rounded-lg text-[#86998A] hover:text-rose-400 hover:bg-rose-950/30 transition"
                      title="Remove Row"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Summary */}
        <div className="p-6 bg-[#080A08]/60 border-t border-[#1C271E] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-4 text-[#86998A]">
            <span>
              Total Credits: <strong className="text-[#F0FDF4]">{totalSemesterCredits}</strong>
            </span>
            <span>•</span>
            <span>
              Weighted Points: <strong className="text-[#F0FDF4]">{totalWeightedPoints}</strong>
            </span>
            <span>•</span>
            <span>
              Calculated SGPA: <strong className="text-[#A3E635] font-bold">{currentSgpa.toFixed(2)}</strong>
            </span>
          </div>

          <div className="text-[#86998A] text-[11px]">
            Formula: <code>SGPA = Σ(Credits × GradePoints) / Σ(Credits)</code>
          </div>
        </div>
      </div>
    </div>
  );
}
