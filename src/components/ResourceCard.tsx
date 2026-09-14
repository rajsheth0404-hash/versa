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
import { downloadAcademicResource, getAcademicPdfBlob } from '@/lib/pdf-download';

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

  // Load PDF Blob URL for in-website live viewing when Look is clicked or next/prev navigated
  useEffect(() => {
    let activeBlobUrl: string | null = null;
    if (isPreviewOpen) {
      setIsLoadingPreview(true);
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

  const typeConfig: Record<string, { label: string; icon: any; color: string; bg: string }> = {
    notes: { label: 'Notes', icon: FileText, color: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10 border-[#38BDF8]/30' },
    ppt: { label: 'Notes', icon: FileText, color: 'text-[#38BDF8]', bg: 'bg-[#38BDF8]/10 border-[#38BDF8]/30' },
    practice_ques: { label: 'Practice Ques', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
    pyq: { label: 'PYQs', icon: FileCheck, color: 'text-[#818CF8]', bg: 'bg-[#818CF8]/10 border-[#818CF8]/30' },
    formula_sheet: { label: 'Formula Sheet', icon: FileCode, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
    pdf: { label: 'Reference Book', icon: BookOpen, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
    syllabus: { label: 'Syllabus', icon: Layers, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
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
      <div className="glass-card rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5 border border-slate-700/80 hover:border-[#38BDF8]/60 hover:bg-slate-900/90 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group relative bg-[#1E293B]/80 shadow-md">
        {/* Left: Icon + Title + Clean Metadata in a horizontal line */}
        <div className="flex items-center space-x-3.5 min-w-0 flex-1">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${currentType.bg} ${currentType.color} shadow-sm group-hover:scale-105 transition-transform`}
          >
            <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="min-w-0 flex-1 space-y-0.5">
            <div className="flex items-center space-x-2">
              <h4 className="font-bold text-[#F8FAFC] text-xs sm:text-sm leading-snug group-hover:text-[#38BDF8] transition truncate">
                {resource.title}
              </h4>
            </div>

            <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] text-slate-400 flex-wrap">
              <span className={`font-semibold ${currentType.color}`}>{currentType.label}</span>
              {resource.examType && (
                <>
                  <span>•</span>
                  <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase text-[9px]">
                    {resource.examType === 'mid_sem' ? 'Mid Sem' : resource.examType === 'end_sem' ? 'End Sem' : 'In Sem'}
                  </span>
                </>
              )}
              {resource.examYear && (
                <>
                  <span>•</span>
                  <span className="text-slate-300 font-mono">{resource.examYear}</span>
                </>
              )}
              <span>•</span>
              <span className="font-mono text-slate-300">{formatFileSize(resource.fileSizeBytes)}</span>
              {resource.tags && resource.tags.length > 0 && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline text-[#818CF8] font-mono">#{resource.tags[0]}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Look, Download, and Admin Actions in a clean horizontal row */}
        <div className="flex items-center space-x-2 flex-shrink-0 self-end sm:self-center">
          {/* Look / Preview Button */}
          <button
            onClick={() => {
              setActiveResource(resource);
              setIsPreviewOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-[#818CF8]/50 text-xs font-semibold shadow-sm transition"
            title="Look / Preview Resource"
          >
            <Eye className="w-3.5 h-3.5 text-[#818CF8]" />
            <span>Look</span>
          </button>

          {/* Download / Get Button */}
          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-cyan-950/40 ${
              downloadSuccess
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950'
            } disabled:opacity-50`}
            title="Download PDF Notes"
          >
            {isDownloading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                <span>Downloading...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-950" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </>
            )}
          </button>

          {/* Admin Edit & Delete */}
          {currentUser?.role === 'admin' && (
            <div className="flex items-center space-x-1 border-l border-slate-800/80 pl-2">
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-[#38BDF8] hover:bg-slate-800/80 transition"
                title="Edit Resource"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleDeleteResource}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition"
                title="Delete Resource"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal (Admin Only) */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel bg-[#1E293B] w-full max-w-lg rounded-3xl border border-slate-700 p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-[#F8FAFC] text-base">Edit Resource</h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-semibold">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#38BDF8]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Type</label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#38BDF8]"
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
                  <label className="text-slate-300 font-semibold">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={editTags}
                    onChange={(e) => setEditTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              {subjects.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold">Subject</label>
                  <select
                    value={editSubjectId}
                    onChange={(e) => {
                      setEditSubjectId(e.target.value);
                      setEditModuleId('');
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#38BDF8]"
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
                  <label className="text-slate-300 font-semibold">Module (Optional)</label>
                  <select
                    value={editModuleId}
                    onChange={(e) => setEditModuleId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-[#38BDF8]"
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

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-[11px] text-slate-500">ID: {resource.id.slice(0, 8)}...</span>

                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 font-bold shadow-lg shadow-cyan-950/40"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Live In-Website PDF Viewer Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#0F172A] border border-slate-700/80 w-full max-w-6xl h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            {/* Viewer Header */}
            <div className="px-3 py-2.5 sm:px-6 sm:py-3.5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between gap-2 sm:gap-4 shrink-0">
              {/* Left: Info */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                <div className={`p-1.5 sm:p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0 ${currentType.color}`}>
                  <TypeIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-[#F8FAFC] text-xs sm:text-base truncate">{activeResource.title}</h3>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400">
                    <span className="text-[#38BDF8] uppercase font-semibold">{currentType.label}</span>
                    <span>•</span>
                    <span>{formatFileSize(activeResource.fileSizeBytes)}</span>
                    {activeResource.tags && activeResource.tags.length > 0 && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:inline text-slate-400 truncate max-w-[180px]">{activeResource.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: Next / Previous PDF Navigation */}
              {resourceList.length > 1 && (
                <div className="flex items-center space-x-1 sm:space-x-1.5 bg-slate-950/80 border border-slate-750 px-1.5 py-1 rounded-xl shadow-inner shrink-0">
                  <button
                    onClick={goToPrev}
                    disabled={!hasPrev}
                    className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold border border-slate-700/60 transition"
                    title="Previous PDF document (← Left Arrow)"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden md:inline">Prev</span>
                  </button>

                  <div className="px-2 py-0.5 rounded-md bg-slate-900 text-[10px] sm:text-[11px] font-mono font-bold text-slate-300 border border-slate-800">
                    <span className="text-[#38BDF8]">{safeIndex + 1}</span>
                    <span className="text-slate-500 mx-1">/</span>
                    <span>{resourceList.length}</span>
                  </div>

                  <button
                    onClick={goToNext}
                    disabled={!hasNext}
                    className="inline-flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white disabled:opacity-30 disabled:pointer-events-none text-xs font-semibold border border-slate-700/60 transition"
                    title="Next PDF document (→ Right Arrow)"
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
                    className="hidden lg:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700/60 transition"
                    title="Open PDF in new browser tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open in New Tab</span>
                  </a>
                )}

                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className={`flex items-center space-x-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-slate-950 text-xs font-bold shadow-lg transition ${
                    downloadSuccess
                      ? 'bg-emerald-500'
                      : 'bg-[#38BDF8] hover:bg-[#0EA5E9] shadow-cyan-950/50'
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
                  className="p-1 sm:p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-transparent hover:border-slate-700 transition"
                  title="Close PDF viewer (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Viewer Body / Embedded PDF View */}
            <div className="flex-1 w-full h-full relative bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
              {isLoadingPreview ? (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-[#38BDF8]/10 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
                      <Loader2 className="w-7 h-7 animate-spin" />
                    </div>
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
                  className="w-full h-full border-0 bg-slate-950"
                />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-4 text-center p-6">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200 text-sm">Unable to render PDF preview</h4>
                    <p className="text-slate-400 text-xs mt-1 max-w-sm">
                      You can still download the complete resource directly to view it on your device.
                    </p>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-[#0EA5E9] text-slate-950 text-xs font-bold shadow-lg"
                  >
                    Download PDF File
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
