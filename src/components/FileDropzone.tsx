'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, Trash2, AlertCircle, File, FileCode } from 'lucide-react';

export interface QueuedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'queued' | 'uploading' | 'completed' | 'error';
}

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
}

export default function FileDropzone({ onFilesSelected, accept = '.pdf,.pptx,.ppt,.docx,.doc,.zip,.txt', maxFiles = 100 }: FileDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileList, setFileList] = useState<QueuedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = (rawFiles: File[]) => {
    setFileList((prev) => {
      const existingKey = (f: { name: string; size: number }) => `${f.name}-${f.size}`;
      const existingSet = new Set(prev.map(existingKey));
      const freshFiles = rawFiles.filter((f) => !existingSet.has(existingKey(f)));

      const newQueued: QueuedFile[] = freshFiles.map((f) => ({
        id: `file-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        name: f.name,
        size: f.size,
        type: f.type || 'application/octet-stream',
        progress: 100,
        status: 'completed',
      }));

      const updated = [...prev, ...newQueued].slice(0, maxFiles);
      onFilesSelected(updated.map((item) => item.file));
      return updated;
    });
  };

  const removeFile = (id: string) => {
    setFileList((prev) => {
      const updated = prev.filter((f) => f.id !== id);
      onFilesSelected(updated.map((item) => item.file));
      return updated;
    });
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '1.8 MB';
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-4">
      {/* Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-[#10B981] bg-[#10B981]/10 scale-[1.01]'
            : 'border-[#1C271E] bg-[#0F1410]/60 hover:border-[#34D399]/50 hover:bg-[#0F1410]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#34D399] shadow-lg shadow-[#10B981]/10">
            <UploadCloud className="w-7 h-7" />
          </div>
          <div>
            <h4 className="font-bold text-[#F0FDF4] text-sm md:text-base">
              Drag & Drop 2025 Syllabus Notes, PPTs, or PYQs here
            </h4>
            <p className="text-xs text-[#86998A] mt-1">
              Supports PDF, PPTX, DOCX, ZIP files up to 50MB each
            </p>
          </div>
          <button
            type="button"
            className="px-4 py-1.5 rounded-xl bg-[#080A08] hover:bg-[#151D17] text-[#F0FDF4] text-xs font-semibold border border-[#1C271E]"
          >
            Browse from Computer
          </button>
        </div>
      </div>

      {/* Selected File List */}
      {fileList.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-[#86998A]">
            Files Prepared for Ingestion ({fileList.length}):
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {fileList.map((f) => (
              <div
                key={f.id}
                className="bg-[#0F1410] p-3 rounded-xl border border-[#1C271E] flex items-center justify-between text-xs hover:border-[#2B3C2E] transition-all"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <div className="p-2 rounded-lg bg-[#080A08] text-[#34D399] border border-[#1C271E]">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-[#F0FDF4] truncate">{f.name}</p>
                    <p className="text-[10px] text-[#86998A]">{formatSize(f.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
                  <span className="flex items-center space-x-1 text-[11px] text-[#34D399] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Ready</span>
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(f.id);
                    }}
                    className="p-1 rounded-lg text-[#86998A] hover:text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
