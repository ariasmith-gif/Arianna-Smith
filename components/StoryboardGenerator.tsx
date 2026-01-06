
import React, { useState } from 'react';
import { generateStoryboardImage } from '../services/geminiService';
import { StoryboardPanel } from '../types';

const StoryboardGenerator: React.FC = () => {
  const [panels, setPanels] = useState<StoryboardPanel[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const imageUrl = await generateStoryboardImage(prompt);
      const newPanel: StoryboardPanel = {
        id: Date.now().toString(),
        prompt,
        imageUrl,
        description: prompt
      };
      setPanels([newPanel, ...panels]);
      setPrompt('');
    } catch (err) {
      console.error(err);
      alert("Failed to generate image.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-display mb-1">Storyboard Artist</h2>
        <p className="text-zinc-500">Turn your imagination into high-fidelity visuals.</p>
      </header>

      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md py-6 mb-10 border-b border-zinc-800">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-6 py-4 outline-none focus:border-amber-500 transition-all"
            placeholder="Describe the shot: 'Close up of a noir detective in the rain, neon city lights reflecting in his eyes'..."
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="md:w-48 bg-amber-500 disabled:bg-zinc-700 text-black font-bold rounded-xl py-4 transition-all hover:scale-[1.02] active:scale-95"
          >
            {isGenerating ? 'Drawing...' : 'Generate Frame'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {panels.length === 0 && !isGenerating && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-800 rounded-3xl">
            <svg className="w-16 h-16 text-zinc-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-zinc-600">Your visual journey starts here. Enter a prompt above.</p>
          </div>
        )}

        {isGenerating && (
          <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden flex items-center justify-center border border-zinc-800 animate-pulse">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-amber-500 font-medium">Gemini is painting...</p>
            </div>
          </div>
        )}

        {panels.map((panel) => (
          <div key={panel.id} className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]">
            <img src={panel.imageUrl} alt={panel.description} className="w-full aspect-video object-cover" />
            <div className="p-4 bg-zinc-900">
              <p className="text-sm text-zinc-300 line-clamp-2">{panel.description}</p>
            </div>
            <button
               onClick={() => setPanels(panels.filter(p => p.id !== panel.id))}
               className="absolute top-2 right-2 p-2 bg-black/60 rounded-full text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryboardGenerator;
