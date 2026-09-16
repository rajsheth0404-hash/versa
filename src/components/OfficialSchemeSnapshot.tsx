'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Download, FileText, CheckCircle2 } from 'lucide-react';

interface OfficialSchemeSnapshotProps {
  semester: 1 | 2;
}

export default function OfficialSchemeSnapshot({ semester }: OfficialSchemeSnapshotProps) {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.15, 1.6));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.15, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  return (
    <div className="space-y-3">
      {/* Action Toolbar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-[#1E293B] border border-slate-700/80 text-xs">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
          <span className="font-semibold text-[#F8FAFC]">
            Official R-2025 PDF Document Snapshot (Page {semester === 1 ? '8' : '9'})
          </span>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg bg-[#0F172A] text-slate-300 hover:text-white border border-slate-700 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 rounded bg-[#0F172A] font-mono text-[11px] text-[#38BDF8] border border-slate-700">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg bg-[#0F172A] text-slate-300 hover:text-white border border-slate-700 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2.5 py-1 rounded-lg bg-[#0F172A] text-slate-300 hover:text-white text-[10px] font-semibold border border-slate-700 transition"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Official PDF Document Card Snapshot */}
      <div className="overflow-x-auto rounded-2xl border border-slate-700/80 bg-[#0F172A] p-2 flex justify-center shadow-2xl">
        <div
          style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
          className="transition-transform duration-200 w-full max-w-[780px] bg-white text-slate-900 p-8 sm:p-10 rounded-xl shadow-2xl font-serif text-[11px] leading-relaxed my-2"
        >
          {/* Document Header */}
          <div className="text-center space-y-1 pb-4 border-b-2 border-slate-800">
            <p className="font-semibold text-slate-800 text-xs tracking-wide">First Year Engineering Curriculum</p>
            <p className="font-bold text-slate-900 text-sm">Autonomous School of Engineering</p>
            <div className="pt-2 text-[10px] text-slate-600 font-mono font-medium">
              SVU-KJSSE R-2025_3.0 • FY B Tech (Common to All) • BOS and FOET dated 07-07-2025
            </div>
            <h2 className="font-extrabold text-base text-slate-900 pt-1 tracking-tight">
              FY B Tech (Common to All) — SVU R-2025 Version 3.0
            </h2>
            <h3 className="font-bold text-sm text-[#0284C7] uppercase tracking-wider">
              {semester === 1 ? 'SEM I' : 'SEM II'} Teaching and Credit Scheme
            </h3>
          </div>

          {/* Section 1: Teaching & Credit Scheme Table */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-900">
              <span className="uppercase tracking-wide text-xs">1. Teaching and Credit Scheme</span>
            </div>

            <div className="border border-slate-800 overflow-hidden">
              <table className="w-full text-center border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-800">
                    <th className="border-r border-slate-800 p-1.5 w-[14%]">Course Code</th>
                    <th className="border-r border-slate-800 p-1.5 w-[8%]">Category</th>
                    <th className="border-r border-slate-800 p-1.5 text-left pl-2 w-[42%]">Name of the Course</th>
                    <th className="border-r border-slate-800 p-1.5 w-[14%]">Teaching TH-PR-TUT</th>
                    <th className="border-r border-slate-800 p-1.5 w-[8%]">Total (hrs.)</th>
                    <th className="border-r border-slate-800 p-1.5 w-[14%]">Credit TH-PR-TUT</th>
                    <th className="p-1.5 w-[10%]">Total Credits</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {semester === 1 ? (
                    <>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C101</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Applied Mathematics – I</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3 – 0 – 1</td>
                        <td className="border-r border-slate-800 p-1 font-mono">4</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">3 – 0 – 1</td>
                        <td className="p-1 font-mono font-bold text-slate-950">4</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C102</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Engineering Physics</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">2</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C103</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Engineering Chemistry</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">2</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C104</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Basic Electrical Engineering</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">2</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C105</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Engineering Drawing</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 0 – 1</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 0 – 1</td>
                        <td className="p-1 font-mono font-bold text-slate-950">3</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C106</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Biology for Engineers</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">2</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C107</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Structured Programming Methodology</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">4</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">3</td>
                      </tr>
                      <tr className="bg-slate-50/60 text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L101</td>
                        <td className="border-r border-slate-800 p-1">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Applied Science Laboratory</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L102</td>
                        <td className="border-r border-slate-800 p-1">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Basic Electrical Engineering Laboratory</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="bg-slate-50/60 text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L103</td>
                        <td className="border-r border-slate-800 p-1">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Engineering Drawing Laboratory</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L104</td>
                        <td className="border-r border-slate-800 p-1">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Maker Space Laboratory – I</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="bg-slate-200 font-bold border-t-2 border-slate-800">
                        <td colSpan={3} className="border-r border-slate-800 p-1.5 text-right pr-3 uppercase">Total</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">15 – 10 – 2</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">27</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">15 – 5 – 2</td>
                        <td className="p-1.5 font-mono text-sm font-black text-[#0284C7]">22</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C201</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Applied Mathematics – II</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3 – 0 – 1</td>
                        <td className="border-r border-slate-800 p-1 font-mono">4</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">3 – 0 – 1</td>
                        <td className="p-1 font-mono font-bold text-slate-950">4</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06E211</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Applied Science for Computer & Allied Programs</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">3 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">3</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C203</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Digital Logic Design</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">3</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">3 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">3</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C204</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">HSS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Environmental Science</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 0 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 0 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">2</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C205</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Object-Oriented Programming Methodology</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">4</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">2 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold text-slate-950">3</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06T201</td>
                        <td className="border-r border-slate-800 p-1 font-semibold">HSS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2 font-semibold">Presentation and Communication Skills</td>
                        <td className="border-r border-slate-800 p-1 font-mono">1 – 0 – 1</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-semibold">1 – 0 – 1</td>
                        <td className="p-1 font-mono font-bold text-slate-950">2</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L201</td>
                        <td className="border-r border-slate-800 p-1">BS</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Applied Science Laboratory - II</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="bg-slate-50/60 text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L202</td>
                        <td className="border-r border-slate-800 p-1">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Digital Logic Design Laboratory</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="text-slate-600">
                        <td className="border-r border-slate-800 p-1 font-mono">316U06L203</td>
                        <td className="border-r border-slate-800 p-1">ES</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Maker Space Laboratory – II</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 2 – 0</td>
                        <td className="border-r border-slate-800 p-1 font-mono">2+1#</td>
                        <td className="border-r border-slate-800 p-1 font-mono">0 – 1 – 0</td>
                        <td className="p-1 font-mono font-bold">1</td>
                      </tr>
                      <tr className="bg-slate-200 font-bold border-t-2 border-slate-800">
                        <td colSpan={3} className="border-r border-slate-800 p-1.5 text-right pr-3 uppercase">Total</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">14 – 8 – 2</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">24+1#</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">14 – 4 – 2</td>
                        <td className="p-1.5 font-mono text-sm font-black text-[#0284C7]">20</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footnotes */}
            <div className="pt-2 text-[9px] text-slate-600 space-y-0.5 italic">
              {semester === 2 && (
                <>
                  <p>@ class-wise tutorial</p>
                  <p># Additional 1 hr/division/week is assigned for project review of PBL component (only for timetable slot. No separate course credit is given)</p>
                </>
              )}
            </div>
          </div>

          {/* Section 2: Examination Scheme Table */}
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-900">
              <span className="uppercase tracking-wide text-xs">2. Examination Scheme</span>
            </div>

            <div className="border border-slate-800 overflow-hidden">
              <table className="w-full text-center border-collapse text-[10px]">
                <thead>
                  <tr className="bg-slate-100 font-bold border-b border-slate-800">
                    <th className="border-r border-slate-800 p-1.5 w-[14%]">Course Code</th>
                    <th className="border-r border-slate-800 p-1.5 text-left pl-2 w-[44%]">Name of the Course</th>
                    <th className="border-r border-slate-800 p-1.5 w-[10%]">Lab/Tut CA</th>
                    <th className="border-r border-slate-800 p-1.5 w-[8%]">CA IA</th>
                    <th className="border-r border-slate-800 p-1.5 w-[8%]">CA MSE</th>
                    <th className="border-r border-slate-800 p-1.5 w-[8%]">ESE PR/OR</th>
                    <th className="border-r border-slate-800 p-1.5 w-[8%]">ESE Theory</th>
                    <th className="p-1.5 w-[10%]">Total Marks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {semester === 1 ? (
                    <>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C101</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Applied Mathematics – I</td>
                        <td className="border-r border-slate-800 p-1 font-mono">25</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">125</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C102</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Engineering Physics</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C103</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Engineering Chemistry</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C104</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Basic Electrical Engineering</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C105</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Engineering Drawing</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C106</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Biology for Engineers</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="p-1 font-mono font-bold">50</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C107</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Structured Programming Methodology</td>
                        <td className="border-r border-slate-800 p-1 font-mono">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr className="bg-slate-200 font-bold border-t-2 border-slate-800">
                        <td colSpan={2} className="border-r border-slate-800 p-1.5 text-right pr-3 uppercase">Total Marks</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">275</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">150</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">150</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">50</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">250</td>
                        <td className="p-1.5 font-mono text-sm font-black text-[#0284C7]">875</td>
                      </tr>
                    </>
                  ) : (
                    <>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C201</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Applied Mathematics – II</td>
                        <td className="border-r border-slate-800 p-1 font-mono">25</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">125</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C202</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Program-Specific Science Course</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C203</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Program-Specific Core Course</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">20</td>
                        <td className="border-r border-slate-800 p-1 font-mono">30</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C204</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Environmental Science</td>
                        <td className="border-r border-slate-800 p-1 font-mono">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06C205</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Object-Oriented Programming Methodology</td>
                        <td className="border-r border-slate-800 p-1 font-mono">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="p-1 font-mono font-bold">100</td>
                      </tr>
                      <tr className="bg-slate-50/60">
                        <td className="border-r border-slate-800 p-1 font-mono font-bold">316U06T201</td>
                        <td className="border-r border-slate-800 p-1 text-left pl-2">Presentation and Communication Skills</td>
                        <td className="border-r border-slate-800 p-1 font-mono">50</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="border-r border-slate-800 p-1 font-mono">--</td>
                        <td className="p-1 font-mono font-bold">50</td>
                      </tr>
                      <tr className="bg-slate-200 font-bold border-t-2 border-slate-800">
                        <td colSpan={2} className="border-r border-slate-800 p-1.5 text-right pr-3 uppercase">Total Marks</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">375</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">60</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">90</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">100</td>
                        <td className="border-r border-slate-800 p-1.5 font-mono">200</td>
                        <td className="p-1.5 font-mono text-sm font-black text-[#0284C7]">825</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
