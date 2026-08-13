import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, History } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  if (isLanding) return null;

  return (
    <aside className="w-64 shrink-0 hidden lg:block border-r border-white/5 bg-slate-950/40 p-6 min-h-[calc(100vh-64px)]">
      <div className="flex flex-col gap-6 sticky top-24">
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest pl-3">
          Navigation
        </div>
        <nav className="flex flex-col gap-1">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 font-bold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>
          
          <NavLink
            to="/analyze"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 font-bold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <PlusCircle className="w-5 h-5" />
            Analyze Video
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
