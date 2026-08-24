'use client';

import React from 'react';
import { AnalyticsService } from '../services/analyticsService';
import { ShieldCheck, X, Database, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';

interface DataLineageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DataLineageModal: React.FC<DataLineageModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const lineage = AnalyticsService.getDataLineage();

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Data Lineage & Provenance Register</h2>
              <p className="text-xs text-slate-400">SIH BV806 • Strict Data Quality & Source Provenance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Rule 2 Compliance Note */}
        <div className="bg-slate-950 border border-emerald-500/30 p-3.5 rounded-xl flex items-start gap-3 text-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-emerald-300">Rule 2 Compliance Guarantee</p>
            <p className="text-slate-300 leading-relaxed">
              Every dataset powering this decision platform is explicitly categorized. Ground truth charging station locations and vehicle registrations stem from official Delhi government feeds. Secondary layers utilize OpenStreetMap GIS geometries and calibrated synthetic ML demand proxies.
            </p>
          </div>
        </div>

        {/* Dataset Table */}
        <div className="space-y-3">
          {lineage.map((ds) => (
            <div key={ds.id} className="bg-slate-950/80 border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-sm text-slate-100">{ds.datasetName}</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  ds.type === 'Official Government'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : ds.type === 'Open Spatial / GIS'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                    : ds.type === 'Derived Model Feature'
                    ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {ds.type}
                </span>
              </div>

              <p className="text-xs text-slate-300">{ds.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-400 pt-1">
                <div>Source: <span className="text-slate-200 font-semibold">{ds.organization}</span></div>
                <div>Updated: <span className="text-slate-200 font-mono">{ds.lastUpdated}</span></div>
                <div>Volume: <span className="text-slate-200 font-mono">{ds.recordCount}</span></div>
                <div>Confidence: <span className="text-emerald-400 font-bold">{ds.confidenceScore}%</span></div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-2 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all"
          >
            Close Provenance Register
          </button>
        </div>

      </div>
    </div>
  );
};
