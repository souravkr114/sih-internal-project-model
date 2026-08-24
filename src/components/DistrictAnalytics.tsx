'use client';

import React from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { Building2, AlertTriangle, TrendingUp, ShieldCheck, Zap, Layers, MapPin, CheckCircle2 } from 'lucide-react';

export const DistrictAnalytics: React.FC = () => {
  const districts = AnalyticsService.getDistrictMetrics();
  const summary = AnalyticsService.getSummaryStats();

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-full">
              MoHUA & Urban Planner View
            </span>
            <span className="text-xs text-slate-400">Delhi NCT Infrastructure Gap Index</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-violet-400" />
            Delhi District Charging Deficit & EV Adoption
          </h2>
        </div>

        {/* Quick Stat Pills */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center min-w-[110px]">
            <span className="text-[10px] text-slate-400 font-semibold block">Total Delhi EVs</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{(summary.totalEVs / 1000).toFixed(1)}k</span>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-center min-w-[110px]">
            <span className="text-[10px] text-slate-400 font-semibold block">EV / Charger Ratio</span>
            <span className="text-base font-bold text-amber-400 font-mono">{summary.avgEvPerCharger}</span>
          </div>
        </div>
      </div>

      {/* Urban Planning Policy Highlight */}
      <div className="bg-gradient-to-r from-violet-950/40 via-slate-900 to-slate-950 border border-violet-500/30 p-4 rounded-xl flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <p className="font-bold text-slate-200">
            MoHUA Urban Benchmark Alert: Target 1 Public Charger per 25 EVs
          </p>
          <p className="text-slate-400 leading-relaxed">
            Delhi NCT currently has an average ratio of <span className="text-amber-400 font-semibold">{summary.avgEvPerCharger} EVs per charger</span>. North Delhi & West Delhi exhibit the highest infrastructure deficit score (&gt;94/100), presenting prime locations for high-impact municipal and private investments.
          </p>
        </div>
      </div>

      {/* District Deficit Matrix Table */}
      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">EV Fleet Size</th>
              <th className="py-3 px-4">YoY Growth</th>
              <th className="py-3 px-4">Public Chargers</th>
              <th className="py-3 px-4">EV / Charger Ratio</th>
              <th className="py-3 px-4">Deficit Score</th>
              <th className="py-3 px-4">Grid Capacity</th>
              <th className="py-3 px-4">Key Priority Corridor</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {districts.map((d, idx) => (
              <tr key={idx} className="hover:bg-slate-800/40 transition-all">
                <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-violet-400" />
                  {d.districtName}
                </td>
                <td className="py-3 px-4 font-mono">{d.totalEVsRegistered.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 font-mono text-emerald-400">+{d.evGrowthRateYoy}%</td>
                <td className="py-3 px-4 font-mono">{d.existingChargerCount}</td>
                <td className="py-3 px-4 font-mono text-amber-400 font-semibold">{d.demandSupplyRatio}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    d.deficitScore >= 90 
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : d.deficitScore >= 80
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {d.deficitScore} / 100
                  </span>
                </td>
                <td className="py-3 px-4 text-[11px] text-slate-300">{d.gridCapacityStatus}</td>
                <td className="py-3 px-4 text-[11px] text-slate-400 max-w-[200px] truncate">{d.topCorridor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
