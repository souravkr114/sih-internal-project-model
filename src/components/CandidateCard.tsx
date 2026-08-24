'use client';

import React from 'react';
import { CandidateLocation } from '../types/ev';
import { Award, Zap, TrendingUp, ShieldCheck, MapPin, AlertCircle, Sparkles, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';

interface CandidateCardProps {
  candidate: CandidateLocation;
  onSimulateInvestment: (candidate: CandidateLocation) => void;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onSimulateInvestment
}) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-white">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
              Rank #{candidate.rank} Recommendation
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {candidate.id}</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            {candidate.name}
          </h2>
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{candidate.address}</span>
          </p>
        </div>

        {/* Overall Score Badge */}
        <div className="bg-gradient-to-b from-slate-850 to-slate-950 border border-emerald-500/30 p-3.5 rounded-2xl text-center min-w-[130px] shadow-inner">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Site AI Score</div>
          <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-white bg-clip-text text-transparent">
            {candidate.score}
          </div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">Top 1% Potential</div>
        </div>
      </div>

      {/* Grid of Key Operational Predictions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-center">
          <span className="text-[11px] text-slate-400">Est. Daily Sessions</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{candidate.predictedSessionsPerDay} <span className="text-xs text-slate-400 font-normal">/ day</span></p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-center">
          <span className="text-[11px] text-slate-400">Est. Energy Sold</span>
          <p className="text-lg font-bold text-cyan-400 mt-0.5">{candidate.predictedKwhPerDay} <span className="text-xs text-slate-400 font-normal">kWh/day</span></p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-center">
          <span className="text-[11px] text-slate-400">Nearest Charger</span>
          <p className="text-lg font-bold text-amber-400 mt-0.5">{candidate.nearestStationDistanceKm} <span className="text-xs text-slate-400 font-normal">km away</span></p>
        </div>
        <div className="bg-slate-950/60 border border-slate-800/80 p-3 rounded-xl text-center">
          <span className="text-[11px] text-slate-400">Est. ROI & Payback</span>
          <p className="text-lg font-bold text-emerald-400 mt-0.5">{candidate.estRoiPercent}% <span className="text-xs text-slate-400 font-normal">({candidate.estPaybackMonths} mo)</span></p>
        </div>
      </div>

      {/* Multi-Factor Scoring Breakdown */}
      <div className="space-y-3 bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-emerald-400" />
            MoHUA Roadmap Multi-Factor Score Breakdown
          </h3>
          <span className="text-[10px] text-slate-400">Weighted Index</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {/* Demand Score */}
          <ScoreBar label="Predicted EV Demand" score={candidate.demandScore} weight="30%" color="bg-emerald-500" />
          {/* Supply Gap */}
          <ScoreBar label="Charging Supply Deficit" score={candidate.supplyGapScore} weight="20%" color="bg-cyan-500" />
          {/* EV Density */}
          <ScoreBar label="EV Adoption & Growth" score={candidate.evDensityScore} weight="15%" color="bg-blue-500" />
          {/* Traffic */}
          <ScoreBar label="Traffic Corridor Volume" score={candidate.trafficScore} weight="10%" color="bg-amber-500" />
          {/* Dwell */}
          <ScoreBar label="Dwell & POI Activity" score={candidate.dwellScore} weight="10%" color="bg-purple-500" />
          {/* Grid Feasibility */}
          <ScoreBar label="Grid Capacity Feasibility" score={candidate.gridFeasibilityScore} weight="5%" color="bg-violet-500" />
        </div>
      </div>

      {/* Explainable AI (SHAP Feature Importance) */}
      <div className="space-y-3 bg-gradient-to-b from-slate-950/80 to-slate-900/40 border border-slate-800 p-4 rounded-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Explainable AI (SHAP Feature Drivers)
            </h3>
          </div>
          <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono">
            Model Rationale
          </span>
        </div>

        <div className="space-y-2">
          {candidate.shapFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
              <div className={`mt-0.5 text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                feat.impact === 'positive' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {feat.weight > 0 ? `+${feat.weight}` : feat.weight}
              </div>
              <div className="space-y-0.5 flex-1">
                <p className="text-xs font-semibold text-slate-200">{feat.feature}</p>
                <p className="text-[11px] text-slate-400 leading-snug">{feat.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Physical Feasibility & Grid Infrastructure */}
      <div className="bg-slate-950/40 border border-slate-800/60 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Physical Feasibility: {candidate.siteFeasibilityStatus}</span>
          </div>
          <p className="text-slate-400">
            Land Type: <span className="text-slate-200 font-medium">{candidate.landType}</span> • Parking Spots: <span className="text-slate-200 font-medium">{candidate.parkingSpotsAvailable} spaces</span>
          </p>
          <p className="text-slate-400">
            Grid Substation Distance: <span className="text-slate-200 font-medium">{candidate.gridSubstationDistanceMeters}m</span> • Capacity: <span className="text-slate-200 font-medium">{candidate.transformerCapacityKva} kVA</span>
          </p>
        </div>

        <button
          onClick={() => onSimulateInvestment(candidate)}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-slate-950 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-300 hover:from-emerald-300 hover:to-cyan-200 shadow-lg shadow-emerald-500/20 transition-all active:scale-95 shrink-0"
        >
          <span>Simulate Investment ROI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

const ScoreBar = ({ label, score, weight, color }: { label: string; score: number; weight: string; color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] text-slate-300">
      <span>{label} <span className="text-[10px] text-slate-500 font-mono">({weight})</span></span>
      <span className="font-semibold">{score} / 100</span>
    </div>
    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
      <div className={`${color} h-full rounded-full transition-all duration-500`} style={{ width: `${score}%` }} />
    </div>
  </div>
);
