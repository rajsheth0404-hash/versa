'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HubStore } from '@/lib/store';
import { Subject, Module, Flashcard, MermaidDiagram } from '@/lib/types';
import MermaidViewer from '@/components/MermaidViewer';
import {
  Sparkles,
  Layers,
  Network,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminAiGeneratorPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [generationType, setGenerationType] = useState<'both' | 'flashcards' | 'diagram'>('both');

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFlashcards, setGeneratedFlashcards] = useState<Omit<Flashcard, 'id' | 'deckId'>[]>([]);
  const [generatedDiagram, setGeneratedDiagram] = useState<{ title: string; mermaidCode: string; explanation: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const subs = HubStore.getSubjects();
    setSubjects(subs);
    if (subs.length > 0) {
      setSelectedSubjectId(subs[0].id);
      const mods = HubStore.getModules(subs[0].id);
      setModules(mods);
      if (mods.length > 0) setSelectedModuleId(mods[0].id);
    }
  }, []);

  const handleSubjectChange = (subId: string) => {
    setSelectedSubjectId(subId);
    const mods = HubStore.getModules(subId);
    setModules(mods);
    if (mods.length > 0) setSelectedModuleId(mods[0].id);
    else setSelectedModuleId('');
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) return;

    setIsGenerating(true);
    setSavedSuccess(false);

    const sub = subjects.find((s) => s.id === selectedSubjectId);
    const mod = modules.find((m) => m.id === selectedModuleId);

    try {
      const res = await fetch('/api/ai/generate-study-pack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subjectName: sub?.name || 'Computer Course',
          moduleTitle: mod?.title || 'Advanced Computing Concepts',
          topics: mod?.topics || [mod?.title || 'Core Foundations'],
          type: generationType,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Generation failed');

      if (json.data.flashcards) setGeneratedFlashcards(json.data.flashcards);
      if (json.data.diagram) setGeneratedDiagram(json.data.diagram);
      if (json.data.mermaidCode) setGeneratedDiagram(json.data);
    } catch (err) {
      console.error('Error generating AI study pack:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveToRepository = () => {
    const sub = subjects.find((s) => s.id === selectedSubjectId);
    const mod = modules.find((m) => m.id === selectedModuleId);

    // Save Deck
    if (generatedFlashcards.length > 0) {
      HubStore.addFlashcardDeck({
        subjectId: selectedSubjectId,
        moduleId: selectedModuleId || undefined,
        title: `${sub?.name.split('(')[0] || 'Course'}: ${mod?.title.slice(0, 30) || 'Core Review'} Deck`,
        cards: generatedFlashcards.map((c, idx) => ({
          ...c,
          id: `card-${Date.now()}-${idx}`,
          deckId: `deck-${Date.now()}`,
        })),
      });
    }

    // Save Diagram
    if (generatedDiagram) {
      HubStore.addDiagram({
        subjectId: selectedSubjectId,
        moduleId: selectedModuleId || undefined,
        title: generatedDiagram.title,
        diagramType: 'flowchart',
        mermaidCode: generatedDiagram.mermaidCode,
        explanation: generatedDiagram.explanation,
      });
    }

    setSavedSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366F1', '#38BDF8', '#D4AF37'],
    });

    setTimeout(() => {
      router.push('/ai-study');
    }, 1800);
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentModule = modules.find((m) => m.id === selectedModuleId);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            Gemini Flash AI Synthesis Studio
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
          Synthesize Flashcards & Mermaid.js Flowcharts
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Select any course module to generate high-yield active recall flashcards and interactive architectural diagrams.
        </p>
      </div>

      {/* Synthesis Form */}
      <form onSubmit={handleGenerate} className="bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-slate-700/80 space-y-6 shadow-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Target Subject *</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code} - {s.name.split('(')[0]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Module / Unit (Optional)</label>
            <select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8]"
            >
              <option value="">General Subject Topics</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  Mod {m.moduleNumber}: {m.title.slice(0, 25)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Generation Type Radio Buttons */}
        <div>
          <label className="text-[11px] text-slate-400 block mb-2 font-medium">Generation Objective</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'both', label: 'Complete Study Pack (Both)', icon: Zap, desc: 'Flashcards + Mermaid Flowchart' },
              { id: 'flashcards', label: 'Flashcards Only', icon: Layers, desc: '5 Active Recall Exam Cards' },
              { id: 'diagram', label: 'Mermaid Diagram Only', icon: Network, desc: 'Visual Process / Architecture' },
            ].map((opt) => {
              const Icon = opt.icon;
              const isSelected = generationType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setGenerationType(opt.id as any)}
                  className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#38BDF8]/15 border-[#38BDF8]/50 text-[#F8FAFC] shadow-lg shadow-cyan-950/40'
                      : 'bg-[#0F172A] border-slate-700 text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-[#38BDF8]' : 'text-slate-500'}`} />
                  <div>
                    <p className="font-semibold text-xs text-[#F8FAFC]">{opt.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-700/80 flex justify-end">
          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs shadow-xl shadow-cyan-950/40 transition disabled:opacity-40"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            <span>{isGenerating ? 'Synthesizing with Gemini Flash...' : 'Synthesize Study Pack'}</span>
          </button>
        </div>
      </form>

      {/* Generated Artifacts Preview */}
      {(generatedFlashcards.length > 0 || generatedDiagram) && (
        <div className="bg-[#1E293B] p-6 sm:p-8 rounded-3xl border border-[#38BDF8]/30 space-y-6 shadow-2xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-700/80">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#38BDF8]/15 text-[#38BDF8] font-bold uppercase border border-[#38BDF8]/30">
                AI Synthesis Complete
              </span>
              <h3 className="text-xl font-bold text-[#F8FAFC] mt-1">
                Generated Pack: {currentSubject?.name.split('(')[0]}
              </h3>
              <p className="text-xs text-slate-400">
                {generatedFlashcards.length} Flashcards • {generatedDiagram ? '1 Mermaid Flowchart' : '0 Diagrams'}
              </p>
            </div>

            <button
              onClick={handleSaveToRepository}
              disabled={savedSuccess}
              className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-xl shadow-emerald-950/50 transition"
            >
              {savedSuccess ? <CheckCircle2 className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved! Redirecting...' : 'Save to Student Hub Repository'}</span>
            </button>
          </div>

          {/* Flashcards Preview */}
          {generatedFlashcards.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#818CF8]" />
                <span>Generated Flashcards ({generatedFlashcards.length})</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generatedFlashcards.map((c, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#0F172A] border border-slate-700/80 space-y-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#818CF8]/15 text-[#818CF8] font-bold border border-[#818CF8]/30">
                      Q#{idx + 1} ({c.difficulty.toUpperCase()})
                    </span>
                    <p className="font-semibold text-xs text-[#F8FAFC]">{c.front}</p>
                    <p className="text-[11px] text-slate-300 bg-[#1E293B] p-2.5 rounded-xl border border-slate-700/80 leading-relaxed">
                      {c.back}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Diagram Preview */}
          {generatedDiagram && (
            <div className="space-y-3 pt-4 border-t border-slate-700/80">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-2">
                <Network className="w-4 h-4 text-[#38BDF8]" />
                <span>Interactive Mermaid.js Diagram</span>
              </h4>

              <p className="text-xs text-slate-400">{generatedDiagram.explanation}</p>
              <MermaidViewer code={generatedDiagram.mermaidCode} title={generatedDiagram.title} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
