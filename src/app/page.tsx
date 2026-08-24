'use client';

import React, { useState } from 'react';
import { UserRole, CandidateLocation } from '../types/ev';
import { StationService } from '../services/stationService';
import { RecommendationService } from '../services/recommendationService';
import { AnalyticsService } from '../services/analyticsService';
import { Navbar } from '../components/Navbar';
import { GISMap } from '../components/GISMap';
import { CandidateCard } from '../components/CandidateCard';
import { FinancialSimulator } from '../components/FinancialSimulator';
import { DistrictAnalytics } from '../components/DistrictAnalytics';
import { DataLineageModal } from '../components/DataLineageModal';
import { ReportExporter } from '../components/ReportExporter';

import { Zap, TrendingUp, Building2, MapPin, Search, Filter, ShieldCheck, Download, Award, ChevronRight, Sparkles, BarChart3 } from 'lucide-react';

export default function Home() {
  const [activeRole, setActiveRole] = useState<UserRole>('investor');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');
  
  const candidates = RecommendationService.getCandidates({ district: selectedDistrict });
  const existingStations = StationService.getStations({ district: selectedDistrict });
  const summaryStats = AnalyticsService.getSummaryStats();
  const districtsList = StationService.getUniqueDistricts();

  const [selectedCandidate, setSelectedCandidate] = useState<CandidateLocation>(candidates[0] || RecommendationService.getTopCandidate());
  const [activeTab, setActiveTab] = useState<'intelligence' | 'simulator' | 'district'>('intelligence');
  
  const [isDataLineageOpen, setIsDataLineageOpen] = useState(false);
  const [isReportExporterOpen, setIsReportExporterOpen] = useState(false);

  const handleSelectCandidate = (candidate: CandidateLocation) => {
    setSelectedCandidate(candidate);
  };

  const handleLaunchSimulator = (candidate: CandidateLocation) => {
    setSelectedCandidate(candidate);
    setActiveTab('simulator');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Navbar */}
      <Navbar
        activeRole={activeRole}
        onRoleChange={(role) => {
          setActiveRole(role);
          if (role === 'planner') setActiveTab('district');
          if (role === 'investor') setActiveTab('intelligence');
        }}
        onOpenDataLineage={() => setIsDataLineageOpen(true)}
        onExportReport={() => setIsReportExporterOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
        
        {/* Top Key Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          
          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total Delhi EVs</span>
              <span className="text-lg font-black text-emerald-400 font-mono">{(summaryStats.totalEVs / 1000).toFixed(1)}k <span className="text-xs text-slate-400 font-normal">registered</span></span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Public Charger Supply</span>
              <span className="text-lg font-black text-cyan-400 font-mono">{summaryStats.totalChargers} <span className="text-xs text-slate-400 font-normal">active units</span></span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">EV / Charger Ratio</span>
              <span className="text-lg font-black text-amber-400 font-mono">{summaryStats.avgEvPerCharger} <span className="text-xs text-slate-400 font-normal">EVs / charger</span></span>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center gap-3 shadow-lg">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Top Site ROI Potential</span>
              <span className="text-lg font-black text-purple-400 font-mono">{selectedCandidate?.estRoiPercent || 32.4}% <span className="text-xs text-slate-400 font-normal">annual</span></span>
            </div>
          </div>

        </div>

        {/* GIS Map & Ranked Locations Dual Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Ranked Candidates List (4 cols) */}
          <div className="lg:col-span-4 space-y-3 flex flex-col h-[620px]">
            
            {/* Header & Filter */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-2xl flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Top Ranked Candidate Sites</h3>
              </div>

              {/* District Filter Dropdown */}
              <div className="flex items-center gap-1">
                <Filter className="w-3 h-3 text-slate-400" />
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-lg px-2 py-1 focus:outline-none font-mono"
                >
                  {districtsList.map((d) => (
                    <option key={d} value={d}>{d === 'ALL' ? 'All Delhi' : d}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Candidate Cards Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {candidates.map((cand) => {
                const isSelected = cand.id === selectedCandidate.id;
                return (
                  <div
                    key={cand.id}
                    onClick={() => setSelectedCandidate(cand)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer space-y-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border-emerald-500/70 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                        : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-6 h-6 rounded-full font-black text-xs flex items-center justify-center ${
                          isSelected ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                        }`}>
                          #{cand.rank}
                        </span>
                        <span className="text-xs font-bold text-slate-200 line-clamp-1">{cand.name}</span>
                      </div>
                      <span className="text-xs font-black font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        {cand.score}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        {cand.district}
                      </span>
                      <span>{cand.predictedSessionsPerDay} sessions/day</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-950/80 p-1.5 rounded text-slate-400 font-mono">
                      <div>Demand: <span className="text-emerald-400 font-semibold">{cand.demandScore}</span></div>
                      <div>Supply Deficit: <span className="text-cyan-400 font-semibold">{cand.supplyGapScore}</span></div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: GIS Interactive Map (8 cols) */}
          <div className="lg:col-span-8">
            <GISMap
              candidates={candidates}
              existingStations={existingStations}
              selectedCandidateId={selectedCandidate?.id}
              onSelectCandidate={handleSelectCandidate}
            />
          </div>

        </div>

        {/* Dynamic Detail Module Tabs */}
        <div className="space-y-4 pt-2">
          
          {/* Tab Navigation */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('intelligence')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'intelligence'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Location Intelligence & Explainable AI (SHAP)
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Investor Financial & ROI Simulator
            </button>

            <button
              onClick={() => setActiveTab('district')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'district'
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              <Building2 className="w-4 h-4" />
              MoHUA District Deficit Matrix
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'intelligence' && selectedCandidate && (
            <CandidateCard
              candidate={selectedCandidate}
              onSimulateInvestment={handleLaunchSimulator}
            />
          )}

          {activeTab === 'simulator' && selectedCandidate && (
            <FinancialSimulator
              selectedCandidate={selectedCandidate}
            />
          )}

          {activeTab === 'district' && (
            <DistrictAnalytics />
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center text-xs text-slate-500 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Delhi EV Charging Intelligence Platform • SIH Problem ID BV806</p>
          <p className="flex items-center gap-1 font-mono text-slate-400">
            <span>MoHUA Urban AI Decision Support System</span>
            <span>•</span>
            <span className="text-emerald-400">Delhi NCT</span>
          </p>
        </div>
      </footer>

      {/* Data Lineage & Provenance Modal */}
      <DataLineageModal
        isOpen={isDataLineageOpen}
        onClose={() => setIsDataLineageOpen(false)}
      />

      {/* Report Exporter Modal */}
      {selectedCandidate && (
        <ReportExporter
          candidate={selectedCandidate}
          isOpen={isReportExporterOpen}
          onClose={() => setIsReportExporterOpen(false)}
        />
      )}

    </div>
  );
}
