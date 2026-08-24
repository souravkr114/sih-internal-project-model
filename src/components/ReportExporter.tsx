'use client';

import React from 'react';
import { CandidateLocation } from '../types/ev';
import { Download, X, Printer, CheckCircle2, Zap, ShieldCheck, MapPin } from 'lucide-react';

interface ReportExporterProps {
  candidate: CandidateLocation;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportExporter: React.FC<ReportExporterProps> = ({ candidate, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-8 shadow-2xl space-y-6 text-white max-h-[90vh] overflow-y-auto print:bg-white print:text-black print:p-0">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Executive EV Site Investment Report</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Report Document Body */}
        <div className="space-y-6">
          
          {/* Document Header */}
          <div className="border-b-2 border-emerald-500 pb-4 flex justify-between items-start">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                MoHUA Decision Support Proposal • Problem ID BV806
              </span>
              <h1 className="text-2xl font-black tracking-tight text-white mt-1">
                EV Charging Infrastructure Feasibility Dossier
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">Target Location: {candidate.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Date Generated</span>
              <span className="text-xs font-bold text-slate-200 font-mono">August 22, 2026</span>
            </div>
          </div>

          {/* Key Executive Highlights */}
          <div className="grid grid-cols-3 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Overall AI Recommendation Rank</span>
              <span className="text-xl font-black text-emerald-400 font-mono">Rank #{candidate.rank} (Score {candidate.score}/100)</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Projected Daily Energy Demand</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{candidate.predictedKwhPerDay} kWh / day</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 block">Estimated Annual ROI</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{candidate.estRoiPercent}% ({candidate.estPaybackMonths} mo payback)</span>
            </div>
          </div>

          {/* Location & Site Overview */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-1">
              1. Site Location & District Profile
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <p>Address: <span className="font-semibold text-white">{candidate.address}</span></p>
                <p>District: <span className="font-semibold text-white">{candidate.district}</span></p>
                <p>GPS Coordinates: <span className="font-mono text-emerald-400">{candidate.latitude}, {candidate.longitude}</span></p>
              </div>
              <div>
                <p>Daily Corridor Traffic: <span className="font-semibold text-white">{candidate.dailyTrafficVolume.toLocaleString()} vehicles/day</span></p>
                <p>Nearby Fast Chargers (2km): <span className="font-semibold text-white">{candidate.chargersWithin2Km} units</span></p>
                <p>Unserved Demand Radius: <span className="font-semibold text-white">{candidate.nearestStationDistanceKm} km distance</span></p>
              </div>
            </div>
          </div>

          {/* AI Score Breakdown & SHAP Explanation */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-1">
              2. Key AI Drivers & Model Rationale
            </h3>
            <div className="space-y-2 text-xs">
              {candidate.shapFeatures.map((feat, i) => (
                <div key={i} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-start gap-2">
                  <span className="text-emerald-400 font-bold font-mono text-[10px] mt-0.5">+{feat.weight}</span>
                  <div>
                    <p className="font-bold text-slate-200">{feat.feature}</p>
                    <p className="text-slate-400 text-[11px]">{feat.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Physical Feasibility & Grid */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-1">
              3. Grid Connection & Land Feasibility
            </h3>
            <div className="grid grid-cols-3 gap-3 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div>Site Feasibility: <span className="font-bold text-emerald-400">{candidate.siteFeasibilityStatus}</span></div>
              <div>Grid Substation Distance: <span className="font-semibold text-white">{candidate.gridSubstationDistanceMeters}m</span></div>
              <div>Transformer Capacity: <span className="font-semibold text-white">{candidate.transformerCapacityKva} kVA</span></div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
