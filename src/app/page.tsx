'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { GlowingOrb } from '@/components/GlowingOrb';
import { QuickCards } from '@/components/QuickCards';
import { ChatInput } from '@/components/ChatInput';
import { ChatArea } from '@/components/ChatArea';
import { AuthModal } from '@/components/AuthModal';
import { VoiceOverlay } from '@/components/VoiceOverlay';
import { PwaInstallPrompt } from '@/components/PwaInstallPrompt';
import { User, ChatSession, Message, Attachment, SearchResult } from '@/lib/types';
import { ttsManager } from '@/lib/tts';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Voice state
  const [isVoiceOverlayOpen, setIsVoiceOverlayOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [speakingText, setSpeakingText] = useState<string | undefined>(undefined);
  const [recognition, setRecognition] = useState<any>(null);

  // PWA Install Prompt state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isPwaModalOpen, setIsPwaModalOpen] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  // Check auth session on load
  useEffect(() => {
    checkAuthSession();

    // Listen for PWA beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Fetch chats when user changes
  useEffect(() => {
    if (user) {
      fetchUserChats(user.id);
    } else {
      setChats([]);
      setActiveChatId(null);
      setMessages([]);
      setIsAuthModalOpen(true); // Must log in first
    }
  }, [user]);

  const checkAuthSession = async () => {
    try {
      let savedUser: User | null = null;
      let token: string | null = null;

      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('codex_user');
        token = localStorage.getItem('codex_token');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.id) {
              savedUser = parsed;
            }
          } catch (e) {}
        }
      }

      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/auth/me${savedUser?.id ? `?userId=${savedUser.id}` : ''}`, {
        headers,
        credentials: 'include'
      });

      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          setIsAuthModalOpen(false);
          if (typeof window !== 'undefined') {
            localStorage.setItem('codex_user', JSON.stringify(data.user));
          }
          return;
        }
      }

      if (savedUser) {
        setUser(savedUser);
        setIsAuthModalOpen(false);
        return;
      }

      // If no valid session exists, prompt sign-in / registration
      setUser(null);
      setIsAuthModalOpen(true);
    } catch (err) {
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('codex_user');
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            if (parsed && parsed.id) {
              setUser(parsed);
              setIsAuthModalOpen(false);
              return;
            }
          } catch (e) {}
        }
      }
      setUser(null);
      setIsAuthModalOpen(true);
    }
  };

  const handleLogout = async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('codex_user');
      localStorage.removeItem('codex_token');
      localStorage.removeItem('codex_last_google_email');
    }
    await fetch('/api/auth/me', { method: 'DELETE' }).catch(() => {});
    setUser(null);
    setActiveChatId(null);
    setMessages([]);
    setChats([]);
    setIsAuthModalOpen(true);
  };

  const fetchUserChats = async (userId: string) => {
    try {
      const res = await fetch(`/api/chat/history?userId=${userId}`);
      const data = await res.json();
      if (data.chats) {
        setChats(data.chats);
      }
    } catch (err) {
      console.warn('Failed to load chats:', err);
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setActiveChatId(chatId);
    if (!user) return;
    try {
      const res = await fetch(`/api/chat/history?userId=${user.id}&chatId=${chatId}`);
      const data = await res.json();
      if (data.chat && data.chat.messages) {
        setMessages(data.chat.messages);
      }
    } catch (err) {
      console.warn('Failed to load chat details:', err);
    }
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setIsSidebarOpen(false);
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!user) return;
    try {
      await fetch(`/api/chat/history?userId=${user.id}&chatId=${chatId}`, { method: 'DELETE' });
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (activeChatId === chatId) {
        handleNewChat();
      }
    } catch (err) {
      console.warn('Failed to delete chat:', err);
    }
  };

  const handleRenameChat = async (chatId: string, newTitle: string) => {
    if (!user) return;
    try {
      const res = await fetch('/api/chat/history', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, chatId, title: newTitle })
      });
      const data = await res.json();
      if (data.chat) {
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, title: newTitle } : c));
      }
    } catch (err) {
      console.warn('Failed to rename chat:', err);
    }
  };

  // Main Streaming Handler
  const handleSendPrompt = async (
    promptText: string,
    attachments: Attachment[] = [],
    isSearchEnabled: boolean = false,
    isDeepSearch: boolean = false,
    activeSearchTab: 'web' | 'images' | 'news' | 'videos' = 'web'
  ) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    const currentId = activeChatId || `chat-${Date.now()}`;
    if (!activeChatId) {
      setActiveChatId(currentId);
    }

    // Add User Message immediately
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      chatId: currentId,
      role: 'user',
      content: promptText,
      timestamp: new Date().toISOString(),
      attachments
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentId,
          userId: user.id,
          prompt: promptText,
          attachments,
          isSearchEnabled,
          isDeepSearch,
          activeSearchTab
        })
      });

      if (!response.ok || !response.body) {
        throw new Error('Streaming connection failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let assistantMsgId = `msg-${Date.now()}-assistant`;
      let metaParsed = false;
      let accumulatedContent = '';
      let searchResults: SearchResult[] = [];

      // Add empty placeholder assistant message
      setMessages(prev => [
        ...prev,
        {
          id: assistantMsgId,
          chatId: currentId,
          role: 'assistant',
          content: '',
          timestamp: new Date().toISOString()
        }
      ]);

      let rawBuffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        rawBuffer += chunkStr;

        if (!metaParsed && rawBuffer.includes('---CODEX_SPLIT---')) {
          const [metaStr, contentStr] = rawBuffer.split('\n---CODEX_SPLIT---\n');
          try {
            const meta = JSON.parse(metaStr);
            searchResults = meta.searchResults || [];
          } catch (e) {}
          metaParsed = true;
          accumulatedContent += contentStr || '';
        } else if (metaParsed) {
          accumulatedContent += chunkStr;
        }

        // Update assistant message with typewriter text stream
        setMessages(prev =>
          prev.map(msg =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  content: accumulatedContent,
                  searchResults: searchResults.length > 0 ? searchResults : undefined,
                  activeSearchTab,
                  isDeepSearch
                }
              : msg
          )
        );
      }

      // Refresh chats sidebar list
      fetchUserChats(user.id);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          chatId: currentId,
          role: 'assistant',
          content: `⚠️ Error processing request: ${err.message || 'Please check your connection.'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Speech Recognition STT Handler
  const handleStartListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Brave.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = 'en-US';

    rec.onstart = () => {
      setIsListening(true);
      setSpeechTranscript('');
    };

    rec.onresult = (event: any) => {
      let current = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        current += event.results[i][0].transcript;
      }
      setSpeechTranscript(current);
    };

    rec.onerror = (e: any) => {
      console.warn('Speech recognition error:', e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setRecognition(rec);
    rec.start();
  };

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsListening(false);
    if (speechTranscript.trim()) {
      handleSendPrompt(speechTranscript.trim());
      setIsVoiceOverlayOpen(false);
    }
  };

  const handleSpeakText = (text: string) => {
    setSpeakingText(text);
    setIsVoiceOverlayOpen(true);
  };

  const handlePwaInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choice: any) => {
        if (choice.outcome === 'accepted') {
          setIsInstallable(false);
        }
        setDeferredPrompt(null);
      });
    } else {
      setIsPwaModalOpen(true);
    }
  };

  return (
    <div className="flex h-screen w-full bg-codex-bg overflow-hidden relative">
      
      {/* Sidebar Component */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
      />

      {/* Main Workspace Container */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto relative scrollbar-thin">
        
        {/* Header Bar */}
        <Header
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onInstallPwa={handlePwaInstall}
          isInstallable={isInstallable}
        />

        {/* Dynamic Main Body Content */}
        <main className="flex-1 flex flex-col items-center justify-between p-4 md:p-6 w-full max-w-5xl mx-auto">
          
          {/* Welcome Screen (When no messages yet) matching Image 1 & Image 2 layout */}
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto w-full space-y-6">
              
              {/* Central Glowing Orb matching Image 2! */}
              <GlowingOrb
                state={isLoading ? 'thinking' : 'idle'}
                size="lg"
                onClick={() => setIsVoiceOverlayOpen(true)}
              />

              {/* Big Bold Headline (Matching Image 1: "Welcome back Alex!") */}
              <div className="space-y-2 select-none">
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
                  Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-yellow-400 to-cyan-400">{user ? user.name : 'Guest'}</span>!
                </h2>
                <p className="text-xs md:text-sm text-gray-400 font-medium">
                  Created by Shreyash and Sibtain • Which code, search query or task do you want to run today?
                </p>
              </div>

              {/* Central Large Rounded Frosted Capsule Input (Image 1) */}
              <ChatInput
                onSend={handleSendPrompt}
                isLoading={isLoading}
                onVoiceClick={() => setIsVoiceOverlayOpen(true)}
                isListening={isListening}
              />

              {/* 4 Feature Quick Cards (Image 1 bottom action cards) */}
              <QuickCards
                onCardClick={(prompt, searchMode, deepSearchMode) => {
                  handleSendPrompt(prompt, [], searchMode, deepSearchMode, 'web');
                }}
              />

            </div>
          ) : (
            /* Active Conversation Screen */
            <div className="w-full flex-1 flex flex-col justify-between pt-4">
              <ChatArea
                messages={messages}
                isLoading={isLoading}
                onRegenerate={() => {
                  const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
                  if (lastUserMsg) {
                    handleSendPrompt(lastUserMsg.content, lastUserMsg.attachments, false, false, 'web');
                  }
                }}
                onSpeak={handleSpeakText}
              />

              {/* Fixed Bottom Input Bar for Active Chat */}
              <div className="sticky bottom-0 w-full pt-2 pb-4 bg-gradient-to-t from-black via-black/90 to-transparent">
                <ChatInput
                  onSend={handleSendPrompt}
                  isLoading={isLoading}
                  onVoiceClick={() => setIsVoiceOverlayOpen(true)}
                  isListening={isListening}
                />
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onSuccess={(u) => { setUser(u); setIsAuthModalOpen(false); }}
        onClose={() => { if (user) setIsAuthModalOpen(false); }}
        canClose={!!user}
      />

      {/* Voice Overlay Modal */}
      <VoiceOverlay
        isOpen={isVoiceOverlayOpen}
        onClose={() => setIsVoiceOverlayOpen(false)}
        isListening={isListening}
        transcript={speechTranscript}
        onStartListening={handleStartListening}
        onStopListening={handleStopListening}
        currentSpeakingText={speakingText}
      />

      {/* PWA App Install Modal */}
      <PwaInstallPrompt
        isOpen={isPwaModalOpen}
        onClose={() => setIsPwaModalOpen(false)}
        onInstall={handlePwaInstall}
        isInstallable={isInstallable}
      />

    </div>
  );
}
