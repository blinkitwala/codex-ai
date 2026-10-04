'use client';

import React, { useState } from 'react';
import { Check, Copy, Code as CodeIcon } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  code: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4 rounded-2xl overflow-hidden border border-white/15 bg-slate-950/90 shadow-2xl font-mono text-xs select-text">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-white/10 text-gray-400">
        <div className="flex items-center gap-2">
          <CodeIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[11px] font-semibold text-gray-300 uppercase tracking-wider">
            {language || 'code'}
          </span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors text-[11px]"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-400" />
              <span className="text-green-400 font-semibold">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy Code</span>
            </>
          )}
        </button>
      </div>

      {/* Code Container */}
      <div className="p-4 overflow-x-auto text-gray-200 leading-relaxed scrollbar-thin">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};
