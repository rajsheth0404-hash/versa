'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  Search,
  Plus,
  FolderOpen,
  Award,
  FileText,
  FileCode,
  FileCheck,
  Presentation,
  Layers,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Calculator,
  Atom,
  FlaskConical,
  Zap,
  Compass,
  Dna,
  Code,
  Microscope,
  Cpu,
  Leaf,
  MessageSquare,
  Sparkles,
  GitBranch,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { HubStore } from '@/lib/store';
import { Subject, Module, AcademicResource, UserProfile } from '@/lib/types';
import ResourceCard from '@/components/ResourceCard';
import CreditSchemeModal from '@/components/CreditSchemeModal';

// Helper icon mapper
const ICON_MAP: Record<string, any> = {
  Calculator: Calculator,
  Atom: Atom,
  FlaskConical: FlaskConical,
  Zap: Zap,
  Compass: Compass,
  Dna: Dna,
  Code: Code,
  Microscope: Microscope,
  Cpu: Cpu,
  Leaf: Leaf,
  MessageSquare: MessageSquare,
};

export default function ResourcesPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialType = searchParams.get('type') || 'all';
  const initialSem = Number(searchParams.get('sem')) === 2 ? 2 : 1;
  const initialSubject = searchParams.get('subject') || null;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isCreditSchemeOpen, setIsCreditSchemeOpen] = useState(false);

  // Hierarchical Navigation States
  const [selectedYear, setSelectedYear] = useState<1 | 2>(1);
  const [selectedSemester, setSelectedSemester] = useState<1 | 2 | 3 | 4>(initialSem);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(initialSubject);
  const [selectedModuleId, setSelectedModuleId] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>(initialType);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const loadData = () => {
    setSubjects(HubStore.getSubjects());
    setModules(HubStore.getModules());
    setResources(HubStore.getResources());
    setCurrentUser(HubStore.getCurrentUser());
  };

  // Subjects in the active semester
  const availableSubjects = useMemo(() => {
    return subjects.filter((s) => s.semester === (selectedSemester <= 2 ? selectedSemester : 1));
  }, [subjects, selectedSemester]);

  // Selected subject object
  const activeSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // Modules for the active subject (sorted by moduleNumber)
  const activeSubjectModules = useMemo(() => {
    if (!selectedSubjectId) return [];
    return modules
      .filter((m) => m.subjectId === selectedSubjectId)
      .sort((a, b) => a.moduleNumber - b.moduleNumber);
  }, [modules, selectedSubjectId]);

  // Helper to intelligently resolve moduleId from title keywords if not already tagged
  const resolveResourceModuleId = (res: AcademicResource): string | null => {
    if (res.moduleId) return res.moduleId;
    const lower = (res.title + ' ' + (res.tags?.join(' ') || '')).toLowerCase();
    if (res.subjectId === 'sub-math1') {
      if (lower.includes('rank') || lower.includes('matrix') || lower.includes('echelon') || lower.includes('gauss') || lower.includes('linear system')) {
        return 'mod-m1-1';
      }
      if (lower.includes('partial') || lower.includes('jacobian') || lower.includes('maxima') || lower.includes('minima')) {
        return 'mod-m1-2';
      }
      if (lower.includes('euler') || lower.includes('homogeneous')) {
        return 'mod-m1-3';
      }
      if (lower.includes('differential') || lower.includes('ode') || lower.includes('particular integral') || lower.includes('variation')) {
        return 'mod-m1-4';
      }
      if (lower.includes('complex') || lower.includes('hyperbolic') || lower.includes('moivre') || lower.includes('logarithm')) {
        return 'mod-m1-5';
      }
    }
    return null;
  };

  // Category counts within active scope
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {
      all: 0,
      notes: 0,
      practice_ques: 0,
      pyq: 0,
      formula_sheet: 0,
      pdf: 0,
    };

    resources.forEach((res) => {
      const sub = subjects.find((s) => s.id === res.subjectId);
      if (!sub || sub.semester !== (selectedSemester <= 2 ? selectedSemester : 1)) return;
      if (selectedSubjectId && res.subjectId !== selectedSubjectId) return;

      const effectiveModId = resolveResourceModuleId(res);
      const isSubjectWidePyq = res.type === 'pyq' && !res.moduleId;

      if (!isSubjectWidePyq && selectedModuleId !== 'all' && effectiveModId !== selectedModuleId && res.moduleId !== selectedModuleId) {
        return;
      }

      counts.all += 1;
      if (res.type === 'notes' || res.type === 'ppt') {
        counts.notes += 1;
      } else if (res.type === 'practice_ques' || (res.type === 'pyq' && res.moduleId)) {
        counts.practice_ques += 1;
      } else if (res.type === 'pyq') {
        counts.pyq += 1;
      } else if (counts[res.type] !== undefined) {
        counts[res.type] += 1;
      }
    });

    return counts;
  }, [resources, subjects, selectedSemester, selectedSubjectId, selectedModuleId]);

  // Filtered resources based on query and type
  const filteredResources = useMemo(() => {
    const list = resources.filter((res) => {
      const sub = subjects.find((s) => s.id === res.subjectId);
      if (!sub || sub.semester !== (selectedSemester <= 2 ? selectedSemester : 1)) return false;

      if (selectedSubjectId && res.subjectId !== selectedSubjectId) {
        return false;
      }

      const effectiveModId = resolveResourceModuleId(res);
      const isSubjectWidePyq = res.type === 'pyq' && !res.moduleId;

      if (!isSubjectWidePyq && selectedModuleId !== 'all' && effectiveModId !== selectedModuleId && res.moduleId !== selectedModuleId) {
        return false;
      }

      if (selectedType !== 'all') {
        if (selectedType === 'notes') {
          if (res.type !== 'notes' && res.type !== 'ppt') return false;
        } else if (selectedType === 'practice_ques') {
          if (res.type !== 'practice_ques' && !(res.type === 'pyq' && res.moduleId)) return false;
        } else if (selectedType === 'pyq') {
          if (res.type !== 'pyq') return false;
        } else if (res.type !== selectedType) {
          return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mod = modules.find((m) => m.id === (effectiveModId || res.moduleId));
        const matches =
          res.title.toLowerCase().includes(q) ||
          res.tags?.some((t) => t.toLowerCase().includes(q)) ||
          res.fileName.toLowerCase().includes(q) ||
          (mod?.title.toLowerCase().includes(q) ?? false);
        if (!matches) return false;
      }

      return true;
    });

    // Sort by module number (1 to 5) then naturally by title so Part 1, Part 2 appear in order
    return list.sort((a, b) => {
      const effModA = resolveResourceModuleId(a) || a.moduleId;
      const effModB = resolveResourceModuleId(b) || b.moduleId;
      const modA = effModA ? modules.find((m) => m.id === effModA) : null;
      const modB = effModB ? modules.find((m) => m.id === effModB) : null;

      const numA = modA ? modA.moduleNumber : (a.type === 'pyq' ? 0 : 99);
      const numB = modB ? modB.moduleNumber : (b.type === 'pyq' ? 0 : 99);

      if (numA !== numB) {
        return numA - numB;
      }
      return a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' });
    });
  }, [resources, subjects, modules, selectedSemester, selectedSubjectId, selectedModuleId, selectedType, searchQuery]);

  // Auto-select first module when entering a subject if selectedModuleId is 'all' or empty
  useEffect(() => {
    if (activeSubject && activeSubjectModules.length > 0) {
      if (selectedModuleId === 'all' || !selectedModuleId || (!activeSubjectModules.some((m) => m.id === selectedModuleId) && selectedModuleId !== 'general')) {
        setSelectedModuleId(activeSubjectModules[0].id);
      }
    }
  }, [activeSubject, activeSubjectModules, selectedModuleId]);

  // Handle clicking a subject to enter it
  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
    const subjectMods = modules.filter((m) => m.subjectId === subjectId).sort((a, b) => a.moduleNumber - b.moduleNumber);
    setSelectedModuleId(subjectMods[0]?.id || '');
    setSelectedType('notes');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle resetting back to all subjects
  const handleBackToSubjects = () => {
    setSelectedSubjectId(null);
    setSelectedModuleId('');
    setSelectedType('notes');
    setSearchQuery('');
  };

  // Course-wide unmapped resources for the active subject
  const unmappedSubjectResources = useMemo(() => {
    if (!activeSubject) return [];
    return resources.filter((r) => {
      if (r.subjectId !== activeSubject.id) return false;
      const effModId = resolveResourceModuleId(r);
      return !effModId && !activeSubjectModules.some((m) => m.id === r.moduleId);
    });
  }, [resources, activeSubject, activeSubjectModules]);

  // Current active module object
  const isGeneralActive = selectedModuleId === 'general';
  const currentModule = useMemo(() => {
    if (isGeneralActive || !activeSubject) return null;
    return activeSubjectModules.find((m) => m.id === selectedModuleId) || activeSubjectModules[0] || null;
  }, [activeSubjectModules, selectedModuleId, isGeneralActive, activeSubject]);

  // Resources belonging to the active module or general section
  const activeSectionAllResources = useMemo(() => {
    if (!activeSubject) return [];
    if (isGeneralActive) {
      return unmappedSubjectResources;
    }
    if (!currentModule) return [];
    return resources.filter((r) => {
      if (r.subjectId !== activeSubject.id) return false;
      const effModId = resolveResourceModuleId(r);
      return r.moduleId === currentModule.id || effModId === currentModule.id;
    });
  }, [resources, activeSubject, isGeneralActive, unmappedSubjectResources, currentModule]);

  // Dynamic Type Tabs for the active module / section (No "All" tab)
  const activeSectionTypeTabs = useMemo(() => {
    const notesCount = activeSectionAllResources.filter((r) => r.type === 'notes' || r.type === 'ppt').length;
    const practiceCount = activeSectionAllResources.filter((r) => r.type === 'practice_ques').length;
    const pyqCount = activeSectionAllResources.filter((r) => r.type === 'pyq').length;
    const formulaCount = activeSectionAllResources.filter((r) => r.type === 'formula_sheet').length;
    const bookCount = activeSectionAllResources.filter((r) => r.type === 'pdf').length;
    const syllabusCount = activeSectionAllResources.filter((r) => r.type === 'syllabus').length;

    const tabs = [
      { type: 'notes', label: 'Notes', icon: FileText, count: notesCount },
      { type: 'practice_ques', label: 'Practice Ques', icon: FileCheck, count: practiceCount },
      { type: 'pyq', label: 'PYQs', icon: FileCheck, count: pyqCount },
      { type: 'formula_sheet', label: 'Formula Sheet', icon: FileCode, count: formulaCount },
      { type: 'pdf', label: 'Reference Book', icon: BookOpen, count: bookCount },
    ];

    if (syllabusCount > 0) {
      tabs.push({ type: 'syllabus', label: 'Syllabus', icon: Layers, count: syllabusCount });
    }

    return tabs;
  }, [activeSectionAllResources]);

  // Filtered resources for display inside the selected module
  const displayedModuleResources = useMemo(() => {
    return activeSectionAllResources
      .filter((res) => {
        if (selectedType === 'notes') {
          if (res.type !== 'notes' && res.type !== 'ppt') return false;
        } else if (selectedType === 'practice_ques') {
          if (res.type !== 'practice_ques' && !(res.type === 'pyq' && res.moduleId)) return false;
        } else if (res.type !== selectedType) {
          return false;
        }

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = res.title.toLowerCase().includes(q);
          const matchTag = res.tags?.some((t) => t.toLowerCase().includes(q));
          const matchType = res.type.toLowerCase().includes(q);
          const matchFileName = res.fileName?.toLowerCase().includes(q);
          if (!matchTitle && !matchTag && !matchType && !matchFileName) return false;
        }

        return true;
      })
      .sort((a, b) =>
        a.title.localeCompare(b.title, undefined, { numeric: true, sensitivity: 'base' })
      );
  }, [activeSectionAllResources, selectedType, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* 🧭 Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {/* Breadcrumb trail */}
          <div className="flex items-center space-x-2 text-xs text-[#86998A] mb-1">
            <button
              onClick={handleBackToSubjects}
              className="hover:text-[#F0FDF4] transition flex items-center space-x-1"
            >
              <span>Academic Hub</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 opacity-50" />
            <span className="text-[#F0FDF4] font-semibold">Semester {selectedSemester}</span>
            {activeSubject && (
              <>
                <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                <span className="text-[#10B981] font-bold truncate max-w-[200px]">
                  {activeSubject.name}
                </span>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight">
            {activeSubject ? activeSubject.name : 'First Year Notes & Study Materials'}
          </h1>
          <p className="text-xs text-[#86998A] mt-0.5">
            {activeSubject
              ? `Browse syllabus units module-by-module, lecture notes, formula sheets, and solved PYQs for ${activeSubject.code}.`
              : 'Select a course to explore syllabus modules, lecture notes, formula sheets, and past year question papers.'}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            onClick={() => setIsCreditSchemeOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl bg-[#0F1410] text-[#F0FDF4] border border-[#1C271E] hover:border-[#10B981] text-xs font-semibold shadow-sm transition"
          >
            <Award className="w-4 h-4 text-[#10B981]" />
            <span>Credit Scheme</span>
          </button>

          <Link
            href="/admin/upload"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold shadow-md shadow-emerald-950/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Notes</span>
          </Link>
        </div>
      </div>

      {/* Year Selector: First Year / Second Year */}
      <div className="flex flex-col items-start justify-start gap-2.5">
        <div className="flex bg-[#0F1410] p-1.5 rounded-2xl border border-[#1C271E] shadow-sm gap-1">
          <button
            onClick={() => {
              setSelectedYear(1);
              setSelectedSemester(1);
              setSelectedSubjectId(null);
              setSelectedModuleId('all');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              selectedYear === 1
                ? 'bg-[#10B981] text-black shadow-sm font-extrabold'
                : 'text-[#86998A] hover:text-[#F0FDF4]'
            }`}
          >
            <span>First Year</span>
          </button>
          <button
            onClick={() => {
              setSelectedYear(2);
              setSelectedSemester(3);
              setSelectedSubjectId(null);
              setSelectedModuleId('all');
            }}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              selectedYear === 2
                ? 'bg-[#10B981] text-black shadow-sm font-extrabold'
                : 'text-[#86998A] hover:text-[#F0FDF4]'
            }`}
          >
            <span>Second Year</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded font-mono uppercase font-bold bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30">
              Soon
            </span>
          </button>
        </div>

        {/* Nested Semester Selector for Selected Year */}
        {selectedYear === 1 ? (
          <div className="flex bg-[#0F1410] p-1 rounded-xl border border-[#1C271E] shadow-sm mt-1 animate-in fade-in">
            <button
              onClick={() => {
                setSelectedSemester(1);
                setSelectedSubjectId(null);
                setSelectedModuleId('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 1
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 1 Courses (7 Subjects)
            </button>
            <button
              onClick={() => {
                setSelectedSemester(2);
                setSelectedSubjectId(null);
                setSelectedModuleId('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 2
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 2 Courses (5 Subjects)
            </button>
          </div>
        ) : (
          <div className="flex bg-[#0F1410] p-1 rounded-xl border border-[#1C271E] shadow-sm mt-1 animate-in fade-in">
            <button
              onClick={() => {
                setSelectedSemester(3);
                setSelectedSubjectId(null);
                setSelectedModuleId('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 3
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 3 Courses
            </button>
            <button
              onClick={() => {
                setSelectedSemester(4);
                setSelectedSubjectId(null);
                setSelectedModuleId('all');
              }}
              className={`px-5 py-1.5 rounded-lg text-xs font-semibold transition ${
                selectedSemester === 4
                  ? 'bg-[#10B981] text-black font-bold shadow-sm'
                  : 'text-[#86998A] hover:text-[#F0FDF4]'
              }`}
            >
              Semester 4 Courses
            </button>
          </div>
        )}
      </div>

      {selectedYear === 2 ? (
        /* Second Year: Notes to be added soon Container */
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-12 sm:p-16 rounded-3xl text-center border border-dashed border-[#1C271E] space-y-5 shadow-2xl max-w-2xl mx-auto my-8 animate-in fade-in">
          <div className="w-16 h-16 rounded-3xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] flex items-center justify-center mx-auto shadow-inner">
            <Clock className="w-8 h-8 text-[#34D399]" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[11px] font-mono font-bold uppercase tracking-wider">
              <span>Second Year • Semester {selectedSemester}</span>
            </div>
            <h3 className="font-extrabold text-[#F0FDF4] text-2xl sm:text-3xl tracking-tight">
              Notes to be added soon
            </h3>
            <p className="text-xs sm:text-sm text-[#86998A] max-w-md mx-auto leading-relaxed">
              Curated module PPTs, handwritten faculty notes, solved PYQs, and reference books for Second Year are currently being compiled.
            </p>
          </div>

          <div className="pt-3">
            <button
              onClick={() => {
                setSelectedYear(1);
                setSelectedSemester(1);
                setSelectedSubjectId(null);
                setSelectedModuleId('all');
              }}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs transition shadow-lg shadow-emerald-950/40"
            >
              <span>Explore First Year Notes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <>

      {/* ========================================================================= */}
      {/* 📚 LEVEL 1 VIEW: SUBJECT GALLERY (Obsidian & Electric Mint)                 */}
      {/* ========================================================================= */}
      {!selectedSubjectId ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Quick Search */}
          <div className="relative bg-[#0F1410]/80 backdrop-blur-md rounded-2xl p-2 border border-[#1C271E] shadow-sm max-w-3xl mx-auto flex items-center">
            <Search className="w-5 h-5 text-[#86998A] ml-3" />
            <input
              type="text"
              placeholder="Search across all courses by title, topic, formula, or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none px-4 py-2.5 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-[#86998A] hover:text-[#F0FDF4] mr-2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#F0FDF4] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
              <span>Semester {selectedSemester} Subjects Directory</span>
            </h2>
            <span className="text-xs text-[#86998A]">
              {availableSubjects.length} Core Subjects
            </span>
          </div>

          {/* Subject Cards Grid (Obsidian & Electric Mint) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableSubjects.map((sub) => {
              const subModules = modules.filter((m) => m.subjectId === sub.id);
              const subResources = resources.filter((r) => r.subjectId === sub.id);
              const IconComponent = (sub.iconName && ICON_MAP[sub.iconName]) || BookOpen;

              return (
                <div
                  key={sub.id}
                  onClick={() => handleSelectSubject(sub.id)}
                  className="bg-[#0F1410]/80 backdrop-blur-md border border-[#1C271E] hover:border-[#34D399] hover:bg-[#131A14] rounded-3xl p-6 group transition-all duration-200 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-lg"
                >
                  <div className="space-y-4">
                    {/* Header Row: Subject Icon, Code & Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#34D399] flex items-center justify-center shadow-md group-hover:scale-105 transition-transform flex-shrink-0 font-black">
                        <IconComponent className="w-6 h-6 text-[#34D399]" />
                      </div>

                      <div className="flex items-center space-x-1.5 flex-wrap justify-end">
                        <span className="px-2.5 py-0.5 rounded-lg bg-[#151D17] text-[11px] font-mono font-bold text-[#F0FDF4] border border-[#1C271E]">
                          {sub.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[10px] font-bold uppercase">
                          {sub.category || 'Core'}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg bg-[#151D17] text-[#F0FDF4] border border-[#1C271E] text-[10px] font-bold">
                          {sub.credits} Credits
                        </span>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="text-lg font-bold text-[#F0FDF4] group-hover:text-[#34D399] transition leading-snug">
                        {sub.name}
                      </h3>
                      <p className="text-xs text-[#86998A] mt-1.5 line-clamp-2 leading-relaxed">
                        {sub.description}
                      </p>
                    </div>

                    {/* Modules Topic Preview Chips */}
                    {subModules.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {subModules.slice(0, 3).map((m) => (
                          <span
                            key={m.id}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-[#151D17] text-[#86998A] border border-[#1C271E] truncate max-w-[140px]"
                          >
                            M{m.moduleNumber}: {m.title.split(' ')[0]} {m.title.split(' ')[1] || ''}
                          </span>
                        ))}
                        {subModules.length > 3 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#151D17] text-[#86998A] font-mono">
                            +{subModules.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Action Footer */}
                  <div className="pt-5 mt-4 border-t border-[#1C271E] flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-[11px] text-[#86998A] font-medium">
                      <span className="flex items-center space-x-1">
                        <FolderOpen className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{subModules.length} Modules</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>{subResources.length} Materials</span>
                      </span>
                    </div>

                    <div className="text-xs font-bold text-[#34D399] group-hover:translate-x-1 transition-all flex items-center space-x-1">
                      <span>Open Course</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 📖 LEVEL 2 & 3 VIEW: SUBJECT EXPLORER & STRICT MODULE-WISE NOTES GROUPING  */
        /* ========================================================================= */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Subject Top Banner Card */}
          <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-3xl shadow-sm relative overflow-hidden border border-[#1C271E]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToSubjects}
                  className="p-3 rounded-2xl bg-[#151D17] hover:bg-[#1C271E] text-[#86998A] hover:text-[#F0FDF4] transition flex-shrink-0"
                  title="Back to All Subjects"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>

                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-[#151D17] text-[#F0FDF4] font-mono text-[10px] font-bold border border-[#1C271E]">
                      {activeSubject?.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[10px] font-bold uppercase">
                      {activeSubject?.category} Category
                    </span>
                    <span className="text-[11px] text-[#86998A]">
                      {activeSubject?.credits} Credits ({activeSubject?.theoryCredits}L + {activeSubject?.tutorialCredits}T)
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#F0FDF4] tracking-tight">
                    {activeSubject?.name}
                  </h2>
                </div>
              </div>

              {/* Quick Subject Switcher Dropdown */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#86998A] hidden sm:inline">Switch Subject:</span>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => handleSelectSubject(e.target.value)}
                  className="bg-[#151D17] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                >
                  {availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 🏷️ Module Navigation */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-1">
              <span className="font-bold text-[#F0FDF4] uppercase tracking-wider text-[11px] flex items-center space-x-2">
                <FolderOpen className="w-4 h-4 text-[#10B981]" />
                <span>Modules & Syllabus Units:</span>
              </span>
              <span className="text-[#86998A] text-[11px]">
                {activeSubjectModules.length} Modules in Syllabus
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {activeSubjectModules.map((m) => {
                const isSelected = !isGeneralActive && currentModule?.id === m.id;
                const modCount = resources.filter((r) => {
                  if (r.subjectId !== activeSubject?.id) return false;
                  return r.moduleId === m.id || resolveResourceModuleId(r) === m.id;
                }).length;

                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModuleId(m.id);
                      setSelectedType('notes');
                    }}
                    className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between space-y-2.5 group relative shadow-sm ${
                      isSelected
                        ? 'bg-[#151D17] border-[#10B981] ring-2 ring-[#10B981]/20'
                        : 'bg-[#0F1410] border-[#1C271E] hover:border-[#34D399] text-[#86998A]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                          isSelected
                            ? 'bg-[#10B981] text-black shadow-sm'
                            : 'bg-[#151D17] text-[#86998A] group-hover:text-[#34D399]'
                        }`}
                      >
                        Module {m.moduleNumber}
                      </span>
                      {m.weightageMarks && (
                        <span className="text-[10px] font-mono bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-semibold px-1.5 py-0.2 rounded">
                          {m.weightageMarks}M
                        </span>
                      )}
                    </div>

                    <h4
                      className={`text-xs font-bold leading-snug line-clamp-2 transition ${
                        isSelected ? 'text-[#34D399]' : 'text-[#F0FDF4] group-hover:text-[#34D399]'
                      }`}
                      title={m.title}
                    >
                      {m.title}
                    </h4>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1C271E] text-[#86998A]">
                      <span>Materials</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                          isSelected ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30' : 'bg-[#151D17] text-[#86998A]'
                        }`}
                      >
                        {modCount}
                      </span>
                    </div>
                  </button>
                );
              })}

              {unmappedSubjectResources.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedModuleId('general');
                    setSelectedType('notes');
                  }}
                  className={`p-3.5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between space-y-2.5 group relative shadow-sm ${
                    isGeneralActive
                      ? 'bg-[#151D17] border-[#10B981] ring-2 ring-[#10B981]/20'
                      : 'bg-[#0F1410] border-[#1C271E] hover:border-[#34D399] text-[#86998A]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider ${
                        isGeneralActive
                          ? 'bg-[#10B981] text-black shadow-sm'
                          : 'bg-[#151D17] text-[#86998A] group-hover:text-[#34D399]'
                      }`}
                    >
                      Course-Wide
                    </span>
                  </div>

                  <h4
                    className={`text-xs font-bold leading-snug line-clamp-2 transition ${
                      isGeneralActive ? 'text-[#34D399]' : 'text-[#F0FDF4] group-hover:text-[#34D399]'
                    }`}
                  >
                    General & Reference
                  </h4>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[#1C271E] text-[#86998A]">
                    <span>Materials</span>
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-full text-[10px] ${
                        isGeneralActive ? 'bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30' : 'bg-[#151D17] text-[#86998A]'
                      }`}
                    >
                      {unmappedSubjectResources.length}
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* 📑 Resource Type Buttons for Selected Module (Notes, Formulas, PYQs, etc.) */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {activeSectionTypeTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedType === tab.type;
              return (
                <button
                  key={tab.type}
                  onClick={() => setSelectedType(tab.type)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition flex-shrink-0 border ${
                    isSelected
                      ? 'bg-[#10B981] text-black border-[#10B981] font-bold shadow-sm'
                      : 'bg-[#0F1410] text-[#86998A] border-[#1C271E] hover:border-[#34D399] hover:text-[#F0FDF4]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-black' : 'text-[#34D399]'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-black/20 text-black font-bold' : 'bg-[#151D17] text-[#86998A]'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Row & Layout Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#86998A]">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-[#86998A] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={`Search in ${isGeneralActive ? 'Course Reference' : `Mod ${currentModule?.moduleNumber}`}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0F1410] border border-[#1C271E] rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
              />
            </div>

            <div className="flex items-center justify-between w-full sm:w-auto">
              <span>
                Showing <strong>{displayedModuleResources.length}</strong> material{displayedModuleResources.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* 🗂️ ACTIVE MODULE / SECTION RESOURCE LIST                                  */}
          {/* ======================================================================= */}
          <div className="space-y-4 rounded-3xl p-5 sm:p-6 bg-[#0F1410]/80 backdrop-blur-md border border-[#1C271E] shadow-sm">
            {/* Active Module / Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1C271E]">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#10B981] text-black font-mono text-xs font-bold shadow-sm">
                    {isGeneralActive ? 'Course-Wide' : `Module ${currentModule?.moduleNumber}`}
                  </span>
                  {!isGeneralActive && currentModule?.weightageMarks && (
                    <span className="px-2 py-0.5 rounded-md bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 text-[10px] font-bold">
                      {currentModule.weightageMarks} Marks
                    </span>
                  )}
                  <span className="text-xs text-[#86998A] font-mono">
                    ({displayedModuleResources.length} {displayedModuleResources.length === 1 ? 'material' : 'materials'})
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#F0FDF4]">
                  {isGeneralActive ? 'General & Course-Wide Reference' : currentModule?.title}
                </h3>
                {!isGeneralActive && currentModule?.topics && currentModule.topics.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentModule.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#151D17] text-[#86998A] border border-[#1C271E]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resources List for Active Module */}
            {displayedModuleResources.length === 0 ? (
              <div className="p-12 text-center text-[#86998A] border border-dashed border-[#1C271E] rounded-2xl space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-[#627766]" />
                <h4 className="font-bold text-[#F0FDF4] text-sm">No {selectedType.replace('_', ' ')} found in this module</h4>
                <p className="text-xs text-[#86998A] max-w-sm mx-auto">
                  There are currently no {selectedType.replace('_', ' ')} uploaded for this module.
                </p>
                <div className="pt-2">
                  <Link
                    href="/admin/upload"
                    className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-sm transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload to {activeSubject?.code}</span>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {displayedModuleResources.map((res) => (
                  <div key={res.id} className="relative group">
                    <ResourceCard
                      resource={res}
                      siblingResources={displayedModuleResources}
                      subjectName={activeSubject?.name}
                      moduleName={isGeneralActive ? 'Course-Wide Reference' : `Mod ${currentModule?.moduleNumber}: ${currentModule?.title}`}
                      subjects={subjects}
                      modules={modules}
                      onUpdate={loadData}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      </>
      )}

      {/* Credit Scheme Structure Modal */}
      <CreditSchemeModal
        isOpen={isCreditSchemeOpen}
        onClose={() => setIsCreditSchemeOpen(false)}
        semester={selectedSemester === 2 ? 2 : 1}
        subjects={subjects}
        onSemesterChange={(sem) => {
          setSelectedSemester(sem);
          setSelectedSubjectId(null);
          setSelectedModuleId('all');
        }}
      />
    </div>
  );
}
