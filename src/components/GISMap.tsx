'use client';

import React, { useState, useEffect } from 'react';
import { CandidateLocation, ChargingStation } from '../types/ev';
import { Layers, MapPin, Zap, Filter, Eye, AlertTriangle } from 'lucide-react';

interface GISMapProps {
  candidates: CandidateLocation[];
  existingStations: ChargingStation[];
  selectedCandidateId: string | null;
  onSelectCandidate: (candidate: CandidateLocation) => void;
  onSelectStation?: (station: ChargingStation) => void;
}

export const GISMap: React.FC<GISMapProps> = ({
  candidates,
  existingStations,
  selectedCandidateId,
  onSelectCandidate,
  onSelectStation
}) => {
  const [activeLayer, setActiveLayer] = useState<'candidates' | 'stations' | 'density' | 'gap'>('candidates');
  const [isClient, setIsClient] = useState(false);
  const [LeafletComponents, setLeafletComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
    // Dynamically import Leaflet components client-side only
    Promise.all([
      import('react-leaflet'),
      import('leaflet')
    ]).then(([ReactLeaflet, L]) => {
      setLeafletComponents({ ReactLeaflet, L });
    });
  }, []);

  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId) || candidates[0];

  return (
    <div className="relative w-full h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
      
      {/* Top Map Layer Control Header */}
      <div className="absolute top-4 left-4 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-xl p-2 shadow-xl flex items-center gap-2">
        <div className="text-xs text-slate-400 font-semibold px-2 flex items-center gap-1 border-r border-slate-800">
          <Layers className="w-3.5 h-3.5 text-emerald-400" />
          <span>GIS Layers:</span>
        </div>

        <button
          onClick={() => setActiveLayer('candidates')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'candidates'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🎯 Top AI Candidates ({candidates.length})
        </button>

        <button
          onClick={() => setActiveLayer('stations')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'stations'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          ⚡ Existing Supply ({existingStations.length})
        </button>

        <button
          onClick={() => setActiveLayer('gap')}
          className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
            activeLayer === 'gap'
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
              : 'text-slate-300 hover:bg-slate-800'
          }`}
        >
          🔥 Demand-Supply Gap
        </button>
      </div>

      {/* Map Legend (Bottom Right Overlay) */}
      <div className="absolute bottom-4 right-4 z-[400] bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-xl p-3 shadow-2xl text-xs space-y-2 max-w-xs">
        <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 flex items-center justify-between">
          <span>Map Legend</span>
          <span className="text-[10px] text-emerald-400 font-mono">Delhi NCT</span>
        </div>
        
        {activeLayer === 'candidates' && (
          <div className="space-y-1.5 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-slate-950">1</span>
              <span>Ranked Candidate Site (Gold Core)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-400 border border-cyan-200 animate-ping" />
              <span>Selected Site Spotlight</span>
            </div>
          </div>
        )}

        {activeLayer === 'stations' && (
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <span>Tata Power / Statiq / Fortum</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span>BluSmart / Commercial Depot</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <span>DTL Public Fast Charger</span>
            </div>
          </div>
        )}

        {activeLayer === 'gap' && (
          <div className="space-y-1 text-slate-300">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-red-500/80" />
              <span>Critical Deficit (Score &gt; 90)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-amber-500/80" />
              <span>High Deficit (Score 80-90)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-500/80" />
              <span>Moderate Supply Match</span>
            </div>
          </div>
        )}
      </div>

      {/* Render Leaflet Map */}
      {!isClient || !LeafletComponents ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3">
          <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono">Initializing Delhi GIS Map Engine...</span>
        </div>
      ) : (
        <LeafletMapView
          LeafletComponents={LeafletComponents}
          candidates={candidates}
          existingStations={existingStations}
          selectedCandidate={selectedCandidate}
          activeLayer={activeLayer}
          onSelectCandidate={onSelectCandidate}
        />
      )}
    </div>
  );
};

// Internal subcomponent to render Leaflet map safely
const LeafletMapView = ({
  LeafletComponents,
  candidates,
  existingStations,
  selectedCandidate,
  activeLayer,
  onSelectCandidate
}: any) => {
  const { ReactLeaflet, L } = LeafletComponents;
  const { MapContainer, TileLayer, Marker, Popup, Circle, CircleMarker } = ReactLeaflet;

  // Custom Icon factory
  const createRankIcon = (rank: number, isSelected: boolean) => {
    return L.divIcon({
      className: 'custom-rank-pin',
      html: `
        <div class="relative group cursor-pointer">
          <div class="w-8 h-8 rounded-full ${
            isSelected
              ? 'bg-gradient-to-tr from-cyan-400 to-emerald-400 scale-125 ring-4 ring-emerald-400/40 shadow-xl'
              : 'bg-gradient-to-tr from-emerald-500 to-cyan-500 hover:scale-110'
          } flex items-center justify-center text-slate-950 font-black text-xs shadow-lg transition-all border border-white/40">
            ${rank}
          </div>
          ${isSelected ? '<div class="absolute -inset-1 rounded-full bg-emerald-400/30 animate-ping"></div>' : ''}
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const createStationIcon = (operator: string) => {
    let color = 'bg-cyan-500';
    if (operator.includes('BluSmart')) color = 'bg-emerald-500';
    if (operator.includes('Transco')) color = 'bg-violet-500';
    if (operator.includes('Ather')) color = 'bg-amber-500';

    return L.divIcon({
      className: 'custom-station-pin',
      html: `
        <div class="w-6 h-6 rounded-lg ${color} flex items-center justify-center text-slate-950 font-bold shadow-md border border-white/30 text-[10px]">
          ⚡
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });
  };

  return (
    <MapContainer
      center={[28.6139, 77.2090]} // Center of Delhi
      zoom={11}
      scrollWheelZoom={true}
      className="w-full h-full z-10"
      style={{ background: '#020617' }}
    >
      {/* Dark Matter Map Tile */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> & Delhi GIS'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />

      {/* Layer: Candidate Pins */}
      {(activeLayer === 'candidates' || activeLayer === 'gap') &&
        candidates.map((c: CandidateLocation) => {
          const isSelected = c.id === selectedCandidate.id;
          return (
            <React.Fragment key={c.id}>
              <Marker
                position={[c.latitude, c.longitude]}
                icon={createRankIcon(c.rank, isSelected)}
                eventHandlers={{
                  click: () => onSelectCandidate(c)
                }}
              >
                <Popup className="dark-leaflet-popup">
                  <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 space-y-1.5 min-w-[200px]">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1">
                      <span className="font-bold text-xs text-emerald-400">Rank #{c.rank} Candidate</span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-mono">
                        {c.score} / 100
                      </span>
                    </div>
                    <p className="font-semibold text-xs text-slate-100">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.district}</p>
                    <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-950 p-1.5 rounded text-slate-300">
                      <div>Demand: <span className="font-semibold text-emerald-400">{c.demandScore}</span></div>
                      <div>Gap: <span className="font-semibold text-cyan-400">{c.supplyGapScore}</span></div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Draw 1km Service Radius Circle around candidate */}
              {isSelected && (
                <Circle
                  center={[c.latitude, c.longitude]}
                  radius={1500}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: '4, 4'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}

      {/* Layer: Existing Stations */}
      {(activeLayer === 'stations' || activeLayer === 'candidates') &&
        existingStations.map((st: ChargingStation) => (
          <Marker
            key={st.id}
            position={[st.latitude, st.longitude]}
            icon={createStationIcon(st.operator)}
          >
            <Popup>
              <div className="bg-slate-900 text-white p-2 rounded border border-slate-800 space-y-1 min-w-[180px]">
                <p className="text-xs font-bold text-cyan-400">{st.name}</p>
                <p className="text-[10px] text-slate-400">{st.operator} • {st.district}</p>
                <div className="text-[10px] text-slate-300">
                  <span>Chargers: {st.chargerCount} ({st.powerKw} kW)</span><br />
                  <span>Utilisation: {st.utilizationRate}%</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Layer: Demand-Supply Gap Zone Markers */}
      {activeLayer === 'gap' && (
        <>
          {/* North Delhi Deficit Zone */}
          <CircleMarker
            center={[28.6750, 77.2250]}
            radius={45}
            pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.25 }}
          />
          {/* West Delhi Deficit Zone */}
          <CircleMarker
            center={[28.6320, 77.0850]}
            radius={40}
            pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.25 }}
          />
          {/* East Delhi Deficit Zone */}
          <CircleMarker
            center={[28.6400, 77.3050]}
            radius={35}
            pathOptions={{ color: '#f59e0b', fillColor: '#f59e0b', fillOpacity: 0.25 }}
          />
        </>
      )}
    </MapContainer>
  );
};
