
import React from 'react';

export const Header: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <header className="w-full py-8 flex items-center justify-between border-b border-zinc-800/50">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onReset}
      >
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">VEO<span className="gradient-text ml-2">Animator</span></h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Powered by Gemini 3.1</p>
        </div>
      </div>
      
      <nav className="hidden md:flex items-center gap-6">
        <a href="https://ai.google.dev" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Documentation</a>
        <button onClick={onReset} className="text-sm text-zinc-400 hover:text-white transition-colors">New Animation</button>
      </nav>
    </header>
  );
};
