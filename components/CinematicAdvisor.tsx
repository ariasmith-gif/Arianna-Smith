
import React, { useState, useRef, useEffect } from 'react';
import { getCinematicAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const CinematicAdvisor: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Welcome to the Director's Chair. I'm your cinematic consultant. Need help with a plot hole? Want to discuss a lighting setup? Or perhaps you need advice on how to direct a difficult scene?" }
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() || isThinking) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      const response = await getCinematicAdvice(messages, input);
      setMessages(prev => [...prev, { role: 'model', text: response || "I'm sorry, I couldn't process that. Let's try another angle." }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: "Technical difficulties in the projection room. Please try again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <header className="mb-6">
        <h2 className="text-3xl font-display mb-1 text-emerald-400">Cinematic Advisor</h2>
        <p className="text-zinc-500">Professional consulting for every stage of production.</p>
      </header>

      <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-5 rounded-2xl ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
              }`}>
                <p className="whitespace-pre-wrap leading-relaxed text-sm md:text-base">{msg.text}</p>
              </div>
            </div>
          ))}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-zinc-800 p-5 rounded-2xl rounded-tl-none border border-zinc-700 flex gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-950 border-t border-zinc-800">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask for advice on lighting, plot, or directing..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pl-6 pr-16 outline-none focus:border-emerald-500 transition-all text-sm md:text-base"
            />
            <button
              onClick={handleSend}
              disabled={isThinking || !input.trim()}
              className="absolute right-2 top-2 p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 text-white rounded-xl transition-all"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CinematicAdvisor;
