import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, PlusCircle, LayoutDashboard, Compass } from 'lucide-react';

export function Navbar() {
  const location = useLocation();
  const isMarketing = location.pathname === '/';

  return (
    <nav className={`w-full z-40 border-b border-white/5 backdrop-blur-md bg-slate-950/80 sticky top-0 transition-all`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <div className="p-2 bg-violet-600/10 border border-violet-500/20 rounded-xl">
                <BarChart3 className="w-6 h-6 text-violet-400" />
              </div>
              <span className="text-lg font-extrabold tracking-wider text-white">
                VIRA<span className="text-violet-400">LYTICS</span>
              </span>
            </Link>
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <Link 
              to="/analyze" 
              className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${
                location.pathname === '/analyze' ? 'text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              Analyze Video
            </Link>
          </div>

          {/* User Profile avatar */}
          <div className="flex items-center gap-4">
            {!isMarketing && (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-semibold text-white">Demo Creator</p>
                  <p className="text-[10px] text-slate-500 font-medium">Free Tier</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center border border-white/10 text-white font-bold text-xs">
                  DC
                </div>
              </div>
            )}
            {isMarketing && (
              <Link 
                to="/analyze" 
                className="px-4 py-2 text-xs font-bold text-white bg-violet-600 rounded-xl hover:bg-violet-500 transition-colors border border-violet-500/30 shadow-[0_0_15px_rgba(124,58,237,0.3)]"
              >
                Launch App
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
