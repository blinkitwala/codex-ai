'use client';

import React from 'react';
import { Search, Code, Cpu, Mic, FileText } from 'lucide-react';

interface QuickCardsProps {
  onCardClick: (prompt: string, searchMode?: boolean, deepSearchMode?: boolean) => void;
}

export const QuickCards: React.FC<QuickCardsProps> = ({ onCardClick }) => {
  const cards = [
    {
      title: 'Multi-Engine Web Search',
      description: 'Search Google, Bing & DDG with instant source links & citations',
      icon: Search,
      prompt: 'What are the top technological breakthroughs in 2026? Provide sources.',
      searchMode: true,
      deepSearchMode: false,
      glow: 'from-amber-500/20 to-yellow-600/10 border-amber-500/30 text-amber-300'
    },
    {
      title: 'Deep Research Mode',
      description: 'Iterative multi-page web search & in-depth report synthesis',
      icon: Cpu,
      prompt: 'Execute a Deep Search research report on the current status of AI quantum computing.',
      searchMode: true,
      deepSearchMode: true,
      glow: 'from-cyan-500/20 to-blue-600/10 border-cyan-500/30 text-cyan-300'
    },
    {
      title: 'Code & Math Solution',
      description: 'Write, debug code, analyze math proofs & execute formulas',
      icon: Code,
      prompt: 'Write a full React component with Tailwind CSS for a interactive audio visualizer.',
      searchMode: false,
      deepSearchMode: false,
      glow: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30 text-purple-300'
    },
    {
      title: 'Deep Male Voice Chat',
      description: 'Hands-free voice assistant with natural deep male speech',
      icon: Mic,
      prompt: 'Hello Codex_AI! Tell me a fascinating short story about space exploration.',
      searchMode: false,
      deepSearchMode: false,
      glow: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30 text-emerald-300'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full max-w-4xl mx-auto my-6 px-2 select-none">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => onCardClick(card.prompt, card.searchMode, card.deepSearchMode)}
            className={`p-4 rounded-2xl bg-gradient-to-br ${card.glow} backdrop-blur-xl border hover:border-amber-400/60 cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-xl group flex flex-col justify-between`}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-gray-200 group-hover:text-white transition-colors">
                {card.title}
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
};
