'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  CalendarCheck,
  Clock,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  FileCode2,
  Sparkles,
  Link2,
  ShieldCheck,
  Laptop,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import confetti from 'canvas-confetti';

interface PendingExperiment {
  id: string;
  courseName: string;
  courseCode: string;
  title: string;
  dueDate: string;
  dueDaysRemaining: number;
  status: 'pending' | 'submitted' | 'graded';
  classroomLink: string;
}

interface LmsTutorialSchedule {
  id: string;
  courseName: string;
  courseCode: string;
  title: string;
  type: 'tutorial' | 'quiz' | 'submission';
  scheduledTime: string;
  lmsUrl: string;
}

export default function SomaiyaAcademicSync() {
  const [studentEmail, setStudentEmail] = useState('student.fy@somaiya.edu');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [syncSuccess, setSyncSuccess] = useState(false);

  // Google Classroom Pending Experiments
  const [pendingExps, setPendingExps] = useState<PendingExperiment[]>([
    {
      id: 'exp-1',
      courseName: 'Structured Programming Methodology',
      courseCode: '316U06C107',
      title: 'Exp 4: Pointers, Dynamic Memory Allocation & Struct Arrays in C',
      dueDate: 'Due in 2 days (11:59 PM)',
      dueDaysRemaining: 2,
      status: 'pending',
      classroomLink: 'https://classroom.google.com',
    },
    {
      id: 'exp-2',
      courseName: 'Engineering Physics',
      courseCode: '316U06C102',
      title: 'Exp 3: Determination of Wavelength using Newton’s Rings & Interference',
      dueDate: 'Due Tomorrow (5:00 PM)',
      dueDaysRemaining: 1,
      status: 'pending',
      classroomLink: 'https://classroom.google.com',
    },
    {
      id: 'exp-3',
      courseName: 'Basic Electrical Engineering',
      courseCode: '316U06C104',
      title: 'Exp 4: Verification of Thevenin’s & Maximum Power Transfer Theorems',
      dueDate: 'Due in 5 days',
      dueDaysRemaining: 5,
      status: 'pending',
      classroomLink: 'https://classroom.google.com',
    },
    {
      id: 'exp-4',
      courseName: 'Engineering Chemistry',
      courseCode: '316U06C103',
      title: 'Exp 2: EDTA Complexometric Titration for Water Hardness Determination',
      dueDate: 'Submitted & Graded',
      dueDaysRemaining: 0,
      status: 'submitted',
      classroomLink: 'https://classroom.google.com',
    },
  ]);

  // KJSCE LMS Upcoming Tutorials & Future Schedule
  const [lmsSchedule, setLmsSchedule] = useState<LmsTutorialSchedule[]>([
    {
      id: 'lms-1',
      courseName: 'Applied Mathematics – I',
      courseCode: '316U06C101',
      title: 'Tutorial 3: Partial Differentiation, Maxima-Minima & Euler Homogeneous Theorem',
      type: 'tutorial',
      scheduledTime: 'Upcoming Thursday, 10:30 AM – 11:30 AM',
      lmsUrl: 'https://lms-kjsce.somaiya.edu/?redirect=0',
    },
    {
      id: 'lms-2',
      courseName: 'Engineering Drawing',
      courseCode: '316U06C105',
      title: 'Sheet 4 Submission: First Angle Orthographic Projections of Machine Solids',
      type: 'submission',
      scheduledTime: 'Deadline: Friday, 11:59 PM',
      lmsUrl: 'https://lms-kjsce.somaiya.edu/?redirect=0',
    },
    {
      id: 'lms-3',
      courseName: 'Biology for Engineers',
      courseCode: '316U06C106',
      title: 'Continuous Assessment Quiz 1: Biomolecules, Enzymes & Biosensor Principles',
      type: 'quiz',
      scheduledTime: 'Active on LMS (Closes this Saturday)',
      lmsUrl: 'https://lms-kjsce.somaiya.edu/?redirect=0',
    },
    {
      id: 'lms-4',
      courseName: 'Structured Programming Methodology',
      courseCode: '316U06C107',
      title: 'Weekly Coding Challenge: String Processing without Library Functions',
      type: 'submission',
      scheduledTime: 'Upcoming Sunday, 8:00 PM',
      lmsUrl: 'https://lms-kjsce.somaiya.edu/?redirect=0',
    },
  ]);

  const handleSyncSomaiyaData = () => {
    setIsSyncing(true);
    setSyncSuccess(false);

    setTimeout(() => {
      // Simulate live sync from Somaiya App / MySomaiya
      HubStore.saveAttendanceCourse({
        id: 'att-1',
        userId: 'usr-fy-student-1',
        subjectName: 'Applied Mathematics – I',
        subjectCode: '316U06C101',
        totalConducted: 28,
        totalAttended: 24,
        targetPercentage: 75,
      });

      HubStore.saveAttendanceCourse({
        id: 'att-2',
        userId: 'usr-fy-student-1',
        subjectName: 'Engineering Physics',
        subjectCode: '316U06C102',
        totalConducted: 26,
        totalAttended: 21,
        targetPercentage: 75,
      });

      HubStore.saveAttendanceCourse({
        id: 'att-3',
        userId: 'usr-fy-student-1',
        subjectName: 'Engineering Chemistry',
        subjectCode: '316U06C103',
        totalConducted: 22,
        totalAttended: 19,
        targetPercentage: 75,
      });

      HubStore.saveAttendanceCourse({
        id: 'att-4',
        userId: 'usr-fy-student-1',
        subjectName: 'Basic Electrical Engineering',
        subjectCode: '316U06C104',
        totalConducted: 30,
        totalAttended: 26,
        targetPercentage: 75,
      });

      HubStore.saveAttendanceCourse({
        id: 'att-5',
        userId: 'usr-fy-student-1',
        subjectName: 'Engineering Drawing',
        subjectCode: '316U06C105',
        totalConducted: 24,
        totalAttended: 20,
        targetPercentage: 75,
      });

      HubStore.saveAttendanceCourse({
        id: 'att-6',
        userId: 'usr-fy-student-1',
        subjectName: 'Biology for Engineers',
        subjectCode: '316U06C106',
        totalConducted: 22,
        totalAttended: 18,
        targetPercentage: 75,
      });

      HubStore.saveAttendanceCourse({
        id: 'att-7',
        userId: 'usr-fy-student-1',
        subjectName: 'Structured Programming Methodology',
        subjectCode: '316U06C107',
        totalConducted: 28,
        totalAttended: 24,
        targetPercentage: 75,
      });

      setIsSyncing(false);
      setSyncSuccess(true);
      setLastSyncedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#818CF8', '#10B981'],
      });
    }, 900);
  };

  return (
    <div className="space-y-6">
      {/* Account Integration & Portal Sync Banner */}
      <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700/80 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-slate-950 shadow-lg shadow-cyan-950/40 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
                  Somaiya Student Account Active
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>@somaiya.edu Authenticated</span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-[#F8FAFC] mt-1">
                Connected Student: <span className="font-mono text-slate-200">{studentEmail}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Automatically connects to <strong>Somaiya App</strong>, <strong>Google Classroom</strong>, and <strong>KJSCE LMS</strong> to pull live subject attendance, pending lab experiments, and upcoming tutorial schedules.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={handleSyncSomaiyaData}
              disabled={isSyncing}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40 transition disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Fetching from Somaiya App...' : 'Sync Somaiya App & LMS'}</span>
            </button>
          </div>
        </div>

        {syncSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Synced with <strong>MySomaiya SVU App</strong> at {lastSyncedTime}. All 7 subject attendances are up to date!
              </span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-mono">Status: 200 OK</span>
          </div>
        )}
      </div>

      {/* 2-Column Grid: Google Classroom Pending Experiments + KJSCE LMS Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Google Classroom Pending Experiments */}
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Laptop className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#F8FAFC] text-sm">Google Classroom Experiments</h3>
                <p className="text-[10px] text-slate-400">Pending submissions & lab write-ups</p>
              </div>
            </div>

            <a
              href="https://classroom.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[11px] text-[#38BDF8] hover:underline font-semibold"
            >
              <span>Open Classroom</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2.5">
            {pendingExps.map((exp) => (
              <div
                key={exp.id}
                className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-700/70 hover:border-[#38BDF8]/40 transition flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-[#38BDF8] font-bold border border-slate-700">
                      {exp.courseCode}
                    </span>
                    <span className="text-slate-400 text-[11px]">{exp.courseName}</span>
                  </div>
                  <h4 className="font-semibold text-[#F8FAFC] text-xs">{exp.title}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-0.5">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span className={exp.dueDaysRemaining <= 2 ? 'text-amber-300 font-semibold' : 'text-slate-400'}>
                      {exp.dueDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      exp.status === 'submitted'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : exp.dueDaysRemaining <= 1
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {exp.status === 'submitted' ? 'Turned In' : 'Pending'}
                  </span>
                  <a
                    href={exp.classroomLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-slate-400 hover:text-white flex items-center space-x-0.5"
                  >
                    <span>Submit</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: KJSCE LMS Portal Integration */}
        <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700/80 space-y-4 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700/80">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#818CF8]/20 text-[#818CF8] flex items-center justify-center">
                <Link2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#F8FAFC] text-sm">KJSCE LMS Timeline & Tutorials</h3>
                <p className="text-[10px] text-slate-400">Tutorial schedule & quiz drops</p>
              </div>
            </div>

            <a
              href="https://lms-kjsce.somaiya.edu/?redirect=0"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-[11px] text-[#818CF8] hover:underline font-semibold"
            >
              <span>lms-kjsce.somaiya.edu</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="space-y-2.5">
            {lmsSchedule.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-2xl bg-[#0F172A] border border-slate-700/70 hover:border-[#818CF8]/40 transition flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-[#818CF8] font-bold border border-slate-700">
                      {item.courseCode}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        item.type === 'tutorial'
                          ? 'bg-blue-500/20 text-blue-300'
                          : item.type === 'quiz'
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.type}
                    </span>
                    <span className="text-slate-400 text-[11px] truncate max-w-[140px]">
                      {item.courseName}
                    </span>
                  </div>
                  <h4 className="font-semibold text-[#F8FAFC] text-xs">{item.title}</h4>
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-0.5">
                    <Clock className="w-3 h-3 text-[#818CF8]" />
                    <span className="text-[#818CF8]">{item.scheduledTime}</span>
                  </div>
                </div>

                <a
                  href={item.lmsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1.5 rounded-xl bg-[#1E293B] hover:bg-slate-700 text-slate-200 text-[10px] font-semibold flex items-center space-x-1 flex-shrink-0 border border-slate-700 transition"
                >
                  <span>LMS</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
