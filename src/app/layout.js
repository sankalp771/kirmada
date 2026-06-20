import { Lexend, JetBrains_Mono, Inter } from 'next/font/google';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import './globals.css';

const lexend = Lexend({ 
  subsets: ['latin'],
  variable: '--font-lexend',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata = {
  title: 'KIRMADA - Dashboard',
  description: 'Protocol V.2.0 Cult Simulator',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} ${lexend.variable} ${jetbrainsMono.variable} font-sans bg-[#141313] text-[#e5e2e1] antialiased min-h-screen flex noise-bg`}>
        
        {/* Fixed TopBar for User Stats */}
        <TopBar />
        
        {/* Fixed Desktop Sidebar */}
        <Sidebar />

        {/* Main Content Area - Pushed to the right of the sidebar and below topbar */}
        <main className="flex-1 md:ml-64 pt-20 flex flex-col min-h-screen relative w-full">
          {children}
        </main>
        
      </body>
    </html>
  );
}
