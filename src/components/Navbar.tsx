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
  LogIn,
  LogOut,
  User,
} from 'lucide-react';
import { signOutFirebaseUser } from '@/lib/firebase-services';
import { HubStore } from '@/lib/store';
import { UserProfile } from '@/lib/types';

const DEFAULT_TAB_NAMES: Record<string, string> = {
  '/resources': 'Notes & Materials',
  '/youtube': 'Video Lectures',
  '/admin/upload': 'Upload Notes',
};

const TAB_STORAGE_KEY = 'somaiya_nav_tab_names_pure_notes_v4';

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
      {/* DESKTOP: FIXED LEFT SIDEBAR NAVIGATION                     */}
      {/* ======================================================== */}
      <aside className="hidden md:flex flex-col justify-between fixed top-0 left-0 h-screen w-64 bg-[#080A08] border-r border-[#1C271E] p-5 z-40 shadow-xl transition-colors">
        <div className="space-y-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group px-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center shadow-lg shadow-emerald-950/40 text-black font-black group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight text-[#F0FDF4]">Versa</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#10B981]/15 text-[#34D399] font-bold border border-[#10B981]/30">FY</span>
              </div>
              <p className="text-[11px] text-[#86998A] font-medium">Computer Engineering</p>
            </div>
          </Link>

          {/* Section Header with Quick Edit Action */}
          <div className="flex items-center justify-between px-2 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#86998A]">
              Academic Hub
            </span>
            <button
              onClick={() => {
                setTempNames(tabNames);
                setIsEditingTabs(true);
              }}
              className="p-1 rounded-md text-[#86998A] hover:text-[#34D399] hover:bg-[#151D17] transition"
              title="Edit Tab Names"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Main Navigation: Stacked vertically */}
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
                      ? 'bg-[#10B981] text-black font-bold shadow-md shadow-emerald-950/40'
                      : 'text-[#86998A] hover:text-[#F0FDF4] hover:bg-[#151D17] border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#86998A] group-hover:text-[#34D399]'}`} />
                    <span>{displayName}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        isActive
                          ? 'bg-black/20 text-black font-extrabold'
                          : 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30'
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

        {/* Bottom Sidebar Section: User Account & Admin Studio */}
        <div className="pt-4 border-t border-[#1C271E] space-y-2.5">
          {/* Sign In / User Profile Card */}
          {user ? (
            <div className="bg-[#0F1410] rounded-xl p-2.5 border border-[#1C271E] flex items-center justify-between gap-2">
              <Link
                href="/auth/login"
                className="flex items-center space-x-2.5 min-w-0 flex-1 group"
                title="Manage Account / Switch User"
              >
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName}
                    className="w-7 h-7 rounded-lg object-cover border border-[#10B981]/30 flex-shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-[#10B981] flex items-center justify-center text-[10px] font-black text-black flex-shrink-0">
                    {user.fullName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="truncate min-w-0">
                  <p className="font-bold text-[#F0FDF4] text-xs truncate group-hover:text-[#34D399] transition">
                    {user.fullName}
                  </p>
                  <p className="text-[10px] text-[#86998A] truncate font-mono">
                    {user.email || 'student@somaiya.edu'}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => {
                  signOutFirebaseUser();
                  HubStore.setCurrentUser(null);
                }}
                className="p-1.5 rounded-lg text-[#86998A] hover:text-rose-400 hover:bg-rose-950/30 transition flex-shrink-0"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="flex items-center justify-center space-x-2 px-3.5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-[#10B981]/20 transition w-full"
            >
              <LogIn className="w-4 h-4 text-black" />
              <span>Sign In with @somaiya.edu</span>
            </Link>
          )}

          {/* Admin Studio Link */}
          <Link
            href="/admin"
            className={`flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all ${
              pathname.startsWith('/admin')
                ? 'bg-[#10B981] text-black shadow-md shadow-emerald-950/40'
                : 'bg-[#0F1410] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] hover:border-[#10B981]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <ShieldCheck className={`w-4 h-4 ${pathname.startsWith('/admin') ? 'text-black' : 'text-[#10B981]'}`} />
              <span>Admin Studio</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">Staff</span>
          </Link>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* MOBILE: TOP BAR HEADER & MOBILE DRAWER                     */}
      {/* ======================================================== */}
      <header className="md:hidden sticky top-0 z-50 bg-[#080A08]/95 backdrop-blur-md border-b border-[#1C271E]">
        <div className="px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#10B981] flex items-center justify-center text-black font-black">
              <GraduationCap className="w-5 h-5 text-black" />
            </div>
            <span className="font-extrabold text-lg text-[#F0FDF4]">Versa</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link
              href="/auth/login"
              className="px-2.5 py-1 rounded-lg bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-xs font-bold flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{user ? user.fullName.split(' ')[0] : 'Sign In'}</span>
            </Link>

            <button
              onClick={() => setIsEditingTabs(true)}
              className="p-1.5 rounded-lg text-[#86998A] hover:text-[#F0FDF4]"
              title="Edit Tab Names"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-[#86998A] hover:text-[#F0FDF4]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="p-4 bg-[#080A08] border-b border-[#1C271E] space-y-3 animate-in slide-in-from-top-2 duration-150">
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
                        ? 'bg-[#10B981] text-black font-bold'
                        : 'text-[#86998A] hover:bg-[#151D17]'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{displayName}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-bold uppercase">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              <Link
                href="/auth/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-[#34D399] bg-[#10B981]/10 border border-[#10B981]/30"
              >
                <div className="flex items-center space-x-2.5">
                  <LogIn className="w-4 h-4" />
                  <span>{user ? `Account (${user.fullName})` : 'Sign in with Somaiya Google'}</span>
                </div>
              </Link>

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase ${
                  pathname.startsWith('/admin')
                    ? 'bg-[#10B981] text-black'
                    : 'bg-[#0F1410] text-[#86998A] border border-[#1C271E]'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Admin Studio</span>
                </div>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">Staff</span>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Edit Tab Names Modal */}
      {isEditingTabs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0F1410] border border-[#1C271E] rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <div className="flex items-center space-x-2">
                <Edit2 className="w-4 h-4 text-[#34D399]" />
                <h3 className="font-bold text-[#F0FDF4] text-sm">Customize Navigation Tabs</h3>
              </div>
              <button
                onClick={() => setIsEditingTabs(false)}
                className="p-1 rounded-lg text-[#86998A] hover:text-[#F0FDF4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTabEdit} className="space-y-3.5 text-xs">
              {navLinks.map((link) => (
                <div key={link.href} className="space-y-1">
                  <label className="text-[#86998A] font-semibold">{link.href}</label>
                  <input
                    type="text"
                    value={tempNames[link.href] || ''}
                    onChange={(e) =>
                      setTempNames({
                        ...tempNames,
                        [link.href]: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#080A08] border border-[#1C271E] text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                    placeholder={DEFAULT_TAB_NAMES[link.href]}
                  />
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-[#1C271E]">
                <button
                  type="button"
                  onClick={handleResetTabs}
                  className="inline-flex items-center space-x-1.5 text-[#86998A] hover:text-[#F0FDF4] text-xs font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingTabs(false)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-md"
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
