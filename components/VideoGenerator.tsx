
import React, { useState, useEffect, useRef } from 'react';
import { startVideoGeneration, pollVideoOperation } from '../services/geminiService';
import { ConceptVideo } from '../types';

const VideoGenerator: React.FC = () => {
  const [videos, setVideos] = useState<ConceptVideo[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const pollingIntervalRef = useRef<number | null>(null);

  const loadingMessages = [
    "Setting up the lights...",
    "Rolling the cameras...",
    "Directing the actors...",
    "Developing the film...",
    "Perfecting the edit...",
    "Adding cinematic finish..."
  ];

  useEffect(() => {
    let msgIndex = 0;
    let timer: number;
    if (isGenerating) {
      setStatusMessage(loadingMessages[0]);
      timer = window.setInterval(() => {
        msgIndex = (msgIndex + 1) % loadingMessages.length;
        setStatusMessage(loadingMessages[msgIndex]);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [isGenerating]);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const opName = await startVideoGeneration(prompt);
      
      // Temporary video object
      const tempId = Date.now().toString();
      setVideos([{ id: tempId, prompt, videoUrl: '', status: 'pending' }, ...videos]);

      // Poll
      const poll = async () => {
        try {
          const res = await pollVideoOperation(opName);
          if (res.done) {
            if (res.url) {
              setVideos(prev => prev.map(v => v.id === tempId ? { ...v, videoUrl: res.url!, status: 'completed' } : v));
            } else {
              setVideos(prev => prev.map(v => v.id === tempId ? { ...v, status: 'failed' } : v));
            }
            setIsGenerating(false);
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          }
        } catch (err) {
          console.error(err);
          setVideos(prev => prev.map(v => v.id === tempId ? { ...v, status: 'failed' } : v));
          setIsGenerating(false);
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }
      };

      pollingIntervalRef.current = window.setInterval(poll, 10000);
    } catch (err) {
      console.error(err);
      setIsGenerating(false);
      alert("Failed to start video generation.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-display mb-1 text-purple-400">Concept Video Lab</h2>
        <p className="text-zinc-500">Create atmospheric 5-second teaser clips for your production.</p>
      </header>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 mb-12 shadow-2xl">
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">SCENE PROMPT</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-32 bg-black border border-zinc-800 rounded-xl p-4 outline-none focus:border-purple-500 transition-all text-lg resize-none"
              placeholder="e.g. A slow dolly shot of a misty forest at dawn, shafts of sunlight piercing through ancient oaks..."
            />
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4 text-xs text-zinc-500">
              <span className="px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 uppercase tracking-tighter">720p HD</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 uppercase tracking-tighter">16:9 Aspect</span>
              <span className="px-3 py-1 bg-zinc-800 rounded-full border border-zinc-700 uppercase tracking-tighter">Veo Tech</span>
            </div>
            
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt}
              className="w-full md:w-64 bg-purple-600 hover:bg-purple-500 disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/20"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Generating...
                </>
              ) : 'Generate Concept'}
            </button>
          </div>
        </div>

        {isGenerating && (
          <div className="mt-8 text-center bg-zinc-800/50 p-6 rounded-2xl border border-zinc-700/50">
            <div className="text-purple-400 font-medium mb-1">{statusMessage}</div>
            <p className="text-xs text-zinc-500">Video generation typically takes 1-2 minutes.</p>
          </div>
        )}
      </div>

      <div className="space-y-8">
        <h3 className="text-xl font-semibold border-b border-zinc-800 pb-4">Production Reels</h3>
        {videos.length === 0 && (
          <div className="text-center py-20 text-zinc-700 border-2 border-dashed border-zinc-800 rounded-3xl">
            No clips generated yet.
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 group transition-all hover:border-purple-500/50">
              <div className="aspect-video bg-black flex items-center justify-center relative">
                {vid.status === 'pending' ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-xs text-zinc-500 uppercase tracking-widest animate-pulse">Processing...</p>
                  </div>
                ) : vid.status === 'failed' ? (
                  <p className="text-red-500">Generation failed.</p>
                ) : (
                  <video 
                    src={vid.videoUrl} 
                    controls 
                    className="w-full h-full object-cover"
                    poster="https://picsum.photos/800/450"
                  />
                )}
              </div>
              <div className="p-6">
                <p className="text-zinc-400 text-sm leading-relaxed">{vid.prompt}</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${vid.status === 'completed' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-zinc-800 text-zinc-500'}`}>
                    {vid.status.toUpperCase()}
                  </span>
                  {vid.status === 'completed' && (
                    <a href={vid.videoUrl} download="concept.mp4" className="text-xs text-purple-400 hover:text-purple-300">Download MP4</a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoGenerator;
