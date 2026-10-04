'use client';

import React, { useState, useEffect } from 'react';
import { X, Mic, Volume2, VolumeX, Play, Pause, Square, Settings, RefreshCw } from 'lucide-react';
import { GlowingOrb } from './GlowingOrb';
import { ttsManager } from '@/lib/tts';

interface VoiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  transcript: string;
  onStartListening: () => void;
  onStopListening: () => void;
  currentSpeakingText?: string;
}

export const VoiceOverlay: React.FC<VoiceOverlayProps> = ({
  isOpen,
  onClose,
  isListening,
  transcript,
  onStartListening,
  onStopListening,
  currentSpeakingText
}) => {
  const [pitch, setPitch] = useState<number>(0.75); // Deep male pitch default
  const [rate, setRate] = useState<number>(0.92);   // Slower natural male rate default
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (currentSpeakingText) {
      setIsSpeaking(true);
      ttsManager.speak(
        currentSpeakingText,
        { pitch, rate, voiceName: '', autoSpeak: true },
        () => setIsSpeaking(false),
        () => setIsSpeaking(true)
      );
    }
  }, [currentSpeakingText]);

  if (!isOpen) return null;

  const handleStopSpeaking = () => {
    ttsManager.stop();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleTogglePause = () => {
    if (isPaused) {
      ttsManager.resume();
      setIsPaused(false);
    } else {
      ttsManager.pause();
      setIsPaused(true);
    }
  };

  const orbState = isListening ? 'listening' : isSpeaking ? 'speaking' : 'idle';

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-3xl flex flex-col items-center justify-between p-6 select-none animate-fadeIn">
      
      {/* Top Header */}
      <div className="w-full max-w-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
            Codex_AI Deep Male Voice
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-amber-300 transition-colors"
            title="Voice Pitch & Rate Controls"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={() => { handleStopSpeaking(); onClose(); }}
            className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Controls Dropdown */}
      {showSettings && (
        <div className="w-full max-w-xs bg-black/80 border border-amber-500/40 rounded-2xl p-4 space-y-3 z-50 text-xs shadow-2xl">
          <h4 className="font-bold text-amber-300 border-b border-white/10 pb-1">Deep Male Voice Settings</h4>
          <div>
            <label className="text-gray-300 flex justify-between">
              <span>Pitch (Lower = Deeper):</span>
              <span className="font-mono text-amber-400">{pitch.toFixed(2)}</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="1.2"
              step="0.05"
              value={pitch}
              onChange={(e) => setPitch(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <label className="text-gray-300 flex justify-between">
              <span>Speed Rate:</span>
              <span className="font-mono text-cyan-400">{rate.toFixed(2)}x</span>
            </label>
            <input
              type="range"
              min="0.7"
              max="1.5"
              step="0.05"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>
      )}

      {/* Central Animated Glowing Orb (Matching Image 2!) */}
      <div className="flex flex-col items-center justify-center my-auto">
        <GlowingOrb state={orbState} size="lg" />

        <div className="mt-8 text-center max-w-md px-4">
          <p className="text-sm font-medium text-gray-300 min-h-[30px] line-clamp-3">
            {isListening
              ? transcript || 'Listening... Speak now.'
              : isSpeaking
              ? 'Codex_AI is speaking in deep male voice...'
              : 'Tap microphone to talk to Codex_AI'}
          </p>
        </div>
      </div>

      {/* Bottom Voice Control Bar */}
      <div className="w-full max-w-md flex items-center justify-center gap-4 bg-white/5 border border-white/10 p-4 rounded-3xl backdrop-blur-2xl">
        
        {/* Microphone Button */}
        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`p-4 rounded-full border transition-all ${
            isListening
              ? 'bg-red-500/30 border-red-400 text-red-300 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.6)]'
              : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400 text-amber-300 shadow-[0_0_20px_rgba(226,181,64,0.4)]'
          }`}
        >
          <Mic className="w-6 h-6" />
        </button>

        {/* Speak / Pause / Stop TTS Controls */}
        {isSpeaking && (
          <>
            <button
              onClick={handleTogglePause}
              className="p-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white"
            >
              {isPaused ? <Play className="w-5 h-5 text-green-400" /> : <Pause className="w-5 h-5 text-yellow-400" />}
            </button>

            <button
              onClick={handleStopSpeaking}
              className="p-3 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400"
            >
              <Square className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

    </div>
  );
};
