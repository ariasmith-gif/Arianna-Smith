
import React, { useState, useEffect } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ScriptEditor from './components/ScriptEditor';
import StoryboardGenerator from './components/StoryboardGenerator';
import VideoGenerator from './components/VideoGenerator';
import CinematicAdvisor from './components/CinematicAdvisor';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [hasKey, setHasKey] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    checkKey();
  }, []);

  const checkKey = async () => {
    // Check if the environment provides a key or if the user needs to select one (for Veo/Gemini 3 Pro)
    // Note: process.env.API_KEY is assumed to be available eventually
    if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
    } else {
        // Fallback for environments without the selector
        setHasKey(!!process.env.API_KEY);
    }
    setIsLoading(false);
  };

  const handleSelectKey = async () => {
    if (window.aistudio) {
        await window.aistudio.openSelectKey();
        setHasKey(true); // Proceed as per instructions
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (!hasKey) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
          <h1 className="text-3xl font-display text-amber-500 mb-4">CineMaster Studio</h1>
          <p className="text-zinc-400 mb-8">
            To unlock the full power of CineMaster AI, including high-quality video generation and advanced script reasoning, please select a billing-enabled API key.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            Select API Key
          </button>
          <p className="mt-4 text-xs text-zinc-500">
            Requires a paid GCP project. See <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline hover:text-amber-500">billing documentation</a>.
          </p>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard onNavigate={setCurrentView} />;
      case View.SCRIPT: return <ScriptEditor />;
      case View.STORYBOARD: return <StoryboardGenerator />;
      case View.VIDEO: return <VideoGenerator />;
      case View.ADVISOR: return <CinematicAdvisor />;
      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-zinc-200">
      <Sidebar activeView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 h-screen">
        {renderView()}
      </main>
    </div>
  );
};

export default App;
