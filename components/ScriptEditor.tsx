
import React, { useState } from 'react';
import { generateScriptImprovement } from '../services/geminiService';

const ScriptEditor: React.FC = () => {
  const [content, setContent] = useState<string>(`INT. COFFEE SHOP - DAY

The rain beats against the window. JOE (30s) stares into his espresso.

JOE
It's not just about the money, Sarah.

SARAH (20s) enters, shaking off her umbrella.

SARAH
It never is with you.`);
  const [instruction, setInstruction] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleImprove = async () => {
    if (!instruction) return;
    setIsProcessing(true);
    try {
      const result = await generateScriptImprovement(content, instruction);
      setContent(result);
      setInstruction('');
    } catch (err) {
      console.error(err);
      alert("Error improving script.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display mb-1">Scriptwriter</h2>
          <p className="text-zinc-500">Draft your scenes in professional format.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-sm transition-colors">Export PDF</button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
        <div className="lg:col-span-2 relative h-[500px] lg:h-auto">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-zinc-900 text-zinc-200 p-8 rounded-2xl border border-zinc-800 focus:border-amber-500 outline-none font-mono resize-none leading-relaxed shadow-inner"
            placeholder="Type your scene here..."
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
              AI Punch-Up
            </h3>
            <p className="text-sm text-zinc-500 mb-4 italic">"Make the dialogue more tense" or "Add a plot twist involving a mysterious package."</p>
            <textarea
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              className="w-full h-32 bg-black border border-zinc-700 rounded-lg p-3 text-sm focus:border-amber-500 outline-none mb-4 resize-none"
              placeholder="Ask Gemini to refine this scene..."
            />
            <button
              onClick={handleImprove}
              disabled={isProcessing || !instruction}
              className="w-full py-3 bg-amber-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-black font-bold rounded-lg transition-all"
            >
              {isProcessing ? 'Thinking...' : 'Rewrite Scene'}
            </button>
          </div>
          
          <div className="p-6 bg-zinc-950 border border-zinc-900 rounded-2xl text-xs text-zinc-500 space-y-2">
            <p className="font-bold text-zinc-400">TIPS:</p>
            <p>• Use uppercase for CHARACTERS.</p>
            <p>• Use INT. / EXT. for Sluglines.</p>
            <p>• Action lines should be present tense.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptEditor;
