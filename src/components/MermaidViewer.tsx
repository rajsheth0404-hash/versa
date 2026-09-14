'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, RotateCcw, Copy, Check, Download, Maximize2 } from 'lucide-react';

interface MermaidViewerProps {
  code: string;
  id?: string;
  title?: string;
}

export default function MermaidViewer({ code, id = 'mermaid-chart', title }: MermaidViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [zoom, setZoom] = useState<number>(1);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      themeVariables: {
        darkMode: true,
        background: '#0F172A',
        primaryColor: '#1E293B',
        primaryTextColor: '#F8FAFC',
        primaryBorderColor: '#38BDF8',
        lineColor: '#38BDF8',
        secondaryColor: '#818CF8',
        tertiaryColor: '#0F172A',
        fontSize: '14px',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      },
      securityLevel: 'loose',
    });

    const renderChart = async () => {
      if (!code) return;
      try {
        setError(null);
        const uniqueId = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
        const { svg } = await mermaid.render(uniqueId, code.trim());
        setSvgContent(svg);
      } catch (err: any) {
        console.error('Mermaid render error:', err);
        setError('Failed to render diagram. Check Mermaid syntax.');
      }
    };

    renderChart();
  }, [code]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSvg = () => {
    if (!svgContent) return;
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'somaiya-flowchart'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-[#1E293B] rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl">
      {/* Header Controls */}
      <div className="px-4 py-3 bg-[#0F172A] border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] animate-pulse"></span>
          <h4 className="text-xs font-semibold text-[#F8FAFC] uppercase tracking-wider">
            {title || 'Mermaid.js Visual Flowchart'}
          </h4>
        </div>

        <div className="flex items-center space-x-1.5 text-xs">
          <button
            onClick={() => setZoom((prev) => Math.max(0.6, prev - 0.15))}
            className="p-1.5 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-[#38BDF8] font-mono w-9 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom((prev) => Math.min(2.0, prev + 0.15))}
            className="p-1.5 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(1)}
            className="p-1.5 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="h-4 w-px bg-slate-700 mx-1"></div>
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#1E293B] text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700"
            title="Copy Mermaid Code"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Code'}</span>
          </button>
          <button
            onClick={handleDownloadSvg}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#38BDF8]/15 text-[#38BDF8] border border-[#38BDF8]/30 hover:bg-[#38BDF8]/25 font-semibold"
            title="Export SVG"
          >
            <Download className="w-3.5 h-3.5" />
            <span>SVG</span>
          </button>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="p-6 overflow-auto min-h-[320px] max-h-[550px] flex items-center justify-center bg-[#0F172A]/90">
        {error ? (
          <div className="text-center p-6 text-rose-400 text-xs">
            <p className="font-semibold mb-1">Rendering Exception</p>
            <p className="text-slate-400 font-mono text-[11px] max-w-md">{error}</p>
          </div>
        ) : svgContent ? (
          <div
            ref={containerRef}
            style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.15s ease' }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            className="w-full flex justify-center [&>svg]:max-w-full [&>svg]:h-auto"
          />
        ) : (
          <div className="flex flex-col items-center space-y-2 text-slate-500">
            <div className="w-6 h-6 border-2 border-[#38BDF8] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs">Generating interactive diagram...</span>
          </div>
        )}
      </div>
    </div>
  );
}
