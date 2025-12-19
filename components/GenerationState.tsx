
import React from 'react';

export const GenerationState: React.FC<{ message: string; image?: string }> = ({ message, image }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-12 animate-in fade-in duration-1000">
      <div className="relative w-full max-w-xl aspect-video rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        {image && (
          <img 
            src={`data:image/png;base64,${image}`} 
            className="w-full h-full object-cover blur-md opacity-40 animate-subtle-zoom" 
            alt="Base image"
          />
        )}
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold tracking-tight">{message}</h3>
            <p className="text-zinc-500 text-sm">This usually takes about 30-60 seconds</p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-4">
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_30s_ease-in-out_infinite]"></div>
        </div>
        <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-zinc-600">
          <span>Analyzing</span>
          <span>Animating</span>
          <span>Rendering</span>
        </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
