import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';

export function MarketingLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-glow-violet rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-glow-blue rounded-full pointer-events-none" />

      <Navbar />
      <main className="flex-grow relative z-10">
        <Outlet />
      </main>
      <footer className="border-t border-white/5 py-8 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs font-semibold tracking-wider">
          <span>© {new Date().getFullYear()} Viralytics. All rights reserved.</span>
          <span className="text-center md:text-right">
            Estimates based on observable content signals, not platform-internal data.
          </span>
        </div>
      </footer>
    </div>
  );
}
