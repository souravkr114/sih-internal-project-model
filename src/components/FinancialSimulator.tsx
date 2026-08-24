'use client';

import React, { useState } from 'react';
import { CandidateLocation, FinancialConfig } from '../types/ev';
import { FinancialService, DEFAULT_FINANCIAL_CONFIG } from '../services/financialService';
import { DollarSign, TrendingUp, Calculator, ShieldCheck, Zap, ArrowRight, BarChart3, AlertTriangle, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface FinancialSimulatorProps {
  selectedCandidate: CandidateLocation;
}

export const FinancialSimulator: React.FC<FinancialSimulatorProps> = ({
  selectedCandidate
}) => {
  const [config, setConfig] = useState<FinancialConfig>({
    ...DEFAULT_FINANCIAL_CONFIG,
    candidateId: selectedCandidate.id
  });

  const result = FinancialService.simulate(config);

  const handleChargerQtyChange = (type: string, qty: number) => {
    setConfig(prev => ({
      ...prev,
      chargers: prev.chargers.map(c => c.type === type ? { ...c, quantity: Math.max(0, qty) } : c)
    }));
  };

  const chartData = [
    {
      scenario: 'Pessimistic (25%)',
      Revenue: Math.round(result.scenarios.pessimistic.annualRevenueInr / 100000),
      Opex: Math.round(result.scenarios.pessimistic.annualOpexInr / 100000),
      EBITDA: Math.round(result.scenarios.pessimistic.annualEbitdaInr / 100000)
    },
    {
      scenario: 'Base Case (45%)',
      Revenue: Math.round(result.scenarios.base.annualRevenueInr / 100000),
      Opex: Math.round(result.scenarios.base.annualOpexInr / 100000),
      EBITDA: Math.round(result.scenarios.base.annualEbitdaInr / 100000)
    },
    {
      scenario: 'Optimistic (65%)',
      Revenue: Math.round(result.scenarios.optimistic.annualRevenueInr / 100000),
      Opex: Math.round(result.scenarios.optimistic.annualOpexInr / 100000),
      EBITDA: Math.round(result.scenarios.optimistic.annualEbitdaInr / 100000)
    }
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6 text-white">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">
              Investor Simulator
            </span>
            <span className="text-xs text-slate-400">Target Site: {selectedCandidate.name}</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            Financial Return & ROI Projections
          </h2>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase text-slate-400 font-semibold block">Total Estimated Capex</span>
          <span className="text-2xl font-black text-emerald-400 font-mono">
            ₹{(result.totalCapexInr / 100000).toFixed(2)} Lakhs
          </span>
        </div>
      </div>

      {/* Simulator Inputs & Key Result Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Inputs (5 cols) */}
        <div className="lg:col-span-5 space-y-4 bg-slate-950/60 border border-slate-800 p-4 rounded-xl">
          <h3 className="text-xs font-bold uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            Station Configuration Inputs
          </h3>

          {/* Charger Selections */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-300 block">Select Charger Hardware</label>
            {config.chargers.map((charger) => (
              <div key={charger.type} className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{charger.label}</p>
                  <p className="text-[10px] text-slate-400">₹{(charger.capexPerUnit / 100000).toFixed(1)} Lakh / unit</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => handleChargerQtyChange(charger.type, charger.quantity - 1)}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 font-bold text-white flex items-center justify-center"
                  >-</button>
                  <span className="w-6 text-center font-mono font-bold text-emerald-400">{charger.quantity}</span>
                  <button
                    onClick={() => handleChargerQtyChange(charger.type, charger.quantity + 1)}
                    className="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 font-bold text-white flex items-center justify-center"
                  >+</button>
                </div>
              </div>
            ))}
          </div>

          {/* Electricity Tariff & Selling Price Sliders */}
          <div className="space-y-3 pt-2">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Selling Tariff (Retail)</span>
                <span className="font-mono font-bold text-emerald-400">₹{config.sellingTariffPerKwh} / kWh</span>
              </div>
              <input
                type="range"
                min="12"
                max="25"
                step="0.5"
                value={config.sellingTariffPerKwh}
                onChange={(e) => setConfig({ ...config, sellingTariffPerKwh: parseFloat(e.target.value) })}
                className="w-full accent-emerald-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Target Utilization %</span>
                <span className="font-mono font-bold text-cyan-400">{config.targetUtilizationPercent}%</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                step="5"
                value={config.targetUtilizationPercent}
                onChange={(e) => setConfig({ ...config, targetUtilizationPercent: parseInt(e.target.value) })}
                className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Monthly Site Rent</span>
                <span className="font-mono text-slate-300">₹{config.monthlySiteRentInr.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="20000"
                max="120000"
                step="5000"
                value={config.monthlySiteRentInr}
                onChange={(e) => setConfig({ ...config, monthlySiteRentInr: parseInt(e.target.value) })}
                className="w-full accent-slate-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Calculated Results & Financial Dashboard (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Key Return Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-950/80 border border-emerald-500/30 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Annual ROI</span>
              <p className="text-xl font-black text-emerald-400 font-mono mt-0.5">{result.roiPercent}%</p>
            </div>

            <div className="bg-slate-950/80 border border-cyan-500/30 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Payback Period</span>
              <p className="text-xl font-black text-cyan-400 font-mono mt-0.5">{result.paybackPeriodMonths} <span className="text-xs font-normal text-slate-400">months</span></p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly Net Profit</span>
              <p className="text-lg font-bold text-white font-mono mt-0.5">₹{(result.monthlyNetProfitInr / 1000).toFixed(0)}k</p>
            </div>

            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">EBITDA Margin</span>
              <p className="text-lg font-bold text-purple-400 font-mono mt-0.5">{result.ebitdaMarginPercent}%</p>
            </div>
          </div>

          {/* Scenario Sensitivity Bar Chart */}
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="text-xs font-bold uppercase text-slate-200 tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-emerald-400" />
                Annual Financial Scenarios (₹ Lakhs)
              </h4>
              <span className="text-[10px] text-slate-400">Sensitivity Analysis</span>
            </div>

            <div className="w-full h-[210px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="scenario" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} unit="L" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '5px' }} />
                  <Bar dataKey="Revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Opex" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="EBITDA" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
