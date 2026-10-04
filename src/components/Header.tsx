'use client';

import React from 'react';
import { Sparkles, Download, LogOut, User as UserIcon, Menu, Bot } from 'lucide-react';
import { User } from '@/lib/types';

interface HeaderProps {
  user: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onInstallPwa: () => void;
  isInstallable: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onLogout,
  onToggleSidebar,
  onInstallPwa,
  isInstallable
}) => {
  return (
    <header className="w-full flex flex-col items-center justify-between pt-4 pb-3 px-4 md:px-8 border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-40 transition-all duration-300 shadow-2xl">
      
      {/* Top Branding Section (Required: Created by Shreyash and Sibtain at very top, Codex_AI below it) */}
      <div className="text-center my-1 select-none flex flex-col items-center">
        <span className="text-[11px] md:text-xs font-semibold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 uppercase drop-shadow-[0_0_8px_rgba(226,181,64,0.4)]">
          Created by Shreyash and Sibtain
        </span>
        <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2 drop-shadow-[0_0_20px_rgba(0,242,254,0.3)]">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-400 to-cyan-400">
            Codex_AI
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium tracking-normal align-middle">
            Pro
          </span>
        </h1>
      </div>

      {/* Top Control Bar (Sidebar button, PWA Install, User Profile) */}
      <div className="w-full flex items-center justify-between mt-2">
        <button
          onClick={onToggleSidebar}
          className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2 text-sm font-medium"
          title="Toggle Chat History"
        >
          <Menu className="w-5 h-5 text-amber-400" />
          <span className="hidden md:inline">History</span>
        </button>

        <div className="flex items-center gap-3">
          {/* PWA App Install Button */}
          {isInstallable && (
            <button
              onClick={onInstallPwa}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-black font-semibold text-xs md:text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all transform hover:scale-105"
            >
              <Download className="w-4 h-4" />
              <span>Install App</span>
            </button>
          )}

          {/* User Account / Login Button */}
          {user ? (
            <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-cyan-400 flex items-center justify-center text-black font-bold text-xs overflow-hidden shadow-inner">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <span className="text-xs md:text-sm text-gray-200 font-medium hidden sm:inline">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-medium text-xs md:text-sm shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <UserIcon className="w-4 h-4" />
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
