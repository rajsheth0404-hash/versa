'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FolderTree,
  UploadCloud,
  FileCode2,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: 'Admin Overview', href: '/admin', icon: LayoutDashboard, exact: true },
    { name: 'Curriculum Hierarchy', href: '/admin/hierarchy', icon: FolderTree },
    { name: 'Resource Ingestion', href: '/admin/upload', icon: UploadCloud },
    { name: 'Video Lectures', href: '/youtube', icon: Sparkles, badge: 'YouTube' },
    { name: 'AI Syllabus Parser', href: '/admin/syllabus-parser', icon: FileCode2, badge: 'Auto' },
    { name: 'AI Study Synthesizer', href: '/admin/ai-generator', icon: Sparkles, badge: 'Gemini' },
  ];

  return (
    <aside className="w-full md:w-64 glass-panel bg-[#1E293B]/80 rounded-3xl p-4 border border-slate-800 flex flex-col justify-between space-y-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="px-2 pt-1 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#38BDF8] to-[#818CF8] flex items-center justify-center text-slate-950 font-bold shadow-sm">
              <ShieldCheck className="w-4 h-4 text-slate-950" />
            </div>
            <div>
              <h3 className="font-bold text-[#F8FAFC] text-xs uppercase tracking-wider">Admin Studio</h3>
              <p className="text-[10px] text-slate-400">First Year Portal</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-800"></div>

        {/* Navigation list */}
        <nav className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-lg shadow-cyan-950/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                      isActive ? 'bg-black/30 text-slate-950' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Back to Student Hub */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          href="/resources"
          className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-[#38BDF8] hover:bg-slate-800/60 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Student Hub</span>
        </Link>
      </div>
    </aside>
  );
}
