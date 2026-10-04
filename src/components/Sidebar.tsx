'use client';

import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Check, X, MessageSquare, Sparkles, ChevronLeft, ShieldCheck } from 'lucide-react';
import { ChatSession } from '@/lib/types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chats: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onRenameChat
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const filteredChats = chats.filter(c => 
    c.title.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Group chats by categories matching Image 1
  const categories = ['Today', 'Yesterday', '3 days ago', '7 days ago', 'Last 30 days'] as const;

  const groupedChats = categories.map(cat => ({
    category: cat,
    items: filteredChats.filter(c => c.category === cat)
  })).filter(group => group.items.length > 0);

  const startRename = (chat: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditingTitle(chat.title);
  };

  const saveRename = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingTitle.trim()) {
      onRenameChat(chatId, editingTitle.trim());
    }
    setEditingChatId(null);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer Container (Matching Image 1 Dark Metallic Design) */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-80 bg-black/90 border-r border-white/10 backdrop-blur-2xl transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 shadow-2xl`}
      >
        {/* Top Header: New Chat & Close */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between gap-2">
          <button
            onClick={onNewChat}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-cyan-500/20 hover:from-amber-500/30 hover:to-cyan-500/30 border border-amber-500/40 text-amber-300 font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md group"
          >
            <Plus className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>New Chat</span>
          </button>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 lg:hidden"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Search Chat Input (Matching Image 1 search bar) */}
        <div className="p-4 border-b border-white/5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            />
          </div>
        </div>

        {/* Categorized Chat History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10">
          {groupedChats.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-xs flex flex-col items-center gap-2">
              <MessageSquare className="w-8 h-8 text-gray-600" />
              <span>No chat history found</span>
            </div>
          ) : (
            groupedChats.map(group => (
              <div key={group.category} className="space-y-2">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2">
                  {group.category}
                </h3>
                <div className="space-y-1">
                  {group.items.map(chat => {
                    const isActive = activeChatId === chat.id;
                    const isEditing = editingChatId === chat.id;

                    return (
                      <div
                        key={chat.id}
                        onClick={() => onSelectChat(chat.id)}
                        className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer transition-all border ${
                          isActive
                            ? 'bg-amber-500/15 border-amber-500/40 text-amber-200 shadow-md'
                            : 'bg-white/5 hover:bg-white/10 border-transparent text-gray-300 hover:text-white'
                        }`}
                      >
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 w-full">
                            <input
                              type="text"
                              value={editingTitle}
                              onChange={(e) => setEditingTitle(e.target.value)}
                              className="flex-1 bg-black/60 border border-amber-400 rounded px-2 py-1 text-xs text-white focus:outline-none"
                              autoFocus
                            />
                            <button
                              onClick={(e) => saveRename(chat.id, e)}
                              className="p-1 text-green-400 hover:text-green-300"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setEditingChatId(null); }}
                              className="p-1 text-gray-400 hover:text-gray-300"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-center gap-2.5 overflow-hidden flex-1">
                              <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                              <span className="text-xs truncate font-medium">
                                {chat.title}
                              </span>
                            </div>

                            {/* Action Buttons on hover */}
                            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                              <button
                                onClick={(e) => startRename(chat, e)}
                                className="p-1 text-gray-400 hover:text-amber-300 transition-colors"
                                title="Rename"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); onDeleteChat(chat.id); }}
                                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Card (Exact replica of Image 1 bottom-left card: "Purchase / Pro features") */}
        <div className="p-4 border-t border-white/10">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20 border border-amber-500/30 flex items-center justify-between shadow-xl">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Codex_AI Pro Active</span>
              </div>
              <p className="text-[10px] text-gray-400">
                Created by Shreyash and Sibtain • Unlimited multi-search
              </p>
            </div>
            <div className="w-7 h-7 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
