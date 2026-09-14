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
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 bg-[#0F172A]/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#38BDF8] via-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-lg shadow-cyan-950/40 group-hover:scale-105 transition-transform text-slate-950 font-black">
                <GraduationCap className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight text-[#F8FAFC]">Versa</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              const displayName = tabNames[link.href] || DEFAULT_TAB_NAMES[link.href] || 'Tab';

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40 shadow-sm shadow-cyan-950/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#38BDF8]' : 'text-slate-400'}`} />
                  <span>{displayName}</span>
                  {link.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase border ${
                        link.badge === 'Soon'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                          : 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Edit Tab Names Button */}
            <button
              onClick={() => {
                setTempNames(tabNames);
                setIsEditingTabs(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition ml-1"
              title="Edit Tab Names"
            >
              <Edit2 className="w-3.5 h-3.5 text-slate-400 hover:text-[#38BDF8]" />
            </button>
          </nav>

          {/* User / Admin & Theme Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle (Light / Dark) */}
            <ThemeToggle />

            {/* Admin Ingestion Studio Link */}
            <Link
              href="/admin"
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all ${
                pathname.startsWith('/admin')
                  ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-md shadow-cyan-950/50'
                  : 'bg-slate-800/90 text-slate-300 hover:text-white border border-slate-700 hover:border-[#38BDF8]/50'
              }`}
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${pathname.startsWith('/admin') ? 'text-slate-950' : 'text-[#38BDF8]'}`} />
              <span>Admin Studio</span>
            </Link>

            {/* Profile / Role Selector */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center space-x-2 p-1.5 rounded-xl glass-card hover:border-[#38BDF8]/40 transition"
              >
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-slate-700 to-[#1E293B] border border-slate-600 flex items-center justify-center text-xs font-bold text-[#38BDF8]">
                  {user?.role === 'admin' ? 'AD' : 'ST'}
                </div>
                <div className="text-left text-xs pr-1">
                  <p className="font-semibold text-slate-200 truncate max-w-[110px] leading-tight">
                    {user?.fullName?.split(' ')[0] || 'User'}
                  </p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role || 'student'}</p>
                </div>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 glass-panel bg-[#1E293B] rounded-2xl shadow-2xl p-3 border border-slate-700 text-xs z-50">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsEditingTabs(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
              title="Edit Tab Names"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel bg-[#1E293B] border-b border-slate-800 px-4 pt-2 pb-6 space-y-3">
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
            <button
              onClick={() => {
                setIsEditingTabs(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold"
            >
              <Edit2 className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Edit Tab Names</span>
            </button>

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
    </header>
  );
}
