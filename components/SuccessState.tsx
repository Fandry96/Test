
import React, { useState } from 'react';
import { VideoResult } from '../types';

interface Props {
  result: VideoResult;
  onReset: () => void;
}

export const SuccessState: React.FC<Props> = ({ result, onReset }) => {
  const [showMenu, setShowMenu] = useState(false);

  const downloadFile = (format: string) => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = `animated-photo-${result.timestamp}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowMenu(false);
  };

  return (
    <div className="flex flex-col items-center py-8 animate-in zoom-in-95 fade-in duration-500">
      <div className="w-full max-w-4xl space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold">Your Masterpiece</h2>
          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Options
                <svg className={`w-3 h-3 transition-transform ${showMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)}></div>
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="p-2 space-y-1">
                      <button 
                        onClick={() => downloadFile('mp4')}
                        className="w-full text-left px-4 py-3 hover:bg-zinc-800 rounded-xl transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-zinc-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold">MP4 Video</p>
                            <p className="text-[10px] text-zinc-500 uppercase">{result.resolution} • {result.aspectRatio}</p>
                          </div>
                        </div>
                        <svg className="w-4 h-4 text-zinc-600 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      
                      <button 
                        className="w-full text-left px-4 py-3 hover:bg-zinc-800 rounded-xl transition-colors flex items-center justify-between group opacity-50 cursor-not-allowed"
                        disabled
                      >
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div>
                            <p className="text-sm font-semibold">GIF Animation</p>
                            <p className="text-[10px] text-zinc-500 uppercase">Coming Soon</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <button 
              onClick={onReset}
              className="px-6 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded-full text-sm font-semibold transition-colors"
            >
              Start New
            </button>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-black aspect-video group">
          <video 
            src={result.url} 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
            <p className="text-zinc-300 italic max-w-lg">"{result.prompt}"</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Selected Resolution</span>
            <p className="font-semibold text-lg">{result.resolution === '1080p' ? 'Full HD (1080p)' : 'Standard HD (720p)'}</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Engine</span>
            <p className="font-semibold text-lg">Veo 3.1 Fast</p>
          </div>
          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 block mb-2">Format</span>
            <p className="font-semibold text-lg">H.264 MP4</p>
          </div>
        </div>
      </div>
    </div>
  );
};
