'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface GlowingOrbProps {
  state?: 'idle' | 'thinking' | 'speaking' | 'listening';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export const GlowingOrb: React.FC<GlowingOrbProps> = ({
  state = 'idle',
  size = 'md',
  onClick
}) => {
  const dimensionClass = size === 'sm' ? 'w-20 h-20' : size === 'lg' ? 'w-48 h-48 md:w-56 md:h-56' : 'w-32 h-32 md:w-40 md:h-40';

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer flex items-center justify-center select-none group ${dimensionClass}`}
    >
      {/* Background Ambient Radial Glow (Gold / Cyan / Magenta glow matching Image 1 & 2) */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/30 via-cyan-500/20 to-purple-600/30 blur-3xl transform group-hover:scale-125 transition-transform duration-700 animate-pulse" />

      {/* Main Iridescent Rotating Ring (Matching Image 2) */}
      <motion.div
        className="absolute inset-0 rounded-full p-[3px] shadow-[0_0_50px_rgba(226,181,64,0.4)]"
        style={{
          background: 'conic-gradient(from 0deg, #ff4500, #ff8c00, #ffee00, #00ff66, #00ffff, #0066ff, #9900ff, #ff00cc, #ff4500)',
        }}
        animate={{
          rotate: state === 'thinking' ? 720 : 360,
          scale: state === 'speaking' ? [1, 1.08, 1, 1.05, 1] : state === 'listening' ? [1, 1.12, 1] : 1,
        }}
        transition={{
          rotate: { duration: state === 'thinking' ? 2.5 : 8, repeat: Infinity, ease: 'linear' },
          scale: { duration: state === 'speaking' ? 0.8 : 1.5, repeat: Infinity, ease: 'easeInOut' },
        }}
      >
        {/* Inner Dark Glass Sphere Core */}
        <div className="w-full h-full rounded-full bg-gradient-to-b from-black/90 via-slate-950/90 to-black/95 backdrop-blur-md flex items-center justify-center relative overflow-hidden border border-white/20">
          
          {/* Internal Shimmer / Liquid Waves */}
          <motion.div
            className="absolute inset-0 opacity-40 bg-gradient-to-tr from-cyan-400 via-transparent to-amber-300"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Central Two White Pill Eyes (Exact replica from Image 2!) */}
          <div className="flex items-center gap-3.5 z-10">
            {/* Left Eye */}
            <motion.div
              className="w-2.5 h-6 md:w-3 md:h-7 rounded-full bg-white shadow-[0_0_12px_#ffffff]"
              animate={{
                scaleY: state === 'speaking' ? [1, 0.4, 1.2, 0.8, 1] : state === 'listening' ? [1.2, 0.9, 1.2] : [1, 1, 0.1, 1],
              }}
              transition={{
                duration: state === 'speaking' ? 0.5 : 4,
                repeat: Infinity,
                times: state === 'speaking' ? undefined : [0, 0.92, 0.96, 1],
              }}
            />

            {/* Right Eye */}
            <motion.div
              className="w-2.5 h-6 md:w-3 md:h-7 rounded-full bg-white shadow-[0_0_12px_#ffffff]"
              animate={{
                scaleY: state === 'speaking' ? [1, 1.2, 0.4, 1.1, 1] : state === 'listening' ? [1.2, 0.9, 1.2] : [1, 1, 0.1, 1],
              }}
              transition={{
                duration: state === 'speaking' ? 0.5 : 4,
                repeat: Infinity,
                times: state === 'speaking' ? undefined : [0, 0.92, 0.96, 1],
              }}
            />
          </div>

          {/* Glowing Aura Ring overlay */}
          <div className="absolute inset-0 rounded-full border border-white/10 shadow-inner" />
        </div>
      </motion.div>
    </div>
  );
};
