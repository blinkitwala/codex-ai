'use client';

import React, { useState } from 'react';
import { Download, Smartphone, Monitor, CheckCircle, X, ChevronRight, Sparkles } from 'lucide-react';

interface PwaInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall: () => void;
  isInstallable: boolean;
}

export const PwaInstallPrompt: React.FC<PwaInstallPromptProps> = ({
  isOpen,
  onClose,
  onInstall,
  isInstallable
}) => {
  const [activeDeviceTab, setActiveDeviceTab] = useState<'android' | 'ios' | 'desktop'>('android');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn select-none">
      <div className="w-full max-w-lg rounded-3xl bg-black/90 border border-white/20 p-6 shadow-[0_0_60px_rgba(0,242,254,0.2)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-400 to-cyan-400 text-black font-bold">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Install Codex_AI App</h3>
              <p className="text-[11px] text-gray-400">Created by Shreyash and Sibtain • Phone & Desktop PWA</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct One-Click Install Button if supported */}
        {isInstallable && (
          <button
            onClick={() => { onInstall(); onClose(); }}
            className="w-full py-3 px-4 mb-5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-cyan-500 text-black font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 hover:scale-[1.02] transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Install Codex_AI App Immediately</span>
          </button>
        )}

        {/* Device Selection Tabs */}
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 mb-4">
          <button
            onClick={() => setActiveDeviceTab('android')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeDeviceTab === 'android' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-gray-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android</span>
          </button>

          <button
            onClick={() => setActiveDeviceTab('ios')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeDeviceTab === 'ios' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-gray-400'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone / iPad</span>
          </button>

          <button
            onClick={() => setActiveDeviceTab('desktop')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeDeviceTab === 'desktop' ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40' : 'text-gray-400'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows / Mac</span>
          </button>
        </div>

        {/* Installation Steps per OS */}
        <div className="space-y-3 bg-white/5 border border-white/10 p-4 rounded-2xl text-xs text-gray-300">
          {activeDeviceTab === 'android' && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                <span>Open **Codex_AI** in Chrome or Brave browser on Android.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                <span>Tap the top-right menu icon (⋮) and select **"Install app"** or **"Add to Home screen"**.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                <span>Codex_AI will launch standalone like a native phone app!</span>
              </div>
            </>
          )}

          {activeDeviceTab === 'ios' && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                <span>Open **Codex_AI** in Safari on iPhone or iPad.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                <span>Tap the **Share** button at bottom of screen.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                <span>Scroll down and select **"Add to Home Screen"**.</span>
              </div>
            </>
          )}

          {activeDeviceTab === 'desktop' && (
            <>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                <span>Open **Codex_AI** in Chrome, Edge, or Brave on Windows or Mac.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                <span>Click the install icon (⬇️) in the right side of the URL bar.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                <span>Click **Install** to add Codex_AI to your desktop apps!</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
