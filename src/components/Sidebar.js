'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#1c1b1b]/60 backdrop-blur-2xl fixed left-0 top-0 h-screen w-64 border-r border-[#444748]/5 bg-gradient-to-b from-[#0e0e0e] to-[#141313] shadow-[20px_0_40px_rgba(0,0,0,0.4)] flex flex-col py-10 gap-2 hidden md:flex z-50">
      
      {/* Brand */}
      <div className="px-6 mb-3 flex flex-col items-center justify-center">
        <img 
          alt="Oracle Sigil" 
          className="w-16 h-16 rounded-full mb-2 border border-[#a9cecc]/20 shadow-[0_0_15px_rgba(169,206,204,0.2)] object-cover" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhCmeZGpgh-0BGIyluILqYDE_VoBm72pd5B8x4rAYnK0a54J9hgRB9d7GIa3DTYcZjQgElgNChdePmGG7AwuEHZfne2HjNxv9q7S9rJEiUH8Oiz4knsxihjyaKjfOhrGACasylW3wbEvYFLerBwHNg-qnykPPncH1UQ42Yd808DQv1KDEHGoXnE9OwTvFr2s0Wvy8kYfOGDvG-SokuBC81yyJQRajOFBUqpOSiDgcZTM8MrmNpzKGDSeSHgspz1N3jAyklTsysT2f4" 
        />
        <h1 className="text-[24px] text-[#e5e2e1] font-bold tracking-tighter" style={{ fontFamily: 'Lexend' }}>KIRMADA</h1>
        <p className="text-[12px] text-[#a9cecc] opacity-80 tracking-widest font-bold mt-1" style={{ fontFamily: 'JetBrains Mono' }}>Protocol V.2.0</p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-1 flex-1 mt-3">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-6 py-2 transition-all duration-200 ease-in-out font-bold tracking-widest text-[12px] ${pathname === '/' ? 'text-[#a9cecc] bg-[#000606]/30 border-l-2 border-[#a9cecc] shadow-[0_0_15px_rgba(169,206,204,0.2)]' : 'text-[#c4c7c7] opacity-70 hover:opacity-100 hover:bg-[#353434]/20 hover:text-[#e5e2e1]'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span className="material-symbols-outlined" style={pathname === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}>home</span>
          Home
        </Link>
        <Link 
          href="/chat" 
          className={`flex items-center gap-3 px-6 py-2 transition-all duration-200 ease-in-out font-bold tracking-widest text-[12px] ${pathname.startsWith('/chat') ? 'text-[#a9cecc] bg-[#000606]/30 border-l-2 border-[#a9cecc] shadow-[0_0_15px_rgba(169,206,204,0.2)]' : 'text-[#c4c7c7] opacity-70 hover:opacity-100 hover:bg-[#353434]/20 hover:text-[#e5e2e1]'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span className="material-symbols-outlined">groups</span>
          Parties
        </Link>
        <Link 
          href="/debate" 
          className={`flex items-center gap-3 px-6 py-2 transition-all duration-200 ease-in-out font-bold tracking-widest text-[12px] ${pathname.startsWith('/debate') ? 'text-[#a9cecc] bg-[#000606]/30 border-l-2 border-[#a9cecc] shadow-[0_0_15px_rgba(169,206,204,0.2)]' : 'text-[#c4c7c7] opacity-70 hover:opacity-100 hover:bg-[#353434]/20 hover:text-[#e5e2e1]'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span className="material-symbols-outlined">forum</span>
          Debates
        </Link>
        <Link 
          href="/feed" 
          className={`flex items-center gap-3 px-6 py-2 transition-all duration-200 ease-in-out font-bold tracking-widest text-[12px] ${pathname.startsWith('/feed') ? 'text-[#a9cecc] bg-[#000606]/30 border-l-2 border-[#a9cecc] shadow-[0_0_15px_rgba(169,206,204,0.2)]' : 'text-[#c4c7c7] opacity-70 hover:opacity-100 hover:bg-[#353434]/20 hover:text-[#e5e2e1]'}`}
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span className="material-symbols-outlined">how_to_vote</span>
          Vote
        </Link>
        <Link 
          href="#" 
          className="flex items-center gap-3 px-6 py-2 transition-all duration-200 ease-in-out font-bold tracking-widest text-[12px] text-[#c4c7c7] opacity-70 hover:opacity-100 hover:bg-[#353434]/20 hover:text-[#e5e2e1]"
          style={{ fontFamily: 'JetBrains Mono' }}
        >
          <span className="material-symbols-outlined">gavel</span>
          Laws
        </Link>
      </div>

      {/* CTA Button */}
      <div className="px-6 mt-auto pb-4">
        <button className="w-full bg-[#a9cecc]/20 text-[#a9cecc] border border-[#a9cecc]/50 hover:bg-[#a9cecc] hover:text-[#050505] hover:shadow-[0_0_20px_rgba(169,206,204,0.4)] transition-all py-2 rounded px-4 text-[12px] font-bold tracking-widest flex items-center justify-center gap-2" style={{ fontFamily: 'JetBrains Mono' }}>
          <span className="material-symbols-outlined">bolt</span>
          Initiate Ritual
        </button>
      </div>
    </nav>
  );
}
