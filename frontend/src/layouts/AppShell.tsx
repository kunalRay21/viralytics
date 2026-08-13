import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-glow-blue rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[400px] h-[400px] bg-glow-teal rounded-full pointer-events-none" />

      <Navbar />
      
      <div className="flex flex-1 relative z-10">
        <Sidebar />
        
        <div className="flex-1 overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full min-h-[calc(100vh-64px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
