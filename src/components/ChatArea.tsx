'use client';

import React, { useState } from 'react';
import { Bot, User as UserIcon, Copy, Check, Volume2, RotateCcw, ExternalLink, Cpu, Globe, Image as ImageIcon } from 'lucide-react';
import { Message } from '@/lib/types';
import { CodeBlock } from './CodeBlock';
import { SearchTabs } from './SearchTabs';
import { ttsManager } from '@/lib/tts';

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
  onRegenerate: () => void;
  onSpeak: (text: string) => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  isLoading,
  onRegenerate,
  onSpeak
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const renderFormattedContent = (content: string) => {
    // Parse code blocks ```lang ... ```
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', value: content.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', language: match[1] || 'plaintext', value: match[2] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push({ type: 'text', value: content.substring(lastIndex) });
    }

    return parts.map((part, i) => {
      if (part.type === 'code') {
        return <CodeBlock key={i} language={part.language || 'code'} code={part.value || ''} />;
      }
      return (
        <div key={i} className="prose prose-invert max-w-none space-y-2 leading-relaxed text-sm md:text-base">
          {part.value.split('\n').map((line, lineIdx) => {
            if (line.startsWith('### ')) {
              return <h3 key={lineIdx} className="text-base md:text-lg font-extrabold text-amber-300 mt-4 mb-2">{line.replace('### ', '')}</h3>;
            }
            if (line.startsWith('#### ')) {
              return <h4 key={lineIdx} className="text-sm md:text-base font-bold text-cyan-300 mt-3 mb-1">{line.replace('#### ', '')}</h4>;
            }
            if (line.startsWith('* ') || line.startsWith('- ')) {
              return (
                <div key={lineIdx} className="flex items-start gap-2 ml-2 my-1">
                  <span className="text-amber-400 mt-1">•</span>
                  <span>{line.replace(/^[*|-]\s*/, '')}</span>
                </div>
              );
            }
            return <p key={lineIdx} className="min-h-[1.2em]">{line}</p>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-28 px-2 md:px-0">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-3 md:gap-4 ${
              isUser ? 'flex-row-reverse' : 'flex-row'
            } animate-fadeIn`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 md:w-9 md:h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${
                isUser
                  ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white'
                  : 'bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 text-black font-extrabold shadow-[0_0_15px_rgba(226,181,64,0.4)]'
              }`}
            >
              {isUser ? <UserIcon className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Bubble Container */}
            <div className={`flex-1 max-w-[88%] space-y-3`}>
              <div
                className={`p-4 md:p-5 rounded-3xl border backdrop-blur-2xl shadow-2xl ${
                  isUser
                    ? 'bg-blue-600/20 border-blue-400/30 text-gray-100 rounded-tr-none ml-auto'
                    : 'bg-black/60 border-white/15 text-gray-100 rounded-tl-none'
                }`}
              >
                {/* User Attachments */}
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3 border-b border-white/10 pb-2">
                    {msg.attachments.map((att) => (
                      <div key={att.id} className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl text-xs">
                        {att.type.startsWith('image/') && att.dataUrl ? (
                          <img src={att.dataUrl} alt={att.name} className="w-10 h-10 object-cover rounded-lg border border-white/20" />
                        ) : (
                          <span className="font-semibold text-amber-300">{att.name}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Deep Search / Web Search Badge Tag */}
                {!isUser && (msg.isDeepSearch || (msg.searchResults && msg.searchResults.length > 0)) && (
                  <div className="flex items-center gap-2 mb-3">
                    {msg.isDeepSearch ? (
                      <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Cpu className="w-3 h-3" /> Deep Search Synthesized
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Multi-Engine Search Results
                      </span>
                    )}
                  </div>
                )}

                {/* Message Text & Code */}
                {renderFormattedContent(msg.content)}

                {/* Multi-Engine Search Tabs if present */}
                {!isUser && msg.searchResults && msg.searchResults.length > 0 && (
                  <SearchTabs
                    activeTab={msg.activeSearchTab || 'web'}
                    onSelectTab={() => {}}
                    searchResults={msg.searchResults}
                  />
                )}
              </div>

              {/* Message Action Bar (Copy, Deep Voice Speak, Regenerate) */}
              {!isUser && (
                <div className="flex items-center gap-3 px-2 text-xs text-gray-400">
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="flex items-center gap-1 hover:text-amber-300 transition-colors"
                  >
                    {copiedId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => onSpeak(msg.content)}
                    className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Speak (Deep Male Voice)</span>
                  </button>

                  <button
                    onClick={onRegenerate}
                    className="flex items-center gap-1 hover:text-yellow-300 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Indicator with Animated Orb (Matching Image 2 ball loading!) */}
      {isLoading && (
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-black/50 border border-white/10 backdrop-blur-xl animate-pulse w-fit">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-400 via-cyan-400 to-purple-500 animate-spin" />
          <span className="text-xs text-amber-300 font-semibold tracking-wide">
            Codex_AI is searching & synthesizing response...
          </span>
        </div>
      )}
    </div>
  );
};
