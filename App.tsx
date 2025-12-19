
import React, { useState, useEffect, useCallback } from 'react';
import { AppState, VideoResult, AspectRatio, VideoResolution } from './types';
import { generateVeoVideo } from './services/geminiService';
import { Header } from './components/Header';
import { InitialState } from './components/InitialState';
import { GenerationState } from './components/GenerationState';
import { SuccessState } from './components/SuccessState';
import { ErrorState } from './components/ErrorState';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UNAUTHORIZED);
  const [selectedImage, setSelectedImage] = useState<{data: string; type: string} | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('16:9');
  const [resolution, setResolution] = useState<VideoResolution>('720p');
  const [prompt, setPrompt] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('Starting engine...');
  const [result, setResult] = useState<VideoResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // @ts-ignore - aistudio is globally injected
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setAppState(hasKey ? AppState.IDLE : AppState.UNAUTHORIZED);
      } catch (e) {
        setAppState(AppState.UNAUTHORIZED);
      }
    };
    checkAuth();
  }, []);

  const handleOpenAuth = async () => {
    try {
      // @ts-ignore - aistudio is globally injected
      await window.aistudio.openSelectKey();
      // Assume success and proceed to mitigate race conditions
      setAppState(AppState.IDLE);
      setError(null);
    } catch (err) {
      console.error("Auth dialog error:", err);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setSelectedImage({ data: base64, type: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async () => {
    if (!selectedImage) return;

    setAppState(AppState.GENERATING);
    setError(null);

    try {
      const videoUrl = await generateVeoVideo(
        selectedImage.data,
        selectedImage.type,
        prompt,
        aspectRatio,
        resolution,
        setLoadingMessage
      );

      setResult({
        url: videoUrl,
        prompt: prompt || 'Automatic Animation',
        timestamp: Date.now(),
        resolution: resolution,
        aspectRatio: aspectRatio
      });
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error("Generation error details:", err);
      const errorMsg = err.message || JSON.stringify(err);
      
      // Specifically handle auth related errors by prompting re-selection
      if (
        errorMsg.includes("Requested entity was not found") || 
        errorMsg.includes("API keys are not supported") ||
        errorMsg.includes("UNAUTHENTICATED") ||
        errorMsg.includes("401")
      ) {
        setAppState(AppState.UNAUTHORIZED);
        setError("Your current API key is not supported for video generation. Please select a key from a PAID Google Cloud Project.");
      } else {
        setError(errorMsg || "An unexpected error occurred during generation.");
        setAppState(AppState.ERROR);
      }
    }
  };

  const reset = () => {
    setAppState(AppState.IDLE);
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start pb-20 px-4 md:px-8 bg-zinc-950 overflow-x-hidden">
      <div className="w-full max-w-5xl">
        <Header onReset={reset} />

        <main className="mt-8 w-full">
          {appState === AppState.UNAUTHORIZED && (
            <div className="flex flex-col items-center justify-center space-y-8 py-20 text-center animate-in fade-in duration-700">
              <div className="space-y-4">
                <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 11-12 0 6 6 0 0112 0zM13 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl font-bold tracking-tight">Authentication Required</h2>
                <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
                  Veo 3.1 video generation requires a <strong>paid</strong> API key from a Google Cloud Project with billing enabled.
                </p>
                <div className="pt-2">
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium flex items-center justify-center gap-1">
                    Check billing documentation
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="space-y-4 w-full max-w-sm">
                <button
                  onClick={handleOpenAuth}
                  className="w-full bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-zinc-200 transition-all shadow-lg shadow-white/5 active:scale-95"
                >
                  {error ? "Re-select API Key" : "Select Paid API Key"}
                </button>
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-400 text-sm leading-relaxed">{error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {appState === AppState.IDLE && (
            <InitialState
              selectedImage={selectedImage}
              aspectRatio={aspectRatio}
              resolution={resolution}
              prompt={prompt}
              onFileSelect={handleFileSelect}
              onAspectRatioChange={setAspectRatio}
              onResolutionChange={setResolution}
              onPromptChange={setPrompt}
              onGenerate={handleGenerate}
            />
          )}

          {appState === AppState.GENERATING && (
            <GenerationState message={loadingMessage} image={selectedImage?.data} />
          )}

          {appState === AppState.SUCCESS && result && (
            <SuccessState result={result} onReset={reset} />
          )}

          {appState === AppState.ERROR && (
            <ErrorState error={error} onRetry={reset} />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
