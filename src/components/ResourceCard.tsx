'use client';

import React, { useState, useEffect } from 'react';
import { AcademicResource, Subject, Module } from '@/lib/types';
import {
  FileText,
  Presentation,
  FileCode,
  FileCheck,
  Download,
  Eye,
  CheckCircle2,
  Layers,
  BookOpen,
  X,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { downloadAcademicResource, getAcademicPdfBlob, getGoogleDrivePreviewUrl } from '@/lib/pdf-download';

interface ResourceCardProps {
  resource: AcademicResource;
  siblingResources?: AcademicResource[];
  subjectName?: string;
  moduleName?: string;
  subjects?: Subject[];
  modules?: Module[];
  onDownload?: (id: string) => void;
  onUpdate?: () => void;
}

export default function ResourceCard({
  resource,
  siblingResources = [],
  subjectName,
  moduleName,
  subjects = [],
  modules = [],
  onDownload,
  onUpdate,
}: ResourceCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeResource, setActiveResource] = useState<AcademicResource>(resource);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadCount, setDownloadCount] = useState(resource.downloadsCount);

  // Sync active resource when prop changes
  useEffect(() => {
    setActiveResource(resource);
  }, [resource]);

  // Sibling list navigation calculations
  const resourceList = siblingResources && siblingResources.length > 0 ? siblingResources : [activeResource];
  const currentIndex = resourceList.findIndex((r) => r.id === activeResource.id);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const hasPrev = safeIndex > 0;
  const hasNext = safeIndex < resourceList.length - 1;

  const goToPrev = () => {
    if (hasPrev) {
      setActiveResource(resourceList[safeIndex - 1]);
    }
  };

  const goToNext = () => {
    if (hasNext) {
      setActiveResource(resourceList[safeIndex + 1]);
    }
  };

  // Keyboard navigation when PDF modal is active
  useEffect(() => {
    if (!isPreviewOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        if (safeIndex > 0) setActiveResource(resourceList[safeIndex - 1]);
      } else if (e.key === 'ArrowRight') {
        if (safeIndex < resourceList.length - 1) setActiveResource(resourceList[safeIndex + 1]);
      } else if (e.key === 'Escape') {
        setIsPreviewOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewOpen, safeIndex, resourceList]);

  // Load PDF Blob URL or Google Drive preview for in-website live viewing
  useEffect(() => {
    let activeBlobUrl: string | null = null;
    if (isPreviewOpen) {
      setIsLoadingPreview(true);

      const drivePreview = getGoogleDrivePreviewUrl(activeResource.filePath);
      if (drivePreview && (activeResource.filePath?.startsWith('http://') || activeResource.filePath?.startsWith('https://'))) {
        setPdfPreviewUrl(drivePreview);
        setIsLoadingPreview(false);
        return;
      }

      getAcademicPdfBlob(activeResource, subjectName, moduleName)
        .then((blob) => {
          activeBlobUrl = URL.createObjectURL(blob);
          setPdfPreviewUrl(activeBlobUrl);
          setIsLoadingPreview(false);
        })
        .catch((err) => {
          console.error('Failed to load PDF preview:', err);
          setIsLoadingPreview(false);
        });
    } else {
      setPdfPreviewUrl(null);
    }

    return () => {
      if (activeBlobUrl) {
        URL.revokeObjectURL(activeBlobUrl);
      }
    };
  }, [isPreviewOpen, activeResource, subjectName, moduleName]);

  // Edit form state
  const [currentUser, setCurrentUser] = useState(HubStore.getCurrentUser());
  useEffect(() => {
    setCurrentUser(HubStore.getCurrentUser());
  }, []);

  const [editTitle, setEditTitle] = useState(resource.title);
  const [editType, setEditType] = useState(resource.type);
  const [editTags, setEditTags] = useState(resource.tags?.join(', ') || '');
  const [editSubjectId, setEditSubjectId] = useState(resource.subjectId);
  const [editModuleId, setEditModuleId] = useState(resource.moduleId || '');

  const availableModulesForEdit = modules.filter((m) => m.subjectId === editSubjectId);

  const isDriveLink = Boolean(
    activeResource.filePath &&
    (activeResource.filePath.startsWith('http://') ||
     activeResource.filePath.startsWith('https://') ||
     activeResource.filePath.includes('drive.google.com'))
  );

  const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    notes: { label: 'Notes', icon: FileText, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/60' },
    ppt: { label: 'Notes', icon: FileText, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/60' },
    practice_ques: { label: 'Practice Ques', icon: FileCheck, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60' },
    pyq: { label: 'PYQs', icon: FileCheck, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800/60' },
    formula_sheet: { label: 'Formula Sheet', icon: FileCode, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800/60' },
    pdf: { label: 'Reference Book', icon: BookOpen, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60' },
    syllabus: { label: 'Syllabus', icon: Layers, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800/60' },
  };

  const currentType = typeConfig[activeResource.type] || typeConfig.notes;
  const TypeIcon = currentType.icon;

  const handleDownload = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (isDownloading) return;

    try {
      setIsDownloading(true);
      HubStore.incrementDownload(activeResource.id);
      setDownloadCount((prev) => prev + 1);
      if (onDownload) onDownload(activeResource.id);

      await downloadAcademicResource(activeResource, subjectName, moduleName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    const tagsArray = editTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    HubStore.updateResource(resource.id, {
      title: editTitle,
      type: editType as any,
      tags: tagsArray,
      subjectId: editSubjectId,
      moduleId: editModuleId || undefined,
    });

    setIsEditOpen(false);
    if (onUpdate) onUpdate();
  };

  const handleDeleteResource = () => {
    if (confirm(`Delete "${resource.title}"?`)) {
      HubStore.deleteResource(resource.id);
      if (onUpdate) onUpdate();
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '1.8 MB';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <>
      {/* ============================================================ */}
      {/* HIGH-CONTRAST CARD SURFACE                                   */}
      {/* ============================================================ */}
      <div className="rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 bg-white dark:bg-[#131b2a] border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:bg-slate-50 dark:hover:bg-[#192438] transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative shadow-sm">
        {/* Left: Icon + High-Contrast Title + Metadata */}
        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${currentType.bg} ${currentType.color} shadow-sm group-hover:scale-105 transition-transform`}
          >
            <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm leading-snug group-hover:text-sky-600 dark:group-hover:text-sky-400 transition truncate">
                {resource.title}
              </h4>
            </div>

            <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 flex-wrap">
              <span className={`font-semibold ${currentType.color}`}>{currentType.label}</span>
              {resource.examType && (
                <>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold uppercase text-[9px] border border-indigo-200 dark:border-indigo-800/60">
                    {resource.examType === 'mid_sem' ? 'Mid Sem' : resource.examType === 'end_sem' ? 'End Sem' : 'In Sem'}
                  </span>
                </>
              )}
              {resource.examYear && (
                <>
                  <span>•</span>
                  <span className="text-slate-700 dark:text-slate-300 font-mono font-medium">{resource.examYear}</span>
                </>
              )}
              <span>•</span>
              <span className="font-mono text-slate-600 dark:text-slate-400">{formatFileSize(resource.fileSizeBytes)}</span>
              {resource.tags && resource.tags.length > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-indigo-600 dark:text-indigo-400 font-mono">#{resource.tags[0]}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Look, Download & Admin Actions */}
        <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
          {/* Look / Preview Button */}
          <button
            onClick={() => {
              setActiveResource(resource);
              setIsPreviewOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-sm transition"
            title="Look / Preview Resource"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Look</span>
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
              downloadSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950'
            } disabled:opacity-50`}
            title="Download PDF Notes"
          >
            {isDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Downloading...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </>
            )}
          </button>

          {/* Quick Edit & Delete Actions */}
          <div className="flex items-center space-x-1 border-l border-slate-200 dark:border-slate-800 pl-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Edit Resource"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleDeleteResource}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Delete Resource"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Modal (Admin Only) */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#131b2a] w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">Edit Resource</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-700 dark:text-slate-300 font-semibold">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="notes">Notes</option>
                    <option value="ppt">Notes (PPT)</option>
                    <option value="practice_ques">Practice Ques</option>
                    <option value="pyq">PYQs</option>
                    <option value="formula_sheet">Formula Sheet</option>
                    <option value="pdf">Reference Book</option>
                    <option value="syllabus">Syllabus</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                  />
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Subject</label>
                  <select
                    value={editSubjectId}
                    onChange={(e) => {
                      setEditSubjectId(e.target.value);
                      setEditModuleId('');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.name} (Sem {sub.semester})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {availableModulesForEdit.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-slate-700 dark:text-slate-300 font-semibold">Module (Optional)</label>
                  <select
                    value={editModuleId}
                    onChange={(e) => setEditModuleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-sky-500"
                  >
                    <option value="">General Course Material</option>
                    {availableModulesForEdit.map((m) => (
                      <option key={m.id} value={m.id}>
                        Mod {m.moduleNumber}: {m.title}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] text-slate-500 font-mono">ID: {resource.id.slice(0, 8)}...</span>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950 font-bold shadow-md transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live In-Website PDF & Drive Viewer Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#131b2a] border border-slate-200 dark:border-slate-800 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Viewer Header */}
            <div className="px-3 py-2.5 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-[#0b0f17] border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
              {/* Left: Info */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                <div className={`p-1.5 sm:p-2 rounded-xl border shrink-0 ${currentType.bg} ${currentType.color}`}>
                  <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-base truncate">{activeResource.title}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                    <span className={`uppercase font-semibold ${currentType.color}`}>{currentType.label}</span>
                    <span>•</span>
                    <span>{formatFileSize(activeResource.fileSizeBytes)}</span>
                    {activeResource.tags && activeResource.tags.length > 0 && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-slate-500 dark:text-slate-400 truncate max-w-[180px]">{activeResource.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: Next / Previous Document Navigation */}
              {resourceList.length > 1 && (
                <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-100 dark:bg-[#0b0f17] border border-slate-200 dark:border-slate-800 px-1.5 py-1 rounded-xl shrink-0">
                  <button
                    onClick={goToPrev}
                    disabled={!hasPrev}
                    className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-white dark:bg-[#131b2a] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                    title="Previous document (← Left Arrow)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Prev</span>
                  </button>

                  <div className="px-2 py-0.5 rounded-md bg-white dark:bg-[#131b2a] text-[10px] sm:text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    <span className="text-sky-600 dark:text-sky-400">{safeIndex + 1}</span>
                    <span className="text-slate-400 mx-1">/</span>
                    <span>{resourceList.length}</span>
                  </div>

                  <button
                    onClick={goToNext}
                    disabled={!hasNext}
                    className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-white dark:bg-[#131b2a] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold border border-slate-200 dark:border-slate-700 transition"
                    title="Next document (→ Right Arrow)"
                  >
                    <span className="hidden md:inline">Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Right: Header Controls */}
              <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
                {pdfPreviewUrl && (
                  <a
                    href={pdfPreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition text-xs font-semibold"
                    title="Open document in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-indigo-600 dark:text-sky-400" />
                    <span className="hidden sm:inline">Open in New Tab</span>
                  </a>
                )}

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                    downloadSuccess
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 hover:bg-indigo-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white dark:text-slate-950'
                  } disabled:opacity-50`}
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span className="hidden sm:inline">Downloading...</span>
                    </>
                  ) : downloadSuccess ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Downloaded</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Download</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => setIsPreviewOpen(false)}
                  className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition"
                  title="Close PDF viewer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body / Embedded PDF View */}
            <div className="flex-1 w-full h-full relative bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
              {isLoadingPreview ? (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
                  <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Loader2 className="w-7 h-7 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">Loading PDF in Website Viewer...</h4>
                    <p className="text-slate-400 text-xs mt-1">Preparing full document layout & vector pages</p>
                  </div>
                </div>
              ) : pdfPreviewUrl ? (
                <iframe
                  src={`${pdfPreviewUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  title={resource.title}
                  className="w-full h-full border-0 bg-slate-900"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">Unable to render PDF preview</h4>
                    <p className="text-slate-400 text-xs mt-1 max-w-sm">
                      You can still download the complete resource to view it directly on your device.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownload}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-sm"
                    >
                      Download PDF File
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
