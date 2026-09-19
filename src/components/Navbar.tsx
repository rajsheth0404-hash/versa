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
  UserCheck,
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
  };

  return (
    <>
      {/* ======================================================== */}
      {/* DESKTOP: FIXED LEFT SIDEBAR NAVIGATION (Stacked Vertically) */}
      {/* ======================================================== */}
      <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen w-64 bg-white dark:bg-[#0b0f17] backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 p-5 z-40 shadow-sm transition-colors">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group px-1">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shadow-md text-white font-black group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-slate-100">Versa</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 font-bold border border-sky-200 dark:border-sky-800/60">FY</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Computer Engineering</p>
            </div>
          </Link>

          {/* Section Header with Quick Edit Action */}
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Academic Hub
            </span>
            <button
              onClick={() => {
                setTempNames(tabNames);
                setIsEditingTabs(true);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-indigo-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
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
                      ? 'bg-indigo-600 text-white dark:bg-indigo-600 dark:text-white font-bold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-[#131b2a] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-sky-400'}`} />
                    <span>{displayName}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? 'bg-black/20 text-white font-extrabold'
                          : 'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60'
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

        {/* Bottom Sidebar Section: Theme Toggle, Admin Studio, Quick Role Pill */}
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          {/* Admin Studio Link */}
          <Link
            href="/admin"
            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
              pathname.startsWith('/admin')
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-[#131b2a] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-sky-500'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className={`w-4 h-4 ${pathname.startsWith('/admin') ? 'text-white' : 'text-indigo-600 dark:text-sky-400'}`} />
              <span>Admin Studio</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">Staff</span>
          </Link>

          {/* Role Switcher Pill & Theme Toggle */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <button
              onClick={toggleRole}
              className="flex-1 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#131b2a] border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-sky-500 transition text-left group"
              title="Click to switch role between Student and Admin"
            >
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-[10px] font-extrabold flex-shrink-0">
                  {user?.role === 'admin' ? 'AD' : 'ST'}
                </div>
                <div className="truncate">
                  <p className="font-bold text-slate-900 dark:text-slate-100 text-xs truncate capitalize leading-tight group-hover:text-indigo-600 dark:group-hover:text-sky-400">
                    {user?.role === 'admin' ? 'Admin Mode' : 'Student Mode'}
                  </p>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 truncate leading-tight">Click to switch</p>
                </div>
              </div>
            </button>

            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE: TOP BAR HEADER & MOBILE DRAWER */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-50 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100">Versa</span>
          </Link>

          <div className="flex items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsEditingTabs(true)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              title="Edit Tab Names"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="p-4 bg-white dark:bg-[#0b0f17] border-b border-slate-200 dark:border-slate-800 space-y-3 animate-in slide-in-from-top-2 duration-150">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                const displayName = tabNames[link.href] || DEFAULT_TAB_NAMES[link.href] || 'Tab';

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#131b2a]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{displayName}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60 font-bold uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase ${
                  pathname.startsWith('/admin')
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-50 dark:bg-[#131b2a] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Studio</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/60">Staff</span>
              </Link>
            </nav>

            <button
              onClick={() => {
                toggleRole();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#131b2a] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <span>Current Role: {user?.role === 'admin' ? 'Admin Mode' : 'Student Mode'}</span>
              <span className="text-[10px] text-indigo-600 dark:text-sky-400 font-bold">Switch</span>
            </button>
          </div>
        )}
      </header>

      {/* Edit Tab Names Modal */}
      {isEditingTabs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#131b2a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-indigo-600 dark:text-sky-400" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">Customize Navigation Tabs</h3>
              </div>
              <button
                onClick={() => setIsEditingTabs(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTabEdit} className="space-y-3.5 text-xs">
              {navLinks.map((link) => (
                <div key={link.href} className="space-y-1">
                  <label className="text-slate-600 dark:text-slate-400 font-semibold">{link.href}</label>
                  <input
                    type="text"
                    value={tempNames[link.href] || ''}
                    onChange={(e) =>
                      setTempNames({
                        ...tempNames,
                        [link.href]: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                    placeholder={DEFAULT_TAB_NAMES[link.href]}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetTabs}
                  className="inline-flex items-center space-x-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTabs(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-sm"
                  >
                    Save Changes
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
