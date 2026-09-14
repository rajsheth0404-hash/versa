'use client';

import React, { useState, useEffect } from 'react';
import { HubStore } from '@/lib/store';
import { Subject, FlashcardDeck, MermaidDiagram } from '@/lib/types';
import FlashcardReview from '@/components/FlashcardReview';
import MermaidViewer from '@/components/MermaidViewer';
import {
  Sparkles,
  Layers,
  Network,
  BookOpen,
  Plus,
  RefreshCw,
  Zap,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import Link from 'next/link';

export default function AiStudyPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [decks, setDecks] = useState<FlashcardDeck[]>([]);
  const [selectedDeckId, setSelectedDeckId] = useState<string>('');
  const [diagrams, setDiagrams] = useState<MermaidDiagram[]>([]);
  const [selectedDiagramId, setSelectedDiagramId] = useState<string>('');

  const [activeTab, setActiveTab] = useState<'flashcards' | 'diagrams'>('flashcards');

  // Edit Deck State
  const [editingDeck, setEditingDeck] = useState<FlashcardDeck | null>(null);

  // Edit Diagram State
  const [editingDiagram, setEditingDiagram] = useState<MermaidDiagram | null>(null);

  useEffect(() => {
    const subs = HubStore.getSubjects();
    setSubjects(subs);
    if (subs.length > 0) {
      setSelectedSubjectId(subs[0].id);
      loadSubjectAiContent(subs[0].id);
    }

    const handleUpdate = () => {
      const updatedSubs = HubStore.getSubjects();
      setSubjects(updatedSubs);
      if (selectedSubjectId) loadSubjectAiContent(selectedSubjectId);
    };
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const loadSubjectAiContent = (subId: string) => {
    const subDecks = HubStore.getFlashcardDecks(subId);
    setDecks(subDecks);
    if (subDecks.length > 0) setSelectedDeckId(subDecks[0].id);
    else setSelectedDeckId('');

    const subDiags = HubStore.getDiagrams(subId);
    setDiagrams(subDiags);
    if (subDiags.length > 0) setSelectedDiagramId(subDiags[0].id);
    else setSelectedDiagramId('');
  };

  const handleSubjectChange = (subId: string) => {
    setSelectedSubjectId(subId);
    loadSubjectAiContent(subId);
  };

  const handleSaveDeckEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeck) return;

    HubStore.updateFlashcardDeck(editingDeck.id, {
      title: editingDeck.title,
      description: editingDeck.description,
    });
    setEditingDeck(null);
    loadSubjectAiContent(selectedSubjectId);
  };

  const handleSaveDiagramEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDiagram) return;

    HubStore.updateDiagram(editingDiagram.id, {
      title: editingDiagram.title,
      explanation: editingDiagram.explanation,
    });
    setEditingDiagram(null);
    loadSubjectAiContent(selectedSubjectId);
  };

  const currentSubject = subjects.find((s) => s.id === selectedSubjectId);
  const currentDeck = decks.find((d) => d.id === selectedDeckId) || decks[0];
  const currentDiagram = diagrams.find((d) => d.id === selectedDiagramId) || diagrams[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
              Gemini Flash Engine
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F8FAFC] tracking-tight mt-1">
            Interactive AI Study Deck & Flowchart Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Revise key course formulas, memory checkpoints, and engineering workflow diagrams.
          </p>
        </div>

        <Link
          href="/admin/ai-generator"
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 text-xs font-bold shadow-lg shadow-cyan-950/40 transition"
        >
          <Sparkles className="w-4 h-4" />
          <span>Synthesize with Gemini</span>
        </Link>
      </div>

      {/* Subject Selector & View Tabs */}
      <div className="bg-[#1E293B] p-6 rounded-3xl border border-slate-700/80 space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Subject dropdown */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <BookOpen className="w-4 h-4 text-[#38BDF8] flex-shrink-0" />
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              className="bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-xs text-[#F8FAFC] focus:outline-none focus:border-[#38BDF8] w-full sm:w-72"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  Sem {s.semester}: {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex p-1 rounded-2xl bg-[#0F172A] border border-slate-700/80 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'flashcards'
                  ? 'bg-[#38BDF8] text-slate-950 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcard Decks ({decks.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('diagrams')}
              className={`flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold transition ${
                activeTab === 'diagrams'
                  ? 'bg-[#818CF8] text-slate-950 shadow-md shadow-indigo-950/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Flowcharts & Mindmaps ({diagrams.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tab 1: Flashcards */}
      {activeTab === 'flashcards' && (
        <div className="space-y-6">
          {decks.length > 0 && currentDeck ? (
            <div className="space-y-4">
              {/* Deck Selector Header & Edit Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-2xl bg-[#1E293B] border border-slate-700/80">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-[#F8FAFC]">{currentDeck.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#0F172A] text-[#38BDF8] font-mono border border-slate-700">
                    {currentDeck.cards.length} cards
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingDeck(currentDeck)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
                    title="Edit Deck Name"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>Edit Deck Name</span>
                  </button>
                </div>
              </div>

              {decks.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {decks.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setSelectedDeckId(d.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                        selectedDeckId === d.id
                          ? 'bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/40'
                          : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700/80'
                      }`}
                    >
                      {d.title}
                    </button>
                  ))}
                </div>
              )}

              <FlashcardReview cards={currentDeck.cards} deckTitle={currentDeck.title} />
            </div>
          ) : (
            <div className="bg-[#1E293B] p-16 rounded-3xl text-center text-slate-400 border border-slate-700/80 max-w-xl mx-auto">
              <Layers className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="font-bold text-[#F8FAFC] text-base">No flashcard decks for this subject yet</h3>
              <p className="text-xs text-slate-400 mt-1">
                Generate tailored exam cards using Gemini Flash in the Admin Synthesizer studio.
              </p>
              <Link
                href="/admin/ai-generator"
                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-950/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Synthesize with Gemini</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Mermaid.js Diagrams */}
      {activeTab === 'diagrams' && (
        <div className="space-y-6">
          {diagrams.length > 0 && currentDiagram ? (
            <div className="space-y-4">
              {/* Diagram Header & Edit Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 rounded-2xl bg-[#1E293B] border border-slate-700/80">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-[#F8FAFC]">{currentDiagram.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#818CF8]/15 text-[#818CF8] font-mono border border-[#818CF8]/30">
                    {currentDiagram.diagramType}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingDiagram(currentDiagram)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition"
                    title="Edit Diagram Title"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#818CF8]" />
                    <span>Edit Diagram Name</span>
                  </button>
                </div>
              </div>

              {diagrams.length > 1 && (
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {diagrams.map((diag) => (
                    <button
                      key={diag.id}
                      onClick={() => setSelectedDiagramId(diag.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                        selectedDiagramId === diag.id
                          ? 'bg-[#818CF8]/15 text-[#818CF8] border border-[#818CF8]/40'
                          : 'bg-[#1E293B] text-slate-400 hover:text-white border border-slate-700/80'
                      }`}
                    >
                      {diag.title}
                    </button>
                  ))}
                </div>
              )}

              {/* Explanation Card */}
              {currentDiagram.explanation && (
                <div className="bg-[#1E293B] p-4 rounded-2xl border border-slate-700/80 text-xs text-slate-300 flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-[#818CF8]/15 text-[#818CF8] flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#F8FAFC] text-xs">{currentDiagram.title}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{currentDiagram.explanation}</p>
                  </div>
                </div>
              )}

              <MermaidViewer code={currentDiagram.mermaidCode} title={currentDiagram.title} />
            </div>
          ) : (
            <div className="bg-[#1E293B] p-16 rounded-3xl text-center text-slate-400 border border-slate-700/80 max-w-xl mx-auto">
              <Network className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h3 className="font-bold text-[#F8FAFC] text-base">No diagrams created for this subject</h3>
              <p className="text-xs text-slate-400 mt-1">
                Synthesize high-resolution Mermaid architecture flowcharts with Gemini Flash.
              </p>
              <Link
                href="/admin/ai-generator"
                className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] text-slate-950 font-bold text-xs shadow-lg shadow-indigo-950/40"
              >
                <Sparkles className="w-4 h-4" />
                <span>Create Mermaid Diagram</span>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Edit Deck Modal */}
      {editingDeck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1E293B] w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-[#F8FAFC] text-base">Edit Flashcard Deck Name</h3>
              <button onClick={() => setEditingDeck(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDeckEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Deck Title *</label>
                <input
                  type="text"
                  value={editingDeck.title}
                  onChange={(e) => setEditingDeck({ ...editingDeck, title: e.target.value })}
                  required
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingDeck.description || ''}
                  onChange={(e) => setEditingDeck({ ...editingDeck, description: e.target.value })}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingDeck(null)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold shadow-lg"
                >
                  Save Deck Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Diagram Modal */}
      {editingDiagram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#1E293B] w-full max-w-md rounded-3xl border border-slate-700 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <h3 className="font-bold text-[#F8FAFC] text-base">Edit Flowchart / Diagram Name</h3>
              <button onClick={() => setEditingDiagram(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDiagramEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Diagram Title *</label>
                <input
                  type="text"
                  value={editingDiagram.title}
                  onChange={(e) => setEditingDiagram({ ...editingDiagram, title: e.target.value })}
                  required
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Explanation</label>
                <textarea
                  rows={3}
                  value={editingDiagram.explanation || ''}
                  onChange={(e) => setEditingDiagram({ ...editingDiagram, explanation: e.target.value })}
                  className="w-full bg-[#0F172A] border border-slate-700 rounded-xl px-3 py-2 text-[#F8FAFC]"
                />
              </div>

              <div className="pt-3 border-t border-slate-700 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingDiagram(null)}
                  className="px-4 py-2 rounded-xl bg-[#0F172A] text-slate-300 hover:text-white border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#818CF8] hover:bg-[#6366F1] text-slate-950 font-bold shadow-lg"
                >
                  Save Diagram Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
