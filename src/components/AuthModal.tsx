'use client';

import React, { useState } from 'react';
import { Lock, Mail, User as UserIcon, Sparkles, Chrome, AlertCircle, ArrowRight, X } from 'lucide-react';
import { User } from '@/lib/types';

interface AuthModalProps {
  isOpen: boolean;
  onSuccess: (user: User) => void;
  onClose?: () => void;
  canClose?: boolean;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onSuccess,
  onClose,
  canClose = false
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAuthResponse = (data: any) => {
    if (data.user) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('codex_user', JSON.stringify(data.user));
        if (data.token) localStorage.setItem('codex_token', data.token);
      }
      onSuccess(data.user);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please fill in both email and password.');
      return;
    }

    if (cleanPassword.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const body = isLogin 
        ? { email: cleanEmail, password: cleanPassword } 
        : { email: cleanEmail, password: cleanPassword, name: name.trim() };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Authentication failed. Please check inputs.');
      } else {
        handleAuthResponse(data);
      }
    } catch (err: any) {
      setError('Network error during authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const cleanEmail = email.trim();
      const lastEmail = typeof window !== 'undefined' ? localStorage.getItem('codex_last_google_email') : null;
      const targetEmail = cleanEmail || lastEmail || 'google.user@codex.ai';
      const targetName = name.trim() || (cleanEmail ? cleanEmail.split('@')[0] : 'Google User');

      const googleUser = {
        name: targetName,
        email: targetEmail
      };

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(googleUser)
      });

      const data = await res.json();
      if (data.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('codex_last_google_email', data.user.email);
        }
        handleAuthResponse(data);
      } else {
        setError(data.error || 'Google Sign-In failed.');
      }
    } catch (err) {
      setError('Google Sign-In error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-black/90 border border-white/20 p-6 md:p-8 shadow-[0_0_60px_rgba(226,181,64,0.2)] select-none relative">
        {canClose && onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {/* Header Branding */}
        <div className="text-center mb-6">
          <span className="text-[11px] font-bold tracking-widest text-amber-300 uppercase">
            Created by Shreyash and Sibtain
          </span>
          <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Codex_AI Access</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            {isLogin ? 'Sign in to access chats & multi-search' : 'Create your account to get started'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs md:text-sm flex items-center justify-center gap-3 transition-all mb-4 group shadow-md"
        >
          <Chrome className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Or with Email</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <div className="relative">
              <UserIcon className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="password"
              required
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-black font-bold text-xs md:text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login / Register */}
        <div className="mt-5 text-center">
          <button
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-xs text-gray-400 hover:text-amber-300 transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
          </button>
        </div>

      </div>
    </div>
  );
};
