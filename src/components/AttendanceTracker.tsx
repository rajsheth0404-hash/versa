'use client';

import React, { useState, useEffect } from 'react';
import { AttendanceCourse } from '@/lib/types';
import { HubStore } from '@/lib/store';
import {
  CalendarCheck,
  Plus,
  Minus,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  TrendingUp,
  Percent,
  Sparkles,
  Edit2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AttendanceTracker() {
  const [courses, setCourses] = useState<AttendanceCourse[]>([]);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');
  const [newTotalConducted, setNewTotalConducted] = useState(20);
  const [newTotalAttended, setNewTotalAttended] = useState(16);

  // Edit Course Modal State
  const [editingCourse, setEditingCourse] = useState<AttendanceCourse | null>(null);

  useEffect(() => {
    setCourses(HubStore.getAttendanceCourses());
    const handleUpdate = () => setCourses(HubStore.getAttendanceCourses());
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const handleLogAttendance = (course: AttendanceCourse, attendedDelta: number, conductedDelta: number) => {
    const updatedAttended = Math.max(0, course.totalAttended + attendedDelta);
    const updatedConducted = Math.max(updatedAttended, course.totalConducted + conductedDelta);

    HubStore.saveAttendanceCourse({
      id: course.id,
      userId: course.userId,
      subjectName: course.subjectName,
      subjectCode: course.subjectCode,
      totalAttended: updatedAttended,
      totalConducted: updatedConducted,
      targetPercentage: course.targetPercentage || 75,
    });
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;

    HubStore.saveAttendanceCourse({
      userId: 'usr-student-somaiya-1',
      subjectName: newSubjectName.trim(),
      subjectCode: newSubjectCode.trim().toUpperCase() || 'NEW401',
      totalAttended: Number(newTotalAttended),
      totalConducted: Number(newTotalConducted),
      targetPercentage: 75,
    });

    setNewSubjectName('');
    setNewSubjectCode('');
    setIsAddingCourse(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    HubStore.saveAttendanceCourse({
      id: editingCourse.id,
      userId: editingCourse.userId,
      subjectName: editingCourse.subjectName.trim(),
      subjectCode: (editingCourse.subjectCode || '').trim().toUpperCase(),
      totalAttended: Number(editingCourse.totalAttended),
      totalConducted: Number(editingCourse.totalConducted),
      targetPercentage: Number(editingCourse.targetPercentage || 75),
    });

    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    HubStore.deleteAttendanceCourse(id);
  };

  // Overall Statistics Calculation
  const totalConductedAll = courses.reduce((sum, c) => sum + c.totalConducted, 0);
  const totalAttendedAll = courses.reduce((sum, c) => sum + c.totalAttended, 0);
  const aggregatePercentage = totalConductedAll > 0 ? (totalAttendedAll / totalConductedAll) * 100 : 100;

  // Bunk Math helper
  const calculateBunkStats = (attended: number, conducted: number, target: number = 75) => {
    if (conducted === 0) {
      return { percentage: 100, safeBunks: 0, needToAttend: 0, status: 'safe' };
    }

    const percentage = (attended / conducted) * 100;

    if (percentage >= target) {
      const safeBunks = Math.floor((attended - (target / 100) * conducted) / (target / 100));
      return {
        percentage,
        safeBunks: Math.max(0, safeBunks),
        needToAttend: 0,
        status: 'safe',
      };
    } else {
      const needToAttend = Math.ceil(((target / 100) * conducted - attended) / (1 - target / 100));
      return {
        percentage,
        safeBunks: 0,
        needToAttend: Math.max(0, needToAttend),
        status: 'danger',
      };
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Aggregate Percentage */}
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] relative overflow-hidden flex flex-col justify-between shadow-xl hover:border-[#2B3C2E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86998A]">
              Aggregate Attendance
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-black font-bold">
              <Percent className="w-4 h-4 text-black" />
            </span>
          </div>

          <div className="my-3">
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-4xl font-extrabold tracking-tight ${
                  aggregatePercentage >= 75 ? 'text-[#34D399]' : 'text-rose-400'
                }`}
              >
                {aggregatePercentage.toFixed(1)}%
              </span>
              <span className="text-xs text-[#86998A] font-medium">/ 75% Somaiya Rule</span>
            </div>
            <p className="text-xs text-[#86998A] mt-1">
              Total: {totalAttendedAll} attended / {totalConductedAll} conducted lectures
            </p>
          </div>

          <div className="w-full bg-[#080A08] rounded-full h-2 overflow-hidden border border-[#1C271E]">
            <div
              className={`h-full transition-all duration-500 ${
                aggregatePercentage >= 75 ? 'bg-[#10B981]' : 'bg-rose-500'
              }`}
              style={{ width: `${Math.min(100, aggregatePercentage)}%` }}
            ></div>
          </div>
        </div>

        {/* Somaiya Mandate Status */}
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] flex flex-col justify-between shadow-xl hover:border-[#2B3C2E] transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86998A]">
              Defaulter Clearance Status
            </span>
            <span className="w-8 h-8 rounded-xl bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>

          <div className="my-3">
            <p className="text-lg font-bold text-[#F0FDF4]">
              {aggregatePercentage >= 75 ? '🟢 Eligible for End-Sem Exam' : '🔴 Warning: In Defaulter Zone'}
            </p>
            <p className="text-xs text-[#86998A] mt-1">
              {aggregatePercentage >= 75
                ? 'All subject attendances satisfy KJSCE autonomous requirements.'
                : 'Attend upcoming lectures consecutively to restore eligibility.'}
            </p>
          </div>

          <div className="text-[11px] text-[#34D399] flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Official Somaiya SVU Policy</span>
          </div>
        </div>

        {/* Quick Add Subject */}
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl border border-[#1C271E] flex flex-col justify-between shadow-xl hover:border-[#2B3C2E] transition-all">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#86998A]">
              Manage Subjects
            </span>
            <h4 className="font-bold text-[#F0FDF4] text-base mt-2">Add New Course</h4>
            <p className="text-xs text-[#86998A] mt-1">
              Track lecture & tutorial attendance with real-time bunk safety limits.
            </p>
          </div>

          <button
            onClick={() => setIsAddingCourse(!isAddingCourse)}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold shadow-lg shadow-[#10B981]/20 transition"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>{isAddingCourse ? 'Cancel' : 'Add Subject to Tracker'}</span>
          </button>
        </div>
      </div>

      {/* Inline Form to Add Course */}
      {isAddingCourse && (
        <form
          onSubmit={handleAddCourse}
          className="bg-[#0F1410] p-6 rounded-3xl border border-[#10B981]/40 space-y-4 animate-in fade-in zoom-in-95 duration-150 shadow-2xl"
        >
          <h4 className="text-sm font-bold text-[#F0FDF4]">Register Subject for Attendance Tracker</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1">Subject Name *</label>
              <input
                type="text"
                placeholder="e.g. Applied Mathematics I"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
                required
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1">Course Code</label>
              <input
                type="text"
                placeholder="e.g. BSC101"
                value={newSubjectCode}
                onChange={(e) => setNewSubjectCode(e.target.value)}
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1">Conducted Lectures</label>
              <input
                type="number"
                min="0"
                value={newTotalConducted}
                onChange={(e) => setNewTotalConducted(Number(e.target.value))}
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
              />
            </div>
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1">Attended Lectures</label>
              <input
                type="number"
                min="0"
                value={newTotalAttended}
                onChange={(e) => setNewTotalAttended(Number(e.target.value))}
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCourse(false)}
              className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] text-xs font-semibold hover:bg-[#151D17] border border-[#1C271E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#10B981] text-black font-bold text-xs hover:bg-[#059669]"
            >
              Save Subject
            </button>
          </div>
        </form>
      )}

      {/* Subject Wise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {courses.map((course) => {
          const stats = calculateBunkStats(course.totalAttended, course.totalConducted, course.targetPercentage);
          const isSafe = stats.status === 'safe';

          return (
            <div
              key={course.id}
              className={`bg-[#0F1410]/80 backdrop-blur-md rounded-3xl p-6 border flex flex-col justify-between relative overflow-hidden transition-all ${
                isSafe ? 'border-[#1C271E] hover:border-[#2B3C2E]' : 'border-rose-900/60 bg-rose-950/10'
              }`}
            >
              <div>
                {/* Header with Edit and Delete Buttons */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#151D17] text-[#86998A] font-mono border border-[#1C271E]">
                      {course.subjectCode || 'COURSE'}
                    </span>
                    <h3 className="font-bold text-[#F0FDF4] text-base mt-1 leading-snug">
                      {course.subjectName}
                    </h3>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="text-[#86998A] hover:text-[#F0FDF4] p-1.5 rounded-lg hover:bg-[#151D17] transition"
                      title="Edit Subject Name & Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-[#86998A] hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-950/30 transition"
                      title="Remove Subject"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Percentage */}
                <div className="my-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span
                      className={`text-2xl font-extrabold ${
                        isSafe ? 'text-[#34D399]' : 'text-rose-400'
                      }`}
                    >
                      {stats.percentage.toFixed(1)}%
                    </span>
                    <span className="text-xs text-[#86998A]">
                      {course.totalAttended} / {course.totalConducted} Lectures
                    </span>
                  </div>

                  <div className="w-full bg-[#080A08] rounded-full h-2 overflow-hidden border border-[#1C271E]">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isSafe ? 'bg-[#10B981]' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, stats.percentage)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bunk Meter Insights */}
                <div
                  className={`p-3.5 rounded-2xl border text-xs leading-relaxed mb-4 ${
                    isSafe
                      ? 'bg-[#10B981]/10 border-[#10B981]/25 text-[#34D399]'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
                  }`}
                >
                  {isSafe ? (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                      <span>
                        You can safely bunk <strong>{stats.safeBunks}</strong> next lecture{stats.safeBunks === 1 ? '' : 's'} and stay above 75%.
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>
                        Attend next <strong>{stats.needToAttend}</strong> consecutive lecture{stats.needToAttend === 1 ? '' : 's'} to recover to 75%.
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Attendance Quick Logger Buttons */}
              <div className="pt-4 border-t border-[#1C271E] flex items-center justify-between text-xs">
                <span className="text-[#86998A] font-medium">Quick Log Today:</span>

                <div className="flex items-center space-x-2">
                  {/* Bunked lecture */}
                  <button
                    onClick={() => handleLogAttendance(course, 0, 1)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 transition"
                    title="Missed/Bunked Lecture"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Missed (+1)</span>
                  </button>

                  {/* Attended lecture */}
                  <button
                    onClick={() => handleLogAttendance(course, 1, 1)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#34D399] border border-[#10B981]/30 transition font-semibold"
                    title="Attended Lecture"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Attended (+1)</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] w-full max-w-md rounded-3xl border border-[#1C271E] shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <h3 className="font-bold text-[#F0FDF4] text-base">Update Subject Attendance</h3>
              <button onClick={() => setEditingCourse(null)} className="text-[#86998A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-[#86998A] block mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={editingCourse.subjectName}
                  onChange={(e) => setEditingCourse({ ...editingCourse, subjectName: e.target.value })}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[#86998A] block mb-1">Conducted Lectures</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCourse.totalConducted}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, totalConducted: Number(e.target.value) })
                    }
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4]"
                  />
                </div>
                <div>
                  <label className="text-[#86998A] block mb-1">Attended Lectures</label>
                  <input
                    type="number"
                    min="0"
                    value={editingCourse.totalAttended}
                    onChange={(e) =>
                      setEditingCourse({ ...editingCourse, totalAttended: Number(e.target.value) })
                    }
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] hover:text-white border border-[#1C271E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-[#10B981]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
