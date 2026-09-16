'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  Tv,
  Calculator,
  UploadCloud,
  ShieldCheck,
  Menu,
  X,
  GraduationCap,
  Edit2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { UserProfile } from '@/lib/types';
import ThemeToggle from '@/components/ThemeToggle';

const DEFAULT_TAB_NAMES: Record<string, string> = {
  '/resources': 'Notes & Materials',
  '/youtube': 'Video Lectures',
  '/calculator': 'SGPA Calculator',
  '/admin/upload': 'Upload Notes',
};

const TAB_STORAGE_KEY = 'somaiya_nav_tab_names_pure_notes_v3';

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // Tab Customization State
  const [tabNames, setTabNames] = useState<Record<string, string>>(DEFAULT_TAB_NAMES);
  const [isEditingTabs, setIsEditingTabs] = useState(false);
  const [tempNames, setTempNames] = useState<Record<string, string>>(DEFAULT_TAB_NAMES);

  useEffect(() => {
    setUser(HubStore.getCurrentUser());

    try {
      const stored = localStorage.getItem(TAB_STORAGE_KEY);
      if (stored) {
        setTabNames(JSON.parse(stored));
        setTempNames(JSON.parse(stored));
      }
    } catch {
      // ignore
    }

    const handleUpdate = () => {
      setUser(HubStore.getCurrentUser());
    };

    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const saveTabNames = (names: Record<string, string>) => {
    setTabNames(names);
    setTempNames(names);
    try {
      localStorage.setItem(TAB_STORAGE_KEY, JSON.stringify(names));
    } catch {
      // ignore
    }
  };

  const handleSaveTabEdit = (e: React.FormEvent) => {
    e.preventDefault();
    saveTabNames(tempNames);
    setIsEditingTabs(false);
  };

  const handleResetTabs = () => {
    saveTabNames(DEFAULT_TAB_NAMES);
    setIsEditingTabs(false);
  };

  const navLinks = [
    { href: '/resources', icon: BookOpen, badge: undefined },
    { href: '/youtube', icon: Tv, badge: 'YouTube' },
    { href: '/calculator', icon: Calculator, badge: 'Soon' },
    { href: '/admin/upload', icon: UploadCloud, badge: undefined },
  ];

  const toggleRole = () => {
    if (user?.role === 'admin') {
      HubStore.loginAsStudent();
    } else {
      HubStore.loginAsAdmin();
    }
    setRoleDropdownOpen(false);
  };

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP: FIXED LEFT SIDEBAR NAVIGATION (Stacked Vertically) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen w-64 bg-[#0F172A]/95 backdrop-blur-xl border-r border-slate-800/80 p-5 z-40 shadow-2xl">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group px-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#38BDF8] via-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-lg shadow-cyan-950/40 group-hover:scale-105 transition-transform text-slate-950 font-black">
              <GraduationCap className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#F8FAFC]">Versa</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#38BDF8]/20 text-[#38BDF8] font-bold">FY</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Computer Engineering</p>
            </div>
          </Link>

          {/* Section Header with Quick Edit Action */}
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Academic Hub
            </span>
            <button
              onClick={() => {
                setTempNames(tabNames);
                setIsEditingTabs(true);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-[#38BDF8] hover:bg-slate-800 transition"
              title="Edit Tab Names"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Navigation: Stacked vertically one below the other */}
          <nav className="flex flex-col space-y-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const displayName = tabNames[link.href] || DEFAULT_TAB_NAMES[link.href] || 'Tab';

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                    isActive
                      ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-lg shadow-cyan-950/50'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-[#38BDF8]'}`} />
                    <span>{displayName}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? 'bg-slate-950/30 text-slate-950 font-extrabold'
                          : link.badge === 'Soon'
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sidebar Section: Theme Toggle, Admin Studio, User Profile */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          {/* Admin Studio Link */}
          <Link
            href="/admin"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
              pathname.startsWith('/admin')
                ? 'bg-[#38BDF8] text-slate-950 shadow-md shadow-cyan-950/50'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border border-slate-700/80 hover:border-[#38BDF8]/50'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className={`w-4 h-4 ${pathname.startsWith('/admin') ? 'text-slate-950' : 'text-[#38BDF8]'}`} />
              <span>Admin Studio</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300">Staff</span>
          </Link>

          {/* Theme & User Profile Controls */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="relative flex-1">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="w-full flex items-center space-x-2 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-[#38BDF8]/40 transition text-left"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-700 to-[#1E293B] border border-slate-600 flex items-center justify-center text-xs font-bold text-[#38BDF8] flex-shrink-0">
                  {user?.role === 'admin' ? 'AD' : 'ST'}
                </div>
                <div className="truncate pr-1">
                  <p className="font-semibold text-slate-200 text-xs truncate leading-tight">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize leading-tight">{user?.role || 'student'}</p>
                </div>
              </button>

              {roleDropdownOpen && (
                <div className="absolute left-0 bottom-full mb-2 w-56 glass-panel bg-[#1E293B] rounded-2xl shadow-2xl p-3 border border-slate-700 text-xs z-50 animate-in fade-in zoom-in-95">
                  <div className="pb-2 border-b border-slate-700/80 mb-2">
                    <p className="font-semibold text-slate-200">{user?.fullName}</p>
                    <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
                  </div>

                  <div className="space-y-1">
                    <button
                      onClick={toggleRole}
                      className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-slate-800 text-slate-300 flex items-center justify-between"
                    >
                      <span>Switch Role</span>
                      <span className="font-bold text-[#38BDF8]">
                        {user?.role === 'admin' ? '→ Student' : '→ Admin'}
                      </span>
                    </button>
                    <Link
                      href="/admin"
                      onClick={() => setRoleDropdownOpen(false)}
                      className="block px-2.5 py-2 rounded-xl hover:bg-slate-800 text-slate-300"
                    >
                      Admin Studio Dashboard
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE: TOP BAR HEADER & MOBILE DRAWER */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-50 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#38BDF8] via-[#6366F1] to-[#818CF8] flex items-center justify-center text-slate-950 font-black">
              <GraduationCap className="w-5 h-5 text-slate-950" />
            </div>
            <span className="font-extrabold text-lg text-[#F8FAFC]">Versa</span>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsEditingTabs(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              title="Edit Tab Names"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="bg-[#1E293B] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-2">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname.startsWith(link.href);
                const displayName = tabNames[link.href] || DEFAULT_TAB_NAMES[link.href] || 'Tab';

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4" />
                      <span>{displayName}</span>
                    </div>
                    {link.badge && (
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                          link.badge === 'Soon'
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : 'bg-slate-800 text-[#38BDF8]'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-[#38BDF8] text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/40"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Enter Admin Studio</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Edit Tab Names Modal */}
      {isEditingTabs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-slate-700 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="font-bold text-[#F8FAFC] text-base">Edit Navigation Tab Names</h3>
              </div>
              <button onClick={() => setIsEditingTabs(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTabEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-medium">Notes & Resources Tab</label>
                <input
                  type="text"
                  value={tempNames['/resources'] || ''}
                  onChange={(e) => setTempNames({ ...tempNames, '/resources': e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Video Lectures Tab</label>
                <input
                  type="text"
                  value={tempNames['/youtube'] || ''}
                  onChange={(e) => setTempNames({ ...tempNames, '/youtube': e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">SGPA Calculator Tab</label>
                <input
                  type="text"
                  value={tempNames['/calculator'] || ''}
                  onChange={(e) => setTempNames({ ...tempNames, '/calculator': e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-medium">Upload Notes Tab</label>
                <input
                  type="text"
                  value={tempNames['/admin/upload'] || ''}
                  onChange={(e) => setTempNames({ ...tempNames, '/admin/upload': e.target.value })}
                  required
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleResetTabs}
                  className="flex items-center space-x-1 text-slate-400 hover:text-white text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Restore Defaults</span>
                </button>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTabs(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold shadow-lg shadow-cyan-950/40"
                  >
                    Save Tab Names
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
