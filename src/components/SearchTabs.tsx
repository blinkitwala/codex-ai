'use client';

import React from 'react';
import { Globe, Image as ImageIcon, Newspaper, Video, ExternalLink } from 'lucide-react';
import { SearchResult } from '@/lib/types';

interface SearchTabsProps {
  activeTab: 'web' | 'images' | 'news' | 'videos';
  onSelectTab: (tab: 'web' | 'images' | 'news' | 'videos') => void;
  searchResults: SearchResult[];
}

export const SearchTabs: React.FC<SearchTabsProps> = ({
  activeTab,
  onSelectTab,
  searchResults
}) => {
  const tabs = [
    { id: 'web', label: 'Web', icon: Globe },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'videos', label: 'Videos', icon: Video },
  ] as const;

  const filteredResults = searchResults.filter(r => r.tab === activeTab || (!r.tab && activeTab === 'web'));

  return (
    <div className="w-full my-4 bg-white/5 rounded-2xl border border-white/10 p-3 backdrop-blur-xl">
      {/* Search Category Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-3 overflow-x-auto scrollbar-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border shrink-0 ${
                isActive
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                  : 'bg-transparent border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Display */}
      {activeTab === 'images' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredResults.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative rounded-xl overflow-hidden border border-white/10 bg-black/40 aspect-video hover:border-amber-400/50 transition-all"
            >
              <img
                src={item.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(item.title)}/300/200`}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-white line-clamp-1">{item.title}</span>
                <span className="text-[9px] text-amber-300 truncate">{item.domain}</span>
              </div>
            </a>
          ))}
        </div>
      ) : activeTab === 'videos' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredResults.map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/50 transition-all flex gap-3 items-center group"
            >
              <div className="w-20 h-14 rounded-lg bg-white/10 flex items-center justify-center shrink-0 border border-white/10 text-amber-400 group-hover:scale-105 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <div className="overflow-hidden">
                <h4 className="text-xs font-bold text-gray-200 group-hover:text-amber-300 truncate">{item.title}</h4>
                <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">{item.snippet}</p>
                <span className="text-[10px] text-cyan-400 font-mono mt-1 block">{item.domain}</span>
              </div>
            </a>
          ))}
        </div>
      ) : (
        /* Web & News Tab Cards List */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {filteredResults.slice(0, 6).map((item, idx) => (
            <a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-black/40 border border-white/10 hover:border-amber-400/40 hover:bg-white/5 transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] text-amber-300/80 mb-1">
                  <span className="font-mono truncate">{item.domain}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-xs font-bold text-gray-200 group-hover:text-white line-clamp-1">
                  [{idx + 1}] {item.title}
                </h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                  {item.snippet}
                </p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
