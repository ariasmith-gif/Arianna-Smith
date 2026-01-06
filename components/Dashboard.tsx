
import React from 'react';
import { View } from '../types';

interface DashboardProps {
  onNavigate: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const cards = [
    { id: View.SCRIPT, title: 'Refine Your Script', desc: 'Use AI to punch up dialogue, structure acts, and polish your screenplay.', color: 'from-blue-600/20 to-transparent' },
    { id: View.STORYBOARD, title: 'Visualize Scenes', desc: 'Turn descriptive prompts into stunning cinematic storyboard frames.', color: 'from-amber-600/20 to-transparent' },
    { id: View.VIDEO, title: 'Generate Concept Clips', desc: 'Create 5-second teaser clips for your film using Veo technology.', color: 'from-purple-600/20 to-transparent' },
    { id: View.ADVISOR, title: 'Cinematic Advisor', desc: 'Chat with an AI director about plot holes, lighting, and performance.', color: 'from-emerald-600/20 to-transparent' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-display text-zinc-100 mb-2">Welcome to the Studio</h2>
        <p className="text-zinc-400">Everything you need to bring your vision from mind to screen.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => onNavigate(card.id)}
            className={`group relative text-left p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-amber-500 transition-colors">{card.title}</h3>
              <p className="text-zinc-400 leading-relaxed mb-6">{card.desc}</p>
              <div className="flex items-center text-amber-500 font-medium">
                Start Creating
                <svg className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </button>
        ))}
      </div>

      <section className="mt-16 p-8 rounded-2xl bg-zinc-950 border border-zinc-800">
        <h3 className="text-xl font-semibold mb-6">Recent Project Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Script Scenes', value: '12' },
            { label: 'Storyboard Frames', value: '24' },
            { label: 'Concept Clips', value: '3' },
            { label: 'AI Advisory Hrs', value: '4.5' },
          ].map((stat, i) => (
            <div key={i} className="text-center md:text-left">
              <p className="text-zinc-500 text-sm mb-1 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-zinc-100">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
