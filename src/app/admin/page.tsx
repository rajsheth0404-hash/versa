'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  FolderTree,
  UploadCloud,
  FileCode2,
  BookOpen,
  CheckCircle2,
  ArrowRight,
  Plus,
  Edit2,
  Trash2,
  X,
  Award,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { Subject, Module, AcademicResource, ResourceType } from '@/lib/types';
import CreditSchemeModal from '@/components/CreditSchemeModal';

export default function AdminDashboardPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);

  // Edit Resource State
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editType, setEditType] = useState<ResourceType>('notes');
  const [editSubjectId, setEditSubjectId] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editDownloads, setEditDownloads] = useState(0);
  const [editIsVerified, setEditIsVerified] = useState(true);

  // Credit Scheme Modal State
  const [isCreditSchemeOpen, setIsCreditSchemeOpen] = useState(false);

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
  };

  const sem1Count = subjects.filter((s) => s.semester === 1).length;
  const sem2Count = subjects.filter((s) => s.semester === 2).length;
  const sem1Credits = subjects.filter((s) => s.semester === 1).reduce((sum, s) => sum + (s.credits || 0), 0);
  const sem2Credits = subjects.filter((s) => s.semester === 2).reduce((sum, s) => sum + (s.credits || 0), 0);

  const stats = [
    { label: 'Sem 1 Subjects', count: `${sem1Count} (${sem1Credits} Cr)`, icon: BookOpen, color: 'text-[#34D399]', bg: 'bg-[#10B981]/15 border border-[#10B981]/30' },
    { label: 'Sem 2 Subjects', count: `${sem2Count} (${sem2Credits} Cr)`, icon: BookOpen, color: 'text-[#A3E635]', bg: 'bg-[#A3E635]/15 border border-[#A3E635]/30' },
    { label: 'Curriculum Modules', count: modules.length, icon: Layers, color: 'text-[#34D399]', bg: 'bg-[#10B981]/15 border border-[#10B981]/30' },
    { label: 'Ingested Resources', count: resources.length, icon: UploadCloud, color: 'text-[#10B981]', bg: 'bg-[#10B981]/15 border border-[#10B981]/30' },
  ];

  const handleOpenEdit = (res: AcademicResource) => {
    setEditingResource(res);
    setEditTitle(res.title);
    setEditType(res.type);
    setEditSubjectId(res.subjectId);
    setEditTags(Array.isArray(res.tags) ? res.tags.join(', ') : '');
    setEditDownloads(res.downloadsCount || 0);
    setEditIsVerified(res.isVerified);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;

    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    HubStore.updateResource(editingResource.id, {
      title: editTitle,
      type: editType,
      subjectId: editSubjectId,
      tags: tagsArray,
      downloadsCount: Number(editDownloads),
      isVerified: editIsVerified,
    });

    setEditingResource(null);
  };

  const handleDeleteResource = (id: string) => {
    HubStore.deleteResource(id);
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#34D399]">
              Admin Control Center & Studio Panel
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight mt-1">
            Curriculum & Resource Management Studio
          </h1>
          <p className="text-xs text-[#86998A] mt-1">
            Upload notes, edit ingested resources, configure credit schemes, or decompose raw syllabi with AI.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsCreditSchemeOpen(true)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 hover:bg-[#10B981]/25 text-xs font-semibold shadow-md transition"
          >
            <Award className="w-4 h-4 text-[#10B981]" />
            <span>Credit Scheme</span>
          </button>

          <Link
            href="/admin/upload"
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold shadow-lg shadow-[#10B981]/20 transition"
          >
            <Plus className="w-4 h-4 text-black" />
            <span>Upload New Resource</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, idx) => {
          const Icon = st.icon;
          return (
            <div
              key={idx}
              className="bg-[#0F1410]/80 backdrop-blur-md p-5 rounded-2xl border border-[#1C271E] flex flex-col justify-between space-y-2 shadow-lg hover:border-[#2B3C2E] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#86998A]">{st.label}</span>
                <div className={`p-2 rounded-xl ${st.bg} ${st.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-extrabold text-[#F0FDF4]">{st.count}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Action Workflows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: AI Syllabus Parser */}
        <Link
          href="/admin/syllabus-parser"
          className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-2xl border border-[#1C271E] group hover:border-[#10B981]/50 hover:bg-[#131A14] flex flex-col justify-between transition-all shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileCode2 className="w-6 h-6" />
            </div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-[#F0FDF4] text-base">AI Syllabus Parser</h3>
              <span className="text-[9px] px-2 py-0.5 rounded bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 font-bold uppercase">
                Gemini
              </span>
            </div>
            <p className="text-xs text-[#86998A] mt-2 leading-relaxed">
              Paste raw syllabus text. Gemini will auto-generate subjects, modules, topics, and credits in seconds.
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs font-semibold text-[#34D399] group-hover:translate-x-1 transition-transform">
            <span>Launch AI Parser</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* Card 2: Visual Resource Ingestion */}
        <Link
          href="/admin/upload"
          className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-2xl border border-[#1C271E] group hover:border-[#34D399]/50 hover:bg-[#131A14] flex flex-col justify-between transition-all shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#F0FDF4] text-base">Resource Ingestion</h3>
            <p className="text-xs text-[#86998A] mt-2 leading-relaxed">
              Upload notes, slides, and PYQs for Sem 1 and Sem 2 with metadata classification presets.
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs font-semibold text-[#34D399] group-hover:translate-x-1 transition-transform">
            <span>Upload & Manage Notes</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>

        {/* Card 3: Curriculum Hierarchy Builder */}
        <Link
          href="/admin/hierarchy"
          className="bg-[#0F1410]/80 backdrop-blur-md p-6 rounded-2xl border border-[#1C271E] group hover:border-amber-500/50 hover:bg-[#131A14] flex flex-col justify-between transition-all shadow-xl"
        >
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FolderTree className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-[#F0FDF4] text-base">Curriculum & Credits</h3>
            <p className="text-xs text-[#86998A] mt-2 leading-relaxed">
              Manage Sem 1 & Sem 2 subjects, course categories, credits, and module breakdowns.
            </p>
          </div>

          <div className="mt-4 flex items-center text-xs font-semibold text-amber-300 group-hover:translate-x-1 transition-transform">
            <span>Manage Structure</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </Link>
      </div>

      {/* Recent Ingested Resources Table with Live Edit Buttons */}
      <div className="bg-[#0F1410]/80 backdrop-blur-md rounded-2xl border border-[#1C271E] overflow-hidden shadow-2xl">
        <div className="p-6 bg-[#080A08]/80 border-b border-[#1C271E] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-[#F0FDF4] text-base">Ingested Resources in Studio</h3>
            <p className="text-xs text-[#86998A] mt-0.5">
              Edit title, change course assignment, or remove materials directly from the table.
            </p>
          </div>

          <Link
            href="/admin/upload"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black text-xs font-bold transition shadow-md"
          >
            <Plus className="w-3.5 h-3.5 text-black" />
            <span>New Upload</span>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#080A08]/90 text-[#86998A] font-semibold border-b border-[#1C271E]">
              <tr>
                <th className="p-4 pl-6">Resource Title</th>
                <th className="p-4">Type</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Semester</th>
                <th className="p-4">Downloads</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C271E] text-[#86998A]">
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#86998A]">
                    No resources uploaded yet. Click &quot;New Upload&quot; to add materials.
                  </td>
                </tr>
              ) : (
                resources.map((res) => {
                  const sub = subjects.find((s) => s.id === res.subjectId);
                  return (
                    <tr key={res.id} className="hover:bg-[#151D17]/50 transition group">
                      <td className="p-4 pl-6 font-semibold truncate max-w-[260px] text-[#F0FDF4]">
                        {res.title}
                      </td>
                      <td className="p-4 uppercase text-[10px] font-bold text-[#34D399]">
                        {res.type}
                      </td>
                      <td className="p-4 text-[#86998A] truncate max-w-[160px]">
                        {sub?.name || 'Course'}
                      </td>
                      <td className="p-4 font-mono font-medium text-[#86998A]">
                        Sem {sub?.semester || 1}
                      </td>
                      <td className="p-4 font-mono font-medium text-[#10B981]">
                        {res.downloadsCount || 0}
                      </td>
                      {/* Action Buttons: Edit & Delete */}
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            onClick={() => handleOpenEdit(res)}
                            className="p-1.5 rounded-lg bg-[#080A08] text-[#86998A] hover:text-[#F0FDF4] hover:bg-[#151D17] border border-[#1C271E] transition"
                            title="Edit Resource Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteResource(res.id)}
                            className="p-1.5 rounded-lg bg-[#080A08] text-[#86998A] hover:text-rose-400 hover:bg-rose-950/30 border border-[#1C271E] transition"
                            title="Delete Resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Resource Modal */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <h3 className="font-bold text-[#F0FDF4] text-base">Edit Resource Metadata</h3>
              <button onClick={() => setEditingResource(null)} className="text-[#86998A] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="text-[#86998A] block mb-1">Resource Title *</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as ResourceType)}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  >
                    <option value="notes">Notes</option>
                    <option value="ppt">Notes (PPT)</option>
                    <option value="practice_ques">Practice Questions</option>
                    <option value="pyq">PYQ / Question Bank</option>
                    <option value="formula_sheet">Formula Sheet</option>
                    <option value="pdf">Reference Book</option>
                    <option value="syllabus">Syllabus Copy</option>
                  </select>
                </div>

                <div>
                  <label className="text-[#86998A] block mb-1">Assigned Subject</label>
                  <select
                    value={editSubjectId}
                    onChange={(e) => setEditSubjectId(e.target.value)}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.code} - {sub.name.slice(0, 20)}...
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="e.g. Maths1, Matrices, InSem"
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#86998A] block mb-1">Download Count</label>
                  <input
                    type="number"
                    min="0"
                    value={editDownloads}
                    onChange={(e) => setEditDownloads(Number(e.target.value))}
                    className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] focus:outline-none focus:border-[#10B981]"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-5">
                  <input
                    type="checkbox"
                    id="verifiedCheck"
                    checked={editIsVerified}
                    onChange={(e) => setEditIsVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#10B981] bg-[#080A08] border-[#1C271E]"
                  />
                  <label htmlFor="verifiedCheck" className="text-[#F0FDF4]">
                    Verified by Faculty
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#1C271E] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-xl bg-[#080A08] text-[#86998A] hover:text-white border border-[#1C271E]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold shadow-lg shadow-[#10B981]/20"
                >
                  Save Changes
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
        semester={1}
        subjects={subjects}
        onSemesterChange={() => {}}
      />
    </div>
  );
}
