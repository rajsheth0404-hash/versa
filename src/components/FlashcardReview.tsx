'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard } from '@/lib/types';
import { ChevronLeft, ChevronRight, RotateCw, CheckCircle2, AlertCircle, Sparkles, Shuffle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardReviewProps {
  cards: Flashcard[];
  deckTitle: string;
}

export default function FlashcardReview({ cards, deckTitle }: FlashcardReviewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffledCards, setShuffledCards] = useState<Flashcard[]>(cards);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);
  const [reviewIds, setReviewIds] = useState<string[]>([]);

  useEffect(() => {
    setShuffledCards(cards);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [cards]);

  const currentCard = shuffledCards[currentIndex];
  const progressPercent = Math.round(((currentIndex + 1) / (shuffledCards.length || 1)) * 100);

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < shuffledCards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#A3E635', '#F59E0B'],
      });
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleShuffle = () => {
    const copy = [...shuffledCards].sort(() => Math.random() - 0.5);
    setShuffledCards(copy);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const markMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => (prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]));
    setReviewIds((prev) => prev.filter((id) => id !== currentCard.id));
    handleNext();
  };

  const markReview = () => {
    if (!currentCard) return;
    setReviewIds((prev) => (prev.includes(currentCard.id) ? prev : [...prev, currentCard.id]));
    setMasteredIds((prev) => prev.filter((id) => id !== currentCard.id));
    handleNext();
  };

  if (!currentCard) {
    return (
      <div className="bg-[#0F1410] p-8 rounded-2xl text-center text-[#86998A] border border-[#1C271E]">
        <p>No flashcards found in this deck.</p>
      </div>
    );
  }

  const difficultyColors = {
    easy: 'bg-[#10B981]/20 text-[#34D399] border-[#10B981]/30',
    medium: 'bg-[#A3E635]/20 text-[#A3E635] border-[#A3E635]/30',
    hard: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header Info & Progress Bar */}
      <div className="flex items-center justify-between text-xs text-[#86998A]">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-[#F0FDF4]">{deckTitle}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${difficultyColors[currentCard.difficulty || 'medium']}`}>
            {currentCard.difficulty?.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleShuffle}
            className="flex items-center space-x-1 text-[#86998A] hover:text-[#34D399] transition"
            title="Shuffle Deck"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
          <span className="font-mono text-[#34D399] font-semibold">
            {currentIndex + 1} / {shuffledCards.length}
          </span>
        </div>
      </div>

      <div className="w-full bg-[#080A08] rounded-full h-1.5 overflow-hidden border border-[#1C271E]">
        <div
          className="bg-gradient-to-r from-[#10B981] to-[#34D399] h-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      {/* 3D Flip Card Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="perspective-1000 cursor-pointer min-h-[300px] w-full"
      >
        <div
          className={`relative w-full min-h-[300px] rounded-3xl transition-transform duration-500 transform-style-3d shadow-2xl ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 backface-hidden bg-[#0F1410] rounded-3xl p-8 border border-[#1C271E] flex flex-col justify-between hover:border-[#2B3C2E] transition-colors">
            <div className="flex items-center justify-between text-[11px] text-[#86998A]">
              <span className="font-bold uppercase tracking-wider text-[#34D399]">Concept / Question</span>
              <span className="flex items-center space-x-1 text-[#86998A]">
                <RotateCw className="w-3.5 h-3.5 animate-spin-slow text-[#34D399]" />
                <span>Click or tap to reveal answer</span>
              </span>
            </div>

            <div className="my-auto py-6">
              <p className="text-xl md:text-2xl font-semibold text-[#F0FDF4] leading-relaxed text-center">
                {currentCard.front}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#1C271E] text-[11px]">
              <div className="flex flex-wrap gap-1.5">
                {currentCard.tags?.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-[#080A08] text-[#34D399] border border-[#1C271E] font-mono">
                    #{t}
                  </span>
                ))}
              </div>
              <span className="text-[#86998A]">Spacebar to flip</span>
            </div>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-[#0F1410] rounded-3xl p-8 border border-[#10B981]/40 bg-gradient-to-br from-[#0F1410] via-[#0F1410] to-[#080A08] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold uppercase tracking-wider text-[#34D399] flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-[#A3E635]" />
                <span>Explanation & Formulas</span>
              </span>
              <span className="text-[#86998A]">Click to flip back</span>
            </div>

            <div className="my-auto py-6">
              <p className="text-base md:text-lg text-[#F0FDF4] leading-relaxed whitespace-pre-line">
                {currentCard.back}
              </p>
            </div>

            <div className="pt-4 border-t border-[#1C271E] flex justify-between items-center text-xs text-[#86998A]">
              <span className="text-[#86998A]">Exam Prep</span>
              <span className="text-[#A3E635] font-semibold">High Accuracy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#0F1410] hover:bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] disabled:opacity-40 disabled:pointer-events-none text-xs transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="flex items-center space-x-2">
          <button
            onClick={markReview}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold transition"
          >
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Need Review</span>
          </button>
          <button
            onClick={markMastered}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#10B981]/10 hover:bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 text-xs font-semibold transition"
          >
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
            <span>Mastered</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === shuffledCards.length - 1}
          className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#0F1410] hover:bg-[#151D17] text-[#86998A] hover:text-[#F0FDF4] border border-[#1C271E] disabled:opacity-40 disabled:pointer-events-none text-xs transition"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Summary Chips */}
      <div className="flex items-center justify-center space-x-4 text-xs text-[#86998A] pt-2">
        <span className="text-[#34D399]">Mastered: {masteredIds.length}</span>
        <span>•</span>
        <span className="text-rose-400">Review: {reviewIds.length}</span>
        <span>•</span>
        <span>Unseen: {shuffledCards.length - masteredIds.length - reviewIds.length}</span>
      </div>
    </div>
  );
}
