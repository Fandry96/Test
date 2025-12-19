
import React from 'react';
import { AspectRatio, VideoResolution } from '../types';

interface Props {
  selectedImage: { data: string; type: string } | null;
  aspectRatio: AspectRatio;
  resolution: VideoResolution;
  prompt: string;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAspectRatioChange: (ratio: AspectRatio) => void;
  onResolutionChange: (res: VideoResolution) => void;
  onPromptChange: (val: string) => void;
  onGenerate: () => void;
}

export const InitialState: React.FC<Props> = ({
  selectedImage,
  aspectRatio,
  resolution,
  prompt,
  onFileSelect,
  onAspectRatioChange,
  onResolutionChange,
  onPromptChange,
  onGenerate
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="lg:col-span-7 space-y-8">
        <div className="relative group">
          <input
            type="file"
            accept="image/*"
            onChange={onFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className={`
              block w-full aspect-video rounded-3xl border-2 border-dashed border-zinc-800 
              flex flex-col items-center justify-center cursor-pointer transition-all duration-300
              ${selectedImage ? 'bg-transparent border-transparent' : 'bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700'}
            `}
          >
            {selectedImage ? (
              <img 
                src={`data:${selectedImage.type};base64,${selectedImage.data}`} 
                className="w-full h-full object-contain rounded-2xl shadow-2xl" 
                alt="Upload preview"
              />
            ) : (
              <>
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-zinc-300 font-medium">Drop your photo here</p>
                <p className="text-zinc-500 text-sm mt-1">PNG, JPG up to 10MB</p>
              </>
            )}
          </label>
          
          {selectedImage && (
            <button 
              onClick={(e) => { e.stopPropagation(); onFileSelect({ target: { files: null } } as any); }}
              className="absolute top-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-black transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="space-y-4">
          <label className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Cinematic Directions</label>
          <textarea
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="Describe the motion: 'Subtle swaying trees', 'The bird blinking its eyes and turning its head', 'Soft lighting shift'..."
            className="w-full bg-zinc-900/80 border border-zinc-800 rounded-2xl p-4 min-h-[120px] focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-zinc-600"
          />
        </div>
      </div>

      <div className="lg:col-span-5 space-y-10">
        <div className="space-y-8">
          <h2 className="text-3xl font-bold">Animation Settings</h2>
          
          <div className="space-y-4">
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Aspect Ratio</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onAspectRatioChange('16:9')}
                className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${aspectRatio === '16:9' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                <div className="w-10 h-6 border-2 border-current rounded-sm opacity-50" />
                <span className="font-medium text-xs">Landscape (16:9)</span>
              </button>
              <button
                onClick={() => onAspectRatioChange('9:16')}
                className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${aspectRatio === '9:16' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                <div className="w-6 h-10 border-2 border-current rounded-sm opacity-50" />
                <span className="font-medium text-xs">Portrait (9:16)</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Quality / Resolution</p>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => onResolutionChange('720p')}
                className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${resolution === '720p' ? 'bg-zinc-200 border-zinc-100 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                <span className="font-bold text-lg">720p</span>
                <span className="text-[10px] uppercase font-medium opacity-60">Standard HD</span>
              </button>
              <button
                onClick={() => onResolutionChange('1080p')}
                className={`py-4 rounded-2xl border transition-all flex flex-col items-center gap-1 ${resolution === '1080p' ? 'bg-zinc-200 border-zinc-100 text-black' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
              >
                <span className="font-bold text-lg">1080p</span>
                <span className="text-[10px] uppercase font-medium opacity-60">Full HD</span>
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-zinc-900">
            <div className="flex items-center gap-3 text-zinc-400">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              <span className="text-sm">Veo 3.1 Fast Preview Model</span>
            </div>
          </div>
        </div>

        <button
          onClick={onGenerate}
          disabled={!selectedImage}
          className={`
            w-full py-6 rounded-full font-bold text-lg transition-all shadow-xl
            ${selectedImage ? 'bg-white text-black hover:scale-[1.02] active:scale-95' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
          `}
        >
          {selectedImage ? 'Animate Now' : 'Select an Image to Begin'}
        </button>
      </div>
    </div>
  );
};
