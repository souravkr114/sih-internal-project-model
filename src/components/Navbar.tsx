'use client';

import React from 'react';
import { UserRole } from '../types/ev';
import { Zap, TrendingUp, Building2, ShieldCheck, Download, MapPin, Layers } from 'lucide-react';

interface NavbarProps {
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenDataLineage: () => void;
  onExportReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRole,
  onRoleChange,
  onOpenDataLineage,
  onExportReport
}) => {
  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-white sticky top-0 z-50 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                Delhi EV Charging Intelligence
              </h1>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                SIH BV806
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>MoHUA Decision Support Engine</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Delhi NCT GIS
              </span>
            </p>
          </div>
        </div>

        {/* Center Role Mode Switcher */}
        <div className="bg-slate-950/80 p-1 rounded-xl border border-slate-800 flex items-center gap-1 shadow-inner">
          <button
            onClick={() => onRoleChange('investor')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeRole === 'investor'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Investor Mode
          </button>

          <button
            onClick={() => onRoleChange('operator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeRole === 'operator'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Operator Network
          </button>

          <button
            onClick={() => onRoleChange('planner')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeRole === 'planner'
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Govt / MoHUA Planner
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenDataLineage}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 px-3 py-1.5 rounded-lg transition-all"
            title="Inspect Data Lineage & Provenance"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Lineage</span>
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 px-3.5 py-1.5 rounded-lg shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            Export Proposal
          </button>
        </div>

      </div>
    </header>
  );
};
