
import React from 'react';

export const ErrorState: React.FC<{ error: string | null; onRetry: () => void }> = ({ error, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95">
      <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold mb-2">Generation Failed</h3>
      <p className="text-zinc-400 max-w-md mx-auto mb-8">
        {error || "Something went wrong while trying to animate your image. Please check your connection and try again."}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onRetry}
          className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-zinc-200 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="bg-zinc-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-zinc-700 transition-colors"
        >
          Refresh App
        </button>
      </div>
    </div>
  );
};
