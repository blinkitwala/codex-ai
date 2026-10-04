'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Mic, Search, Globe, Cpu, X, FileText, Image as ImageIcon, Sparkles, ChevronDown } from 'lucide-react';
import { Attachment } from '@/lib/types';

interface ChatInputProps {
  onSend: (
    prompt: string,
    attachments: Attachment[],
    isSearchEnabled: boolean,
    isDeepSearch: boolean,
    activeSearchTab: 'web' | 'images' | 'news' | 'videos'
  ) => void;
  isLoading: boolean;
  onVoiceClick: () => void;
  isListening?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  isLoading,
  onVoiceClick,
  isListening = false
}) => {
  const [prompt, setPrompt] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isSearchEnabled, setIsSearchEnabled] = useState(false);
  const [isDeepSearch, setIsDeepSearch] = useState(false);
  const [activeSearchTab, setActiveSearchTab] = useState<'web' | 'images' | 'news' | 'videos'>('web');
  const [selectedModel, setSelectedModel] = useState('Codex_Pro (Default)');
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [prompt]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setAttachments(prev => [
          ...prev,
          {
            id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl
          }
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!prompt.trim() && attachments.length === 0) || isLoading) return;

    onSend(prompt.trim(), attachments, isSearchEnabled, isDeepSearch, activeSearchTab);
    setPrompt('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 my-4">
      
      {/* Attachment Previews Bar */}
      {attachments.length > 0 && (
        <div className="flex items-center gap-2 mb-2 px-3 overflow-x-auto py-1.5 scrollbar-none">
          {attachments.map(att => (
            <div
              key={att.id}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl text-xs text-gray-200 shadow-md shrink-0"
            >
              {att.type.startsWith('image/') ? (
                <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
              ) : (
                <FileText className="w-3.5 h-3.5 text-cyan-300" />
              )}
              <span className="max-w-[120px] truncate">{att.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(att.id)}
                className="text-gray-400 hover:text-red-400"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Large Frosted Glass Input Container (Exact Replica of Image 1 Large Frosted Capsule!) */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-3xl bg-black/60 border border-white/15 backdrop-blur-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] focus-within:border-amber-500/50 transition-all p-3 md:p-4"
      >
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Codex_AI anything, analyze files, code, math or search web..."
          rows={1}
          className="w-full bg-transparent text-sm md:text-base text-gray-100 placeholder-gray-500 resize-none focus:outline-none scrollbar-none min-h-[44px] max-h-[180px] px-2"
        />

        {/* Action Controls Toolbar inside the Capsule (Matching Image 1 Action Row) */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 gap-2 flex-wrap">
          
          {/* Left Controls: File Attachment & AI Model Selector Badge */}
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple
              className="hidden"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-amber-300 transition-colors"
              title="Attach Image or Document"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Model Badge (Exact Replica from Image 1 "Open AI" badge) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-medium transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{selectedModel}</span>
                <ChevronDown className="w-3 h-3 text-amber-400" />
              </button>

              {showModelDropdown && (
                <div className="absolute left-0 bottom-full mb-2 w-48 rounded-2xl bg-black/95 border border-white/20 backdrop-blur-2xl shadow-2xl p-2 z-50 space-y-1">
                  {['Codex_Pro (Default)', 'Codex_DeepSearch', 'Codex_Fast'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => { setSelectedModel(m); setShowModelDropdown(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                        selectedModel === m ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Multi-Engine Web Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsSearchEnabled(!isSearchEnabled);
                if (isDeepSearch) setIsDeepSearch(false);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                isSearchEnabled && !isDeepSearch
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(226,181,64,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Web Search</span>
            </button>

            {/* Deep Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setIsDeepSearch(!isDeepSearch);
                if (!isDeepSearch) setIsSearchEnabled(true);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all border ${
                isDeepSearch
                  ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/30 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.3)]'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-gray-200'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Deep Search</span>
            </button>
          </div>

          {/* Right Controls: Microphone & Glowing Arrow Send Button */}
          <div className="flex items-center gap-2 ml-auto">
            
            {/* STT Speech Input Button */}
            <button
              type="button"
              onClick={onVoiceClick}
              className={`p-2.5 rounded-full border transition-all ${
                isListening
                  ? 'bg-red-500/30 border-red-400 text-red-300 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-gray-300 hover:text-cyan-300'
              }`}
              title="Speech-to-Text Voice Mode"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Submit Arrow Button (Matching Gold Arrow Button from Image 1) */}
            <button
              type="submit"
              disabled={(!prompt.trim() && attachments.length === 0) || isLoading}
              className={`p-3 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-300 text-black font-bold transition-all shadow-[0_0_20px_rgba(226,181,64,0.4)] ${
                (!prompt.trim() && attachments.length === 0) || isLoading
                  ? 'opacity-40 cursor-not-allowed'
                  : 'hover:scale-105 active:scale-95'
              }`}
              title="Send Prompt"
            >
              <Send className="w-4 h-4 transform rotate-45 -translate-y-0.5" />
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};
