'use client';

import React, { useState, useEffect } from 'react';
import { HubStore } from '@/lib/store';
import { Subject, Module } from '@/lib/types';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit2,
  X,
  Layers,
  RotateCcw,
  AlertTriangle,
  Award,
} from 'lucide-react';
import CreditSchemeModal from '@/components/CreditSchemeModal';
import confetti from 'canvas-confetti';

export default function AdminHierarchyPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  // Add Subject modal state
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubSemester, setNewSubSemester] = useState<1 | 2>(1);
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubName, setNewSubName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('BSC');
  const [newSubCredits, setNewSubCredits] = useState(4);
  const [newSubHasLab, setNewSubHasLab] = useState(false);
  const [newSubDesc, setNewSubDesc] = useState('');

  // Edit Subject modal state
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  // Add Module modal state
  const [activeSubjectForModule, setActiveSubjectForModule] = useState<Subject | null>(null);
  const [newModNumber, setNewModNumber] = useState(1);
  const [newModTitle, setNewModTitle] = useState('');
  const [newModDesc, setNewModDesc] = useState('');
  const [newModTopics, setNewModTopics] = useState('');
  const [newModMarks, setNewModMarks] = useState(16);

  // Edit Module modal state
  const [editingModule, setEditingModule] = useState<Module | null>(null);

  // Credit Scheme Modal State
  const [isCreditSchemeOpen, setIsCreditSchemeOpen] = useState(false);
  const [schemeSemester, setSchemeSemester] = useState<1 | 2>(1);

  // Clear confirmation
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setSubjects(HubStore.getSubjects());
    setModules(HubStore.getModules());
  };

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubCode || !newSubName) return;

    HubStore.addSubject({
      semester: newSubSemester,
      code: newSubCode.toUpperCase(),
      name: newSubName,
      category: newSubCategory,
      scheme: 'REV_2025',
      credits: Number(newSubCredits),
      hasLab: newSubHasLab,
      description: newSubDesc || `${newSubName} for Semester ${newSubSemester}.`,
    });

    setIsAddingSubject(false);
    setNewSubCode('');
    setNewSubName('');
    setNewSubDesc('');

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#34D399', '#A3E635', '#F59E0B'],
    });
  };

  const handleSaveEditSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubject) return;

    HubStore.updateSubject(editingSubject.id, {
      name: editingSubject.name,
      code: editingSubject.code.toUpperCase(),
      category: editingSubject.category || 'BSC',
      credits: Number(editingSubject.credits),
      hasLab: editingSubject.hasLab,
      description: editingSubject.description,
      semester: editingSubject.semester,
    });

    setEditingSubject(null);
  };

  const handleCreateModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubjectForModule || !newModTitle) return;

    const topicsArray = newModTopics
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    HubStore.addModule({
      subjectId: activeSubjectForModule.id,
      moduleNumber: Number(newModNumber),
      title: newModTitle,
      description: newModDesc || newModTitle,
      topics: topicsArray.length > 0 ? topicsArray : [newModTitle],
      weightageMarks: Number(newModMarks),
    });

    setActiveSubjectForModule(null);
    setNewModTitle('');
    setNewModDesc('');
    setNewModTopics('');
  };

  const handleSaveEditModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule) return;

    HubStore.updateModule(editingModule.id, {
      title: editingModule.title,
      moduleNumber: Number(editingModule.moduleNumber),
      description: editingModule.description,
      topics: Array.isArray(editingModule.topics) ? editingModule.topics : [],
      weightageMarks: Number(editingModule.weightageMarks),
    });

    setEditingModule(null);
  };

  const handleDeleteSubject = (id: string) => {
    HubStore.deleteSubject(id);
  };

  const handleDeleteModule = (id: string) => {
    HubStore.deleteModule(id);
  };

  const handleClearAll = () => {
    HubStore.clearAllData();
    setShowClearConfirm(false);
  };

  const handleRestoreDefaults = () => {
    HubStore.resetToFirstYearDefaults();
  };

  const sem1Subjects = subjects.filter((s) => s.semester === 1);
  const sem2Subjects = subjects.filter((s) => s.semester === 2);
  const sem1Credits = sem1Subjects.reduce((sum, s) => sum + (s.credits || 0), 0);
  const sem2Credits = sem2Subjects.reduce((sum, s) => sum + (s.credits || 0), 0);

  const getCategoryBadgeColor = (category?: string) => {
    const c = (category || '').toUpperCase();
    if (c.includes('BSC') || c.includes('BASIC SCIENCE')) {
      return 'bg-[#10B981]/15 text-[#34D399] border-[#10B981]/30';
    }
    if (c.includes('ESC') || c.includes('ENGINEERING SCIENCE')) {
      return 'bg-[#F59E0B]/15 text-amber-300 border-[#F59E0B]/30';
    }
    if (c.includes('HSMC') || c.includes('HUMANITIES')) {
      return 'bg-[#A3E635]/15 text-[#A3E635] border-[#A3E635]/30';
    }
    if (c.includes('PCC') || c.includes('CORE')) {
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
    return 'bg-[#151D17] text-[#86998A] border-[#1C271E]';
  };

  const renderSubjectCard = (sub: Subject) => {
    const subModules = modules.filter((m) => m.subjectId === sub.id);

    return (
      <div
        key={sub.id}
        className="bg-[#0F1410]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1C271E] space-y-4 shadow-xl hover:border-[#2B3C2E] transition-all"
      >
        {/* Subject Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#151D17] text-[#F0FDF4] font-bold border border-[#1C271E]">
                {sub.code}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded font-bold border ${getCategoryBadgeColor(
                  sub.category
                )}`}
              >
                {sub.category || 'BSC'}
              </span>
              <span className="text-[10px] text-[#34D399] font-mono font-bold">
                {sub.credits} Credits {sub.hasLab ? '• Lab Practical' : ''}
              </span>
            </div>
            <h3 className="font-bold text-[#F0FDF4] text-sm mt-1">{sub.name}</h3>
            {sub.description && (
              <p className="text-[11px] text-[#86998A] mt-1 line-clamp-2">{sub.description}</p>
            )}
          </div>

          {/* Action Buttons: Edit Subject & Delete Subject */}
          <div className="flex items-center space-x-1 flex-shrink-0">
            <button
              onClick={() => setEditingSubject(sub)}
              className="p-1.5 rounded-lg text-[#86998A] hover:text-[#F0FDF4] hover:bg-[#151D17] transition border border-transparent hover:border-[#1C271E]"
              title="Edit Subject Name, Code & Credits"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteSubject(sub.id)}
              className="p-1.5 rounded-lg text-[#86998A] hover:text-rose-400 hover:bg-rose-950/30 transition border border-transparent hover:border-rose-900/30"
              title="Delete Subject"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Modules List for this Subject */}
        <div className="space-y-2 pt-2 border-t border-[#1C271E]">
          <div className="flex items-center justify-between text-[11px] text-[#86998A] font-semibold">
            <span>Modules ({subModules.length})</span>
            <button
              onClick={() => {
                setActiveSubjectForModule(sub);
                setNewModNumber(subModules.length + 1);
              }}
              className="text-[#34D399] hover:text-[#A3E635] flex items-center space-x-1 font-bold transition"
            >
              <Plus className="w-3 h-3" />
              <span>Add Module</span>
            </button>
          </div>

          {subModules.length === 0 ? (
            <p className="text-[10px] text-[#86998A]/60 italic py-1">No modules added yet.</p>
          ) : (
            <div className="space-y-1.5">
              {subModules.map((m) => (
                <div
                  key={m.id}
                  className="bg-[#080A08]/80 p-2.5 rounded-xl border border-[#1C271E] flex items-center justify-between text-xs group hover:border-[#2B3C2E] transition-all"
                >
                  <div className="truncate pr-2">
                    <span className="font-semibold text-[#F0FDF4]">
                      Mod {m.moduleNumber}: {m.title}
                    </span>
                    {(m.weightageMarks ?? 0) > 0 && (
                      <span className="text-[10px] text-[#86998A] ml-2 font-mono">
                        ({m.weightageMarks} Marks)
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <button
                      onClick={() => setEditingModule(m)}
                      className="p-1 rounded-md text-[#86998A] hover:text-[#F0FDF4] hover:bg-[#151D17] transition opacity-80 group-hover:opacity-100"
                      title="Edit Module Title"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(m.id)}
                      className="p-1 rounded-md text-[#86998A] hover:text-rose-400 hover:bg-rose-950/30 transition opacity-80 group-hover:opacity-100"
                      title="Delete Module"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header with Clear, Restore & Credit Scheme buttons */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#34D399]">
              Curriculum & Credit Manager
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight mt-1">
            Manage Courses, Modules & Credit Schemes
          </h1>
          <p className="text-xs text-[#86998A] mt-1">
            Add, edit, or delete Semester 1 & Semester 2 subjects, course categories, credits, and module topics.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          {/* View Credit Scheme Button */}
          <button
            onClick={() => {
              setSchemeSemester(1);
              setIsCreditSchemeOpen(true);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#10B981]/10 text-[#34D399] border border-[#10B981]/25 hover:bg-[#10B981]/20 text-xs font-semibold transition shadow-md"
          >
            <Award className="w-4 h-4 text-[#10B981]" />
            <span>Credit Scheme ({sem1Credits + sem2Credits} Cr)</span>
          </button>

          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/25 hover:bg-rose-500/20 text-xs font-semibold transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>

          <button
            onClick={handleRestoreDefaults}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#0F1410] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] hover:border-[#2B3C2E] text-xs font-semibold transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restore Defaults</span>
          </button>

          <button
            onClick={() => {
              setNewSubSemester(1);
              setIsAddingSubject(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-[#10B981]/20 transition"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Add New Subject</span>
          </button>
        </div>
      </div>

      {/* Clear Confirmation Banner */}
      {showClearConfirm && (
        <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-950/30 text-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>
              Are you sure you want to clear all subjects and modules? You can restore default courses anytime.
            </span>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs"
            >
              Yes, Clear Everything
            </button>
            <button
              onClick={() => setShowClearConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-[#0F1410] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 2-Column Layout for Semester 1 & Semester 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Semester 1 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-md bg-[#10B981]"></span>
              <h2 className="text-base font-bold text-[#F0FDF4] tracking-tight">
                Semester 1 ({sem1Subjects.length} Subjects • {sem1Credits} Credits)
              </h2>
            </div>

            <button
              onClick={() => {
                setNewSubSemester(1);
                setIsAddingSubject(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0F1410] hover:bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] text-xs font-semibold transition flex items-center space-x-1"
            >
              <Plus className="w-3 h-3 text-[#34D399]" />
              <span>Add Sem 1 Subject</span>
            </button>
          </div>

          <div className="space-y-4">
            {sem1Subjects.length === 0 ? (
              <div className="p-8 rounded-2xl text-center text-[#86998A] text-xs border border-dashed border-[#1C271E] bg-[#0F1410]/40">
                No subjects in Semester 1.
              </div>
            ) : (
              sem1Subjects.map(renderSubjectCard)
            )}
          </div>
        </div>

        {/* Column 2: Semester 2 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-md bg-[#34D399]"></span>
              <h2 className="text-base font-bold text-[#F0FDF4] tracking-tight">
                Semester 2 ({sem2Subjects.length} Subjects • {sem2Credits} Credits)
              </h2>
            </div>

            <button
              onClick={() => {
                setNewSubSemester(2);
                setIsAddingSubject(true);
              }}
              className="px-2.5 py-1 rounded-lg bg-[#0F1410] hover:bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] text-xs font-semibold transition flex items-center space-x-1"
            >
              <Plus className="w-3 h-3 text-[#34D399]" />
              <span>Add Sem 2 Subject</span>
            </button>
          </div>

          <div className="space-y-4">
            {sem2Subjects.length === 0 ? (
              <div className="p-8 rounded-2xl text-center text-[#86998A] text-xs border border-dashed border-[#1C271E] bg-[#0F1410]/40">
                No subjects in Semester 2.
              </div>
            ) : (
              sem2Subjects.map(renderSubjectCard)
            )}
          </div>
        </div>
      </div>

      {/* Modal 1: Add Subject */}
      {isAddingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <div className="flex items-center space-x-2">
                <FolderTree className="w-4 h-4 text-[#34D399]" />
                <h3 className="font-bold text-[#F0FDF4] text-base">Add New Course Subject</h3>
              </div>
              <button onClick={() => setIsAddingSubject(false)} className="text-[#86998A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubject} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Target Semester *</label>
                  <select
                    value={newSubSemester}
                    onChange={(e) => setNewSubSemester(Number(e.target.value) as 1 | 2)}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#86998A] block mb-1">Course Code *</label>
                  <input
                    type="text"
                    placeholder="e.g. 1U01M101"
                    value={newSubCode}
                    onChange={(e) => setNewSubCode(e.target.value)}
                    required
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] uppercase font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Subject Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Engineering Graphics & Design"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Category</label>
                  <select
                    value={newSubCategory}
                    onChange={(e) => setNewSubCategory(e.target.value)}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="BSC">BSC (Basic Science)</option>
                    <option value="ESC">ESC (Engineering Science)</option>
                    <option value="PCC">PCC (Professional Core)</option>
                    <option value="HSMC">HSMC (Humanities & Mgmt)</option>
                    <option value="VSEC">VSEC (Skill Enhancement)</option>
                    <option value="AEC">AEC (Ability Enhancement)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#86998A] block mb-1">Total Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={newSubCredits}
                    onChange={(e) => setNewSubCredits(Number(e.target.value))}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Course Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief course overview..."
                  value={newSubDesc}
                  onChange={(e) => setNewSubDesc(e.target.value)}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="hasLab"
                  checked={newSubHasLab}
                  onChange={(e) => setNewSubHasLab(e.target.checked)}
                  className="w-4 h-4 rounded text-[#10B981] bg-[#080A08] border-[#1C271E]"
                />
                <label htmlFor="hasLab" className="text-[#F0FDF4]">
                  Includes Lab / Practical Session
                </label>
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSubject(false)}
                  className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] hover:text-white border border-[#1C271E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-[#10B981]/20"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Edit Subject */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <h3 className="font-bold text-[#F0FDF4] text-base">Edit Subject Details</h3>
              <button onClick={() => setEditingSubject(null)} className="text-[#86998A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditSubject} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Semester</label>
                  <select
                    value={editingSubject.semester}
                    onChange={(e) =>
                      setEditingSubject({ ...editingSubject, semester: Number(e.target.value) as 1 | 2 })
                    }
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value={1}>Semester 1</option>
                    <option value={2}>Semester 2</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#86998A] block mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={editingSubject.code}
                    onChange={(e) => setEditingSubject({ ...editingSubject, code: e.target.value })}
                    required
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] uppercase font-mono focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Subject Name *</label>
                <input
                  type="text"
                  value={editingSubject.name}
                  onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Category</label>
                  <select
                    value={editingSubject.category || 'BSC'}
                    onChange={(e) => setEditingSubject({ ...editingSubject, category: e.target.value })}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="BSC">BSC (Basic Science)</option>
                    <option value="ESC">ESC (Engineering Science)</option>
                    <option value="PCC">PCC (Professional Core)</option>
                    <option value="HSMC">HSMC (Humanities & Mgmt)</option>
                    <option value="VSEC">VSEC (Skill Enhancement)</option>
                    <option value="AEC">AEC (Ability Enhancement)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#86998A] block mb-1">Credits</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={editingSubject.credits}
                    onChange={(e) => setEditingSubject({ ...editingSubject, credits: Number(e.target.value) })}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingSubject.description || ''}
                  onChange={(e) => setEditingSubject({ ...editingSubject, description: e.target.value })}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingSubject(null)}
                  className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] hover:text-white border border-[#1C271E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-[#10B981]/20"
                >
                  Save Subject Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: Add Module */}
      {activeSubjectForModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <div>
                <h3 className="font-bold text-[#F0FDF4] text-base">Add Module</h3>
                <p className="text-[11px] text-[#86998A]">{activeSubjectForModule.name}</p>
              </div>
              <button
                onClick={() => setActiveSubjectForModule(null)}
                className="text-[#86998A] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateModule} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Module Number *</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newModNumber}
                    onChange={(e) => setNewModNumber(Number(e.target.value))}
                    required
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="text-[#86998A] block mb-1">Marks Weightage</label>
                  <input
                    type="number"
                    min="0"
                    value={newModMarks}
                    onChange={(e) => setNewModMarks(Number(e.target.value))}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Module Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Partial Differentiation & Euler's Theorem"
                  value={newModTitle}
                  onChange={(e) => setNewModTitle(e.target.value)}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Key Topics (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="Euler Theorem, Jacobians, Maxima Minima"
                  value={newModTopics}
                  onChange={(e) => setNewModTopics(e.target.value)}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Syllabus unit summary..."
                  value={newModDesc}
                  onChange={(e) => setNewModDesc(e.target.value)}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setActiveSubjectForModule(null)}
                  className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] hover:text-white border border-[#1C271E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-[#10B981]/20"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: Edit Module */}
      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <h3 className="font-bold text-[#F0FDF4] text-base">Edit Module Details</h3>
              <button onClick={() => setEditingModule(null)} className="text-[#86998A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditModule} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Module Number *</label>
                  <input
                    type="number"
                    min="1"
                    value={editingModule.moduleNumber}
                    onChange={(e) =>
                      setEditingModule({ ...editingModule, moduleNumber: Number(e.target.value) })
                    }
                    required
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div>
                  <label className="text-[#86998A] block mb-1">Marks Weightage</label>
                  <input
                    type="number"
                    min="0"
                    value={editingModule.weightageMarks || 0}
                    onChange={(e) =>
                      setEditingModule({ ...editingModule, weightageMarks: Number(e.target.value) })
                    }
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Module Title *</label>
                <input
                  type="text"
                  value={editingModule.title}
                  onChange={(e) => setEditingModule({ ...editingModule, title: e.target.value })}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingModule.description || ''}
                  onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] hover:text-white border border-[#1C271E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-[#10B981]/20"
                >
                  Save Module Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Credit Scheme Modal */}
      <CreditSchemeModal
        isOpen={isCreditSchemeOpen}
        onClose={() => setIsCreditSchemeOpen(false)}
        semester={schemeSemester}
        subjects={subjects}
        onSemesterChange={(sem) => setSchemeSemester(sem)}
      />
    </div>
  );
}
