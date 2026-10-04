import { VoiceSettings } from './types';

export class VoiceManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  public isSpeaking: boolean = false;
  public isPaused: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public getDeepMaleVoice(): SpeechSynthesisVoice | null {
    const voices = this.getAvailableVoices();
    if (voices.length === 0) return null;

    // Search order for standard deep natural male voices across Windows / Mac / Chrome / Android
    const deepMaleKeywords = [
      'guy', 'david', 'george', 'daniel', 'james', 'google us english', 
      'male', 'alex', 'richard', 'mark', 'tom', 'microsoft mark', 'microsoft david'
    ];

    for (const kw of deepMaleKeywords) {
      const match = voices.find(v => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }

    // Fallback to any english voice
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    return enVoice || voices[0] || null;
  }

  public speak(
    text: string,
    settings: VoiceSettings = { pitch: 0.75, rate: 0.9, voiceName: '', autoSpeak: true },
    onEnd?: () => void,
    onStart?: () => void
  ) {
    if (!this.synth) return;

    this.stop(); // Cancel any ongoing speech

    // Clean markdown symbols from text before speaking
    const cleanText = text
      .replace(/```[\s\S]*?```/g, ' Code snippet omitted for speech. ')
      .replace(/`[^`]+`/g, '')
      .replace(/[*#_~>]/g, '')
      .replace(/\[\d+\]/g, '')
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Deep male voice pitch configuration (lower pitch = 0.7 - 0.85 for rich natural deep male tone)
    utterance.pitch = settings.pitch || 0.75;
    utterance.rate = settings.rate || 0.92;

    const selectedVoice = settings.voiceName 
      ? this.getAvailableVoices().find(v => v.name === settings.voiceName) || this.getDeepMaleVoice()
      : this.getDeepMaleVoice();

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.isPaused = false;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.isPaused = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback error:', e);
      this.isSpeaking = false;
      this.isPaused = false;
      if (onEnd) onEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.isPaused = false;
  }

  public pause() {
    if (this.synth && this.isSpeaking) {
      this.synth.pause();
      this.isPaused = true;
    }
  }

  public resume() {
    if (this.synth && this.isPaused) {
      this.synth.resume();
      this.isPaused = false;
    }
  }
}

export const ttsManager = new VoiceManager();
