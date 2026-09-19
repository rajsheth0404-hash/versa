'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  FileCode2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Layers,
  BookOpen,
} from 'lucide-react';
import { HubStore } from '@/lib/store';
import { SyllabusParseResult } from '@/lib/types';
import confetti from 'canvas-confetti';

const SAMPLE_FY_SYLLABUS = `SOMAIYA VIDYAVIHAR UNIVERSITY
K. J. Somaiya College of Engineering
First Year Engineering
B.Tech Semester I Curriculum

Course Code: BSC101
Course Title: Applied Mathematics I
Credits: 4
Scheme: Standard

Course Objectives:
1. To develop logical mathematical modeling for engineering systems.
2. To master complex number representations, hyperbolic functions, and De Moivre expansions.
3. To compute partial derivatives, Euler homogeneous equations, and matrix diagonalization.

Module 1: Complex Numbers & De Moivres Theorem (16 Marks)
- De Moivres Theorem and its applications to expansion of powers of circular functions
- Roots of Complex Numbers and standard geometric representations
- Hyperbolic and Inverse Hyperbolic Functions, Logarithm of Complex Quantities

Module 2: Successive Differentiation & Leibniz Rule (14 Marks)
- N-th order derivatives of standard polynomials and trigonometric functions
- Leibniz Theorem for n-th derivative of product of two functions
- Taylor Series and Maclaurin Series expansions

Module 3: Partial Differentiation & Jacobians (18 Marks)
- Partial Derivatives of First and Higher Orders
- Eulers Theorem on Homogeneous Functions and Corollaries
- Total Derivatives, Composite Functions, and Jacobians

Module 4: Linear Algebra, Matrices & Quadratic Forms (18 Marks)
- Rank of a Matrix, Echelon and Normal Form
- System of Homogeneous and Non-Homogeneous Linear Equations
- Characteristic Equation, Eigenvalues, Eigenvectors, and Cayley-Hamilton Theorem`;

export default function AdminSyllabusParserPage() {
  const router = useRouter();
  const [syllabusText, setSyllabusText] = useState(SAMPLE_FY_SYLLABUS);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<SyllabusParseResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleParseSyllabus = async () => {
    if (!syllabusText.trim()) return;
    setIsParsing(true);
    setErrorMsg(null);
    setImportSuccess(false);

    try {
      const res = await fetch('/api/ai/parse-syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText: syllabusText }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to parse syllabus');

      setParsedResult(json.data);
    } catch (err: any) {
      console.error('Syllabus parser error:', err);
      setErrorMsg(err?.message || 'Failed to parse syllabus. Please try again.');
    } finally {
      setIsParsing(false);
    }
  };

  const handleAutoIngest = () => {
    if (!parsedResult) return;

    HubStore.importParsedSyllabus(parsedResult);
    setImportSuccess(true);

    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#34D399', '#A3E635', '#F59E0B'],
    });

    setTimeout(() => {
      router.push('/admin/hierarchy');
    }, 1800);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#34D399]">
            Gemini Flash AI Syllabus Parser
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F0FDF4] tracking-tight mt-1">
          AI Syllabus Auto-Parser (First Year Sem 1 & 2)
        </h1>
        <p className="text-xs text-[#86998A] mt-1">
          Paste any First Year Somaiya syllabus text or outline. Gemini will parse modules, topics, weightage marks, and practicals with 1-click automated ingestion.
        </p>
      </div>

      {/* Input Form */}
      <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#1C271E] space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-[#F0FDF4] uppercase tracking-wider">
            Raw First Year Syllabus Document Text
          </label>
          <button
            type="button"
            onClick={() => setSyllabusText(SAMPLE_FY_SYLLABUS)}
            className="text-[11px] text-[#34D399] hover:underline font-semibold"
          >
            Load Sample First Year 2025 Syllabus
          </button>
        </div>

        <textarea
          rows={10}
          value={syllabusText}
          onChange={(e) => setSyllabusText(e.target.value)}
          placeholder="Paste course name, module breakdown, and lab experiments here..."
          className="w-full bg-[#080A08] border border-[#1C271E] rounded-xl p-4 text-xs font-mono text-[#F0FDF4] focus:outline-none focus:border-[#10B981] leading-relaxed"
        />

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={handleParseSyllabus}
            disabled={isParsing || !syllabusText.trim()}
            className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-[#10B981]/20 transition disabled:opacity-40"
          >
            {isParsing ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles className="w-4 h-4 text-black" />
            )}
            <span>{isParsing ? 'Decomposing Syllabus with Gemini...' : 'Decompose with Gemini Flash'}</span>
          </button>
        </div>
      </div>

      {/* Parsed Structure Preview */}
      {parsedResult && (
        <div className="bg-[#0F1410]/80 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#10B981]/30 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#1C271E]">
            <div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-[#10B981]/15 text-[#34D399] font-bold uppercase border border-[#10B981]/30">
                First Year Analysis Complete
              </span>
              <h3 className="text-xl font-bold text-[#F0FDF4] mt-1">
                {parsedResult.subjectCode}: {parsedResult.subjectName}
              </h3>
              <p className="text-xs text-[#86998A]">
                Semester {parsedResult.semester || 1} • Credits: {parsedResult.credits} • Scheme: {parsedResult.scheme}
              </p>
            </div>

            <button
              onClick={handleAutoIngest}
              disabled={importSuccess}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-[#10B981] hover:bg-[#059669] text-black font-bold text-xs shadow-lg shadow-[#10B981]/20 transition"
            >
              {importSuccess ? <CheckCircle2 className="w-4 h-4 text-black" /> : <Layers className="w-4 h-4 text-black" />}
              <span>{importSuccess ? 'Ingested! Redirecting...' : '1-Click Auto-Ingest into Curriculum'}</span>
            </button>
          </div>

          {/* Modules List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#F0FDF4] uppercase tracking-wider flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#34D399]" />
              <span>Extracted Modules ({parsedResult.modules.length})</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parsedResult.modules.map((m, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-[#080A08] border border-[#1C271E] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#34D399]">
                      Module {m.moduleNumber}
                    </span>
                    <span className="text-[10px] text-[#86998A] font-mono">
                      {m.weightageMarks} Marks
                    </span>
                  </div>
                  <h5 className="font-bold text-[#F0FDF4] text-xs">{m.title}</h5>
                  <p className="text-[11px] text-[#86998A] line-clamp-2">{m.description}</p>
                  {m.topics && m.topics.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {m.topics.slice(0, 3).map((t, tIdx) => (
                        <span key={tIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#0F1410] text-[#86998A] border border-[#1C271E]">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

