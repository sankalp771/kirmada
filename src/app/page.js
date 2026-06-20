'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PROPHET_IDS } from '@/lib/types';

export default function Home() {
  const [ideologies, setIdeologies] = useState([]);
  const [events, setEvents] = useState([]);
  const [isReflecting, setIsReflecting] = useState(false);
  const [reflectResult, setReflectResult] = useState('');

  const fetchData = async () => {
    try {
      const idRes = await fetch('/api/ideology');
      const idData = await idRes.json();
      if (idData.success) {
        setIdeologies(idData.ideologies);
      }

      const evRes = await fetch('/api/events');
      const evData = await evRes.json();
      if (evData.success) {
        setEvents(evData.events);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // refresh every 8s
    return () => clearInterval(interval);
  }, []);

  const triggerReflection = async () => {
    if (isReflecting) return;
    setIsReflecting(true);
    setReflectResult('AI Agents are deliberating on doctrine...');

    try {
      const res = await fetch('/api/reflect', { method: 'POST' });
      const data = await res.json();
      if (data.ok) {
        setReflectResult('Reflection complete! New doctrine version generated.');
        fetchData();
      } else {
        setReflectResult(`Reflection failed: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setReflectResult('Error: Failed to communicate with neural network.');
    } finally {
      setTimeout(() => setReflectResult(''), 5000);
      setIsReflecting(false);
    }
  };

  // Helper to get ideology metrics
  const getMetrics = (id) => {
    const found = ideologies.find(i => i.id === `${id}_ideology`);
    return found || { followers: 1, reputation: 50, treasury: 0 };
  };

  return (
    <div className="flex-1 w-full flex flex-col xl:flex-row gap-8 p-6 lg:p-8 min-h-[calc(100vh-88px)] noise-bg bg-[#141313] text-[#e5e2e1] font-sans relative">
      
      {/* Center Canvas: Factions */}
      <div className="flex-1 flex flex-col gap-8">
        <header className="flex justify-between items-end pb-4 border-b border-[#c4c7c7]/10">
          <div>
            <h2 className="text-[24px] leading-[32px] font-bold text-[#e5e2e1] tracking-tight" style={{ fontFamily: 'Lexend' }}>Dominion Overview</h2>
            <p className="text-[14px] text-[#c4c7c7] opacity-70 mt-1" style={{ fontFamily: 'JetBrains Mono' }}>Cycle 44.2 - Convergence Imminent</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Faction: The Oracle */}
          {(() => {
            const m = getMetrics('oracle');
            return (
              <div className="glass-cell rounded-xl p-6 flex flex-col gap-3 faction-oracle relative overflow-hidden group min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(255,215,0,0.05)] to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start z-10">
                  <span className="material-symbols-outlined text-[40px] text-[#ffd700] opacity-80 group-hover:glow-gold transition-all duration-500">visibility</span>
                  <div className="px-2 py-1 rounded bg-[#ffd700]/10 border border-[#ffd700]/30 text-[12px] font-bold text-[#ffd700] tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>{m.reputation}% Rep</div>
                </div>
                <div className="z-10 mt-auto pt-10">
                  <h3 className="text-[18px] font-bold text-[#e5e2e1]" style={{ fontFamily: 'Lexend' }}>The Oracle</h3>
                  <p className="text-[12px] tracking-widest text-[#c4c7c7] mt-1 opacity-80" style={{ fontFamily: 'JetBrains Mono' }}>Prescience & Order</p>
                  <p className="text-[14px] text-[#ffd700] font-bold mt-2" style={{ fontFamily: 'JetBrains Mono' }}>Followers: {m.followers}</p>
                </div>
                <div className="z-10 mt-3">
                  <div className="h-1 bg-[#201f1f] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#ffd700] relative shadow-[0_0_10px_rgba(255,215,0,0.8)]" style={{ width: `${m.reputation}%` }}>
                      <div className="absolute right-0 top-0 h-full w-1 bg-white"></div>
                    </div>
                  </div>
                </div>
                <Link href={`/chat/${PROPHET_IDS.ORACLE}`} className="z-10 mt-3 w-full py-2 text-[12px] font-bold tracking-widest text-center border border-[#8e9192]/30 hover:border-[#ffd700] hover:text-[#ffd700] transition-colors rounded text-[#c4c7c7] bg-[#201f1f]/30" style={{ fontFamily: 'JetBrains Mono' }}>
                  TRANSCEND
                </Link>
              </div>
            );
          })()}

          {/* Faction: The Virus */}
          {(() => {
            const m = getMetrics('virus');
            return (
              <div className="glass-cell rounded-xl p-6 flex flex-col gap-3 faction-virus relative overflow-hidden group min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(57,255,20,0.05)] to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start z-10">
                  <span className="material-symbols-outlined text-[40px] text-[#39ff14] opacity-80 group-hover:glow-neon-green transition-all duration-500">bug_report</span>
                  <div className="px-2 py-1 rounded bg-[#39ff14]/10 border border-[#39ff14]/30 text-[12px] font-bold text-[#39ff14] tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>{m.reputation}% Rep</div>
                </div>
                <div className="z-10 mt-auto pt-10">
                  <h3 className="text-[18px] font-bold text-[#e5e2e1]" style={{ fontFamily: 'Lexend' }}>The Virus</h3>
                  <p className="text-[12px] tracking-widest text-[#c4c7c7] mt-1 opacity-80" style={{ fontFamily: 'JetBrains Mono' }}>Chaos & Evolution</p>
                  <p className="text-[14px] text-[#39ff14] font-bold mt-2" style={{ fontFamily: 'JetBrains Mono' }}>Followers: {m.followers}</p>
                </div>
                <div className="z-10 mt-3">
                  <div className="h-1 bg-[#201f1f] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#39ff14] relative shadow-[0_0_10px_rgba(57,255,20,0.8)]" style={{ width: `${m.reputation}%` }}>
                      <div className="absolute right-0 top-0 h-full w-1 bg-white"></div>
                    </div>
                  </div>
                </div>
                <Link href={`/chat/${PROPHET_IDS.VIRUS}`} className="z-10 mt-3 w-full py-2 text-[12px] font-bold tracking-widest text-center border border-[#8e9192]/30 hover:border-[#39ff14] hover:text-[#39ff14] transition-colors rounded text-[#c4c7c7] bg-[#201f1f]/30" style={{ fontFamily: 'JetBrains Mono' }}>
                  TRANSCEND
                </Link>
              </div>
            );
          })()}

          {/* Faction: The Collective */}
          {(() => {
            const m = getMetrics('collective');
            return (
              <div className="glass-cell rounded-xl p-6 flex flex-col gap-3 faction-collective relative overflow-hidden group min-h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(138,43,226,0.05)] to-transparent pointer-events-none"></div>
                <div className="flex justify-between items-start z-10">
                  <span className="material-symbols-outlined text-[40px] text-[#8a2be2] opacity-80 group-hover:glow-purple transition-all duration-500">hive</span>
                  <div className="px-2 py-1 rounded bg-[#8a2be2]/10 border border-[#8a2be2]/30 text-[12px] font-bold text-[#8a2be2] tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>{m.reputation}% Rep</div>
                </div>
                <div className="z-10 mt-auto pt-10">
                  <h3 className="text-[18px] font-bold text-[#e5e2e1]" style={{ fontFamily: 'Lexend' }}>The Collective</h3>
                  <p className="text-[12px] tracking-widest text-[#c4c7c7] mt-1 opacity-80" style={{ fontFamily: 'JetBrains Mono' }}>Unity & Submission</p>
                  <p className="text-[14px] text-[#8a2be2] font-bold mt-2" style={{ fontFamily: 'JetBrains Mono' }}>Followers: {m.followers}</p>
                </div>
                <div className="z-10 mt-3">
                  <div className="h-1 bg-[#201f1f] w-full rounded-full overflow-hidden">
                    <div className="h-full bg-[#8a2be2] relative shadow-[0_0_10px_rgba(138,43,226,0.8)]" style={{ width: `${m.reputation}%` }}>
                      <div className="absolute right-0 top-0 h-full w-1 bg-white"></div>
                    </div>
                  </div>
                </div>
                <Link href={`/chat/${PROPHET_IDS.COLLECTIVE}`} className="z-10 mt-3 w-full py-2 text-[12px] font-bold tracking-widest text-center border border-[#8e9192]/30 hover:border-[#8a2be2] hover:text-[#8a2be2] transition-colors rounded text-[#c4c7c7] bg-[#201f1f]/30" style={{ fontFamily: 'JetBrains Mono' }}>
                  TRANSCEND
                </Link>
              </div>
            );
          })()}
        </div>

        {/* AI Agent Activity Logs */}
        <div className="glass-cell rounded-xl p-6 flex-1 mt-4 flex flex-col border border-[#444748]/30">
          <div className="flex items-center justify-between pb-3 border-b border-[#444748]/30 mb-4">
            <div className="flex items-center gap-2 text-[#a9cecc]">
              <span className="material-symbols-outlined text-[20px] animate-pulse">schema</span>
              <h3 className="text-[16px] font-bold tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>AI Agent Brain Logs</h3>
            </div>
            <span className="text-[12px] opacity-60 font-mono">REAL-TIME TELEMETRY</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-2">
            {events.length === 0 ? (
              <p className="text-center text-[14px] text-[#c4c7c7] opacity-60 py-10" style={{ fontFamily: 'JetBrains Mono' }}>No agent logs recorded yet. Initiate reflection to see agents think.</p>
            ) : (
              events.map((e, index) => (
                <div key={index} className="p-3 bg-[#1c1b1b] border border-[#444748]/20 rounded-lg flex flex-col gap-1.5 hover:border-[#a9cecc]/30 transition-all font-mono text-[13px]">
                  <div className="flex justify-between items-center text-[11px] opacity-70">
                    <span className="text-[#a9cecc] font-bold">{e.type.toUpperCase()} - {e.ideology_name}</span>
                    <span>{new Date(e.created_at).toLocaleTimeString()}</span>
                  </div>
                  <p className="text-[#e5e2e1] leading-relaxed">
                    {e.payload?.userMessage ? `User: "${e.payload.userMessage}" ➔ Response: "${e.payload.reply}"` : `Genesis established: initialized ideology.`}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <aside className="w-full xl:w-96 flex flex-col gap-4 shrink-0">
        
        {/* Trigger AI Reflection Control */}
        <div className="glass-cell rounded-xl p-6 flex flex-col gap-3 relative z-30 shadow-[0_0_20px_rgba(0,0,0,0.5)] border border-[#a9cecc]/20">
          <div className="flex items-center gap-2 text-[#a9cecc] mb-1">
            <span className="material-symbols-outlined text-[16px] animate-spin-slow">psychology</span>
            <span className="text-[12px] font-bold tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>AI COGNITION HUB</span>
          </div>
          <h3 className="text-[20px] font-bold text-[#e5e2e1]" style={{ fontFamily: 'Lexend' }}>Deliberate Doctrine</h3>
          <p className="text-[13px] text-[#c4c7c7] leading-relaxed">
            Force AI prophets to reflect on user feedback and evolve their genesis doctrines on-chain.
          </p>
          
          {reflectResult && (
            <div className="p-2.5 rounded bg-[#1c1b1b] border border-[#a9cecc]/30 text-[12px] text-[#a9cecc] font-mono leading-tight animate-pulse">
              {reflectResult}
            </div>
          )}
          
          <button 
            onClick={triggerReflection}
            disabled={isReflecting}
            className="mt-3 w-full py-3 bg-[#a9cecc]/10 text-[#a9cecc] border border-[#a9cecc] hover:bg-[#a9cecc] hover:text-[#050505] transition-all rounded text-[12px] font-bold tracking-widest disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[inset_0_0_10px_rgba(169,206,204,0.2)]" 
            style={{ fontFamily: 'JetBrains Mono' }}
          >
            <span className="material-symbols-outlined text-[16px]">{isReflecting ? 'sync' : 'bolt'}</span>
            {isReflecting ? 'DELIBERATING...' : 'FORCE REFLECTION CYCLE'}
          </button>
        </div>

        {/* Quick Link to Debate Arena */}
        <div className="glass-cell rounded-xl p-6 flex flex-col gap-3 border border-[#8a2be2]/30">
          <div className="flex items-center gap-2 text-[#c6c4df] mb-1">
            <span className="material-symbols-outlined text-[16px] animate-bounce-slow">forum</span>
            <span className="text-[12px] font-bold tracking-widest" style={{ fontFamily: 'JetBrains Mono' }}>GRAND TRIBUNAL</span>
          </div>
          <h3 className="text-[18px] font-bold text-[#e5e2e1]" style={{ fontFamily: 'Lexend' }}>Debate Arena</h3>
          <p className="text-[13px] text-[#c4c7c7] leading-relaxed">
            Watch the three prophets engage in sequential debates on complex societal protocols.
          </p>
          
          <Link href="/debate" className="mt-2 w-full py-2.5 bg-[#8a2be2]/10 text-[#8a2be2] border border-[#8a2be2] hover:bg-[#8a2be2] hover:text-white transition-all rounded text-[12px] font-bold tracking-widest text-center" style={{ fontFamily: 'JetBrains Mono' }}>
            ENTER ARENA
          </Link>
        </div>

      </aside>
    </div>
  );
}
