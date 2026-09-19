'use client';

import React, { useState, useEffect } from 'react';
import { HubStore } from '@/lib/store';
import { Subject, Module, AcademicResource, ResourceType } from '@/lib/types';
import { storeUploadedFile, fileToDataUrl } from '@/lib/file-storage';
import FileDropzone from '@/components/FileDropzone';
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  Presentation,
  FileCode,
  FileCheck,
  Layers,
  Edit2,
  Settings2,
  X,
  Link2,
  ExternalLink,
  FolderPlus,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AdminUploadPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [resources, setResources] = useState<AcademicResource[]>([]);

  // Ingestion Mode: Google Drive link vs Direct File Upload
  const [uploadMode, setUploadMode] = useState<'drive' | 'file'>('drive');
  const [driveLinkInput, setDriveLinkInput] = useState('');

  const [selectedSemester, setSelectedSemester] = useState<1 | 2>(1);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
  const [selectedModuleId, setSelectedModuleId] = useState<string>('');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [resourceTitle, setResourceTitle] = useState('');
  const [tagsInput, setTagsInput] = useState('Sem1, Lecture Notes, Official');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedCount, setPublishedCount] = useState<number | null>(null);

  // Metadata Customization State
  const [isEditMetadataOpen, setIsEditMetadataOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState('Faculty of Engineering');
  const [academicYear, setAcademicYear] = useState('2025-2026');
  const [isVerifiedResource, setIsVerifiedResource] = useState(true);
  const [customTagPresets, setCustomTagPresets] = useState<string[]>([
    'InSem Prep',
    'EndSem Revision',
    'Formula Sheet',
    'High Yield',
    'Solved PYQ',
    'Must Solve',
  ]);
  const [newTagInput, setNewTagInput] = useState('');

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('somaiya_store_updated', handleUpdate);
    return () => window.removeEventListener('somaiya_store_updated', handleUpdate);
  }, []);

  const loadData = () => {
    const subs = HubStore.getSubjects();
    setSubjects(subs);
    const filteredSubs = subs.filter((s) => s.semester === selectedSemester);
    if (filteredSubs.length > 0 && (!selectedSubjectId || !filteredSubs.some((s) => s.id === selectedSubjectId))) {
      setSelectedSubjectId(filteredSubs[0].id);
    }
    setModules(HubStore.getModules());
    setResources(HubStore.getResources());
  };

  const handleSemesterChange = (sem: 1 | 2) => {
    setSelectedSemester(sem);
    const filteredSubs = subjects.filter((s) => s.semester === sem);
    if (filteredSubs.length > 0) setSelectedSubjectId(filteredSubs[0].id);
    else setSelectedSubjectId('');
    setSelectedModuleId('');
  };

  const availableSubjects = subjects.filter((s) => s.semester === selectedSemester);
  const availableModules = modules.filter((m) => m.subjectId === selectedSubjectId);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(files);
    if (files.length > 0 && !resourceTitle) {
      const cleanName = files[0].name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setResourceTitle(cleanName);
    }
  };

  const handleAddTagPreset = (tag: string) => {
    const currentTags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      setTagsInput([...currentTags, tag].join(', '));
    }
  };

  const handleCreateNewTagPreset = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !customTagPresets.includes(newTagInput.trim())) {
      setCustomTagPresets([...customTagPresets, newTagInput.trim()]);
      setNewTagInput('');
    }
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubjectId) {
      alert('Please select a target subject.');
      return;
    }

    setIsPublishing(true);

    try {
      const tagsArray = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

      if (uploadMode === 'drive') {
        if (!driveLinkInput.trim()) {
          alert('Please enter a valid Google Drive link.');
          setIsPublishing(false);
          return;
        }

        HubStore.addResource({
          subjectId: selectedSubjectId,
          moduleId: selectedModuleId || undefined,
          title: resourceTitle || 'Google Drive Study Document',
          type: resourceType,
          filePath: driveLinkInput.trim(),
          fileName: 'Google Drive Document',
          fileSizeBytes: 2400000,
          fileMime: 'application/pdf',
          academicYear: academicYear,
          scheme: 'REV_2025',
          uploaderName: uploaderName,
          isVerified: isVerifiedResource,
          tags: tagsArray.length > 0 ? tagsArray : ['First Year', `Sem${selectedSemester}`, 'Google Drive'],
        });

        setIsPublishing(false);
        setPublishedCount(1);
        setDriveLinkInput('');
        setResourceTitle('');

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#A3E635'],
        });
      } else {
        if (selectedFiles.length === 0) {
          alert('Please select or drop at least one file.');
          setIsPublishing(false);
          return;
        }

        for (let index = 0; index < selectedFiles.length; index++) {
          const file = selectedFiles[index];

          const newRes = HubStore.addResource({
            subjectId: selectedSubjectId,
            moduleId: selectedModuleId || undefined,
            title: selectedFiles.length === 1 ? resourceTitle : `${resourceTitle} (Part ${index + 1})`,
            type: resourceType,
            filePath: `/uploads/${file.name}`,
            fileName: file.name,
            fileSizeBytes: file.size,
            fileMime: file.type || 'application/pdf',
            academicYear: academicYear,
            scheme: 'REV_2025',
            uploaderName: uploaderName,
            isVerified: isVerifiedResource,
            tags: tagsArray.length > 0 ? tagsArray : ['First Year', `Sem${selectedSemester}`],
          });

          await storeUploadedFile(newRes.id, file);
        }

        setIsPublishing(false);
        setPublishedCount(selectedFiles.length);
        setSelectedFiles([]);
        setResourceTitle('');

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#A3E635'],
        });
      }
    } catch (err) {
      console.error('Failed to upload resources:', err);
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl min-h-screen">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#34D399]">
            Admin Academic Repository Ingestion
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight mt-1">
          Upload & Manage First Year Resources
        </h1>
        <p className="text-xs text-[#86998A] mt-1">
          Upload lecture notes, PPTs, formula sheets, or PYQs for Semester 1 and Semester 2 courses.
        </p>
      </div>

      {/* Success Notification */}
      {publishedCount !== null && (
        <div className="bg-[#10B981]/15 p-4 rounded-2xl border border-[#10B981]/30 text-[#34D399] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center space-x-2 text-xs">
            <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
            <span>
              Successfully published <strong>{publishedCount}</strong> academic resource(s) to the live repository!
            </span>
          </div>
          <button
            onClick={() => setPublishedCount(null)}
            className="text-xs text-[#34D399] font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Ingestion Form */}
      <form onSubmit={handlePublish} className="bg-[#0F1410]/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-[#1C271E] space-y-6 shadow-sm">
        {/* Step 1: Semester & Subject Targeting */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#F0FDF4] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-black font-bold flex items-center justify-center text-[10px]">1</span>
              <span>Select Semester & Course Target</span>
            </h3>

            <div className="flex bg-[#080A08] p-1 rounded-xl border border-[#1C271E]">
              <button
                type="button"
                onClick={() => handleSemesterChange(1)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSemester === 1
                    ? 'bg-[#10B981] text-black font-bold shadow-sm'
                    : 'text-[#86998A] hover:text-[#F0FDF4]'
                }`}
              >
                Semester 1
              </button>
              <button
                type="button"
                onClick={() => handleSemesterChange(2)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  selectedSemester === 2
                    ? 'bg-[#10B981] text-black font-bold shadow-sm'
                    : 'text-[#86998A] hover:text-[#F0FDF4]'
                }`}
              >
                Semester 2
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Subject Picker */}
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1 font-medium">Target Subject *</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => {
                  setSelectedSubjectId(e.target.value);
                  setSelectedModuleId('');
                }}
                required
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
              >
                {availableSubjects.length === 0 ? (
                  <option value="">No subjects in Sem {selectedSemester}</option>
                ) : (
                  availableSubjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Module Picker */}
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1 font-medium">Module / Unit (Optional)</label>
              <select
                value={selectedModuleId}
                onChange={(e) => setSelectedModuleId(e.target.value)}
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
              >
                <option value="">General Subject Topics</option>
                {availableModules.map((m) => (
                  <option key={m.id} value={m.id}>
                    Mod {m.moduleNumber}: {m.title.slice(0, 24)}...
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Step 2: Resource Classification & Metadata */}
        <div className="space-y-3 pt-4 border-t border-[#1C271E]">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#F0FDF4] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-black font-bold flex items-center justify-center text-[10px]">2</span>
              <span>Resource Classification & Metadata</span>
            </h3>

            {/* Edit Classification & Metadata Button */}
            <button
              type="button"
              onClick={() => setIsEditMetadataOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] text-[11px] font-semibold transition"
              title="Edit Metadata & Tag Presets"
            >
              <Edit2 className="w-3 h-3 text-[#34D399]" />
              <span>Edit Metadata & Presets</span>
            </button>
          </div>

          {/* Resource Type Selector */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { type: 'notes', label: 'Notes', icon: FileText, color: 'text-[#34D399]' },
              { type: 'practice_ques', label: 'Practice Ques', icon: FileCheck, color: 'text-[#10B981]' },
              { type: 'pyq', label: 'PYQs', icon: FileCheck, color: 'text-[#F59E0B]' },
              { type: 'formula_sheet', label: 'Formula Sheet', icon: FileCode, color: 'text-[#A3E635]' },
              { type: 'pdf', label: 'Reference Book', icon: Layers, color: 'text-[#34D399]' },
            ].map((t) => {
              const Icon = t.icon;
              const isSelected = resourceType === t.type;
              return (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setResourceType(t.type as ResourceType)}
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center space-y-1.5 ${
                    isSelected
                      ? 'bg-[#10B981]/20 border-[#10B981] text-[#34D399] shadow-sm'
                      : 'bg-[#080A08] border-[#1C271E] text-[#86998A] hover:text-[#F0FDF4]'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${t.color}`} />
                  <span className="text-[11px] font-semibold">{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Display Title and Search Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="text-[11px] text-[#86998A] block mb-1">Display Title *</label>
              <input
                type="text"
                placeholder="e.g. Applied Maths 1 Complex Numbers Complete Notes"
                value={resourceTitle}
                onChange={(e) => setResourceTitle(e.target.value)}
                required
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
              />
            </div>

            <div>
              <label className="text-[11px] text-[#86998A] block mb-1">Search Tags (Comma-separated)</label>
              <input
                type="text"
                placeholder="e.g. Sem1, Maths1, DeMoivre, InSem"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none focus:border-[#34D399]"
              />
            </div>
          </div>

          {/* Quick Tag Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] text-[#86998A] font-semibold uppercase">Quick Tags:</span>
            {customTagPresets.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddTagPreset(tag)}
                className="px-2 py-0.5 rounded-lg bg-[#151D17] hover:bg-[#10B981]/20 text-[#86998A] hover:text-[#34D399] border border-[#1C271E] text-[10px] transition"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Ingestion Source (Google Drive / File) */}
        <div className="space-y-4 pt-4 border-t border-[#1C271E]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-xs font-bold text-[#F0FDF4] uppercase tracking-wider flex items-center space-x-2">
              <span className="w-5 h-5 rounded-full bg-[#10B981] text-black font-bold flex items-center justify-center text-[10px]">3</span>
              <span>Source: Google Drive Link or File Upload</span>
            </h3>

            {/* Mode Switcher Tabs */}
            <div className="flex bg-[#080A08] p-1 rounded-xl border border-[#1C271E]">
              <button
                type="button"
                onClick={() => setUploadMode('drive')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  uploadMode === 'drive'
                    ? 'bg-[#10B981] text-black font-bold shadow-sm'
                    : 'text-[#86998A] hover:text-[#F0FDF4]'
                }`}
              >
                <Link2 className="w-3.5 h-3.5" />
                <span>Google Drive Link</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadMode('file')}
                className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                  uploadMode === 'file'
                    ? 'bg-[#10B981] text-black font-bold shadow-sm'
                    : 'text-[#86998A] hover:text-[#F0FDF4]'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload Local File</span>
              </button>
            </div>
          </div>

          {uploadMode === 'drive' ? (
            <div className="p-5 rounded-2xl bg-[#080A08] border border-[#1C271E] space-y-3">
              <div>
                <label className="text-xs font-semibold text-[#86998A] block mb-1">
                  Google Drive / Cloud Share Link *
                </label>
                <input
                  type="url"
                  placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                  value={driveLinkInput}
                  onChange={(e) => setDriveLinkInput(e.target.value)}
                  className="w-full bg-[#0F1410] border border-[#1C271E] focus:border-[#34D399] rounded-xl px-3.5 py-2.5 text-xs text-[#F0FDF4] placeholder-[#627766] focus:outline-none transition"
                />
              </div>

              <div className="flex items-start space-x-2 text-[11px] text-[#86998A] bg-[#0F1410] p-3 rounded-xl border border-[#1C271E]">
                <ExternalLink className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#F0FDF4]">How to share from Google Drive:</p>
                  <p className="text-[#86998A] mt-0.5">
                    1. Right-click the PDF/PPT in Drive ➔ Click <strong>Share</strong> ➔ Set access to <strong>&ldquo;Anyone with the link can view&rdquo;</strong>.
                  </p>
                  <p className="text-[#86998A] mt-0.5">
                    2. Copy the link and paste it above. Versa will automatically stream in-app previews and high-speed downloads for all students!
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <FileDropzone onFilesSelected={handleFilesSelected} />
          )}
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-[#1C271E] flex justify-end">
          <button
            type="submit"
            disabled={isPublishing || (uploadMode === 'drive' ? !driveLinkInput.trim() : selectedFiles.length === 0)}
            className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-sm transition disabled:opacity-40"
          >
            {isPublishing ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <UploadCloud className="w-4 h-4 text-black" />
                <span>
                  {uploadMode === 'drive'
                    ? 'Publish Google Drive Resource'
                    : `Publish ${selectedFiles.length} Local File(s)`}
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Edit Metadata Modal */}
      {isEditMetadataOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0F1410] p-6 sm:p-8 rounded-3xl border border-[#1C271E] max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C271E]">
              <div className="flex items-center space-x-2">
                <Settings2 className="w-4 h-4 text-[#34D399]" />
                <h3 className="font-bold text-[#F0FDF4] text-base">Edit Resource Metadata & Presets</h3>
              </div>
              <button onClick={() => setIsEditMetadataOpen(false)} className="text-[#86998A] hover:text-[#F0FDF4]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[#86998A] block mb-1">Academic Year</label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-2 text-[#F0FDF4] font-mono focus:outline-none focus:border-[#34D399]"
                />
              </div>

              <div>
                <label className="text-[#86998A] block mb-1">Custom Tag Presets</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {customTagPresets.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-[#151D17] text-[#86998A] flex items-center space-x-1.5 border border-[#1C271E]"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => setCustomTagPresets(customTagPresets.filter((t) => t !== tag))}
                        className="text-[#86998A] hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleCreateNewTagPreset} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add new preset tag..."
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-1 bg-[#080A08] border border-[#1C271E] rounded-xl px-3 py-1.5 text-[#F0FDF4] focus:outline-none focus:border-[#34D399]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs"
                  >
                    Add Tag
                  </button>
                </form>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1C271E] flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditMetadataOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-sm"
              >
                Save Metadata Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
