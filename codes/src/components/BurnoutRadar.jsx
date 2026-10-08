import React from 'react';
import { ShieldCheck, Crosshair, Sparkles, Activity, Compass } from 'lucide-react';
import { calculateMetricScores } from '../utils/scoring.js';

export const BurnoutRadar = ({ currentLog, profile }) => {
  const scores = calculateMetricScores(currentLog, profile);

  // 6 Axis Biometric Assays
  const axes = [
    { label: 'Circadian Rest', code: 'SLP', score: scores.sleepScore },
    { label: 'Hydration Osm', code: 'H2O', score: scores.waterScore },
    { label: 'Kinetic Burn', code: 'ACT', score: scores.exerciseScore },
    { label: 'Digital Calm', code: 'SCR', score: scores.screenScore },
    { label: 'Affect Balance', code: 'PSY', score: scores.moodScore },
    { label: 'Nutrition', code: 'NUT', score: scores.dietScore }
  ];

  const size = 260;
  const center = size / 2;
  const radius = 90;
  const totalAxes = axes.length;

  // Function to calculate (x, y) coordinates for a given index and normalized score (0-1)
  const getCoordinates = (index, valueNormalized) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const x = center + radius * valueNormalized * Math.cos(angle);
    const y = center + radius * valueNormalized * Math.sin(angle);
    return { x, y };
  };

  // Polygon points
  const polygonPoints = axes.map((axis, i) => {
    const normalized = Math.max(0.15, axis.score / 100);
    const { x, y } = getCoordinates(i, normalized);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="clinical-panel medical-corners rounded-2xl p-5 border-slate-700/80 shadow-xl flex flex-col justify-between font-mono h-full">
      
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            RETICLE #RAD-06
          </span>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            6-Axis Homeostasis Equilibrium Reticle
          </h3>
          <p className="text-[10px] text-slate-400 font-sans">
            Multi-dimensional physiological stability mapping
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded bg-cyan-950/90 border border-cyan-800/60 text-cyan-300">
          {scores.compositeScore}% EQ
        </span>
      </div>

      {/* SVG Radar Visualization */}
      <div className="flex items-center justify-center my-2">
        <svg width={size} height={size} className="overflow-visible">
          <defs>
            <linearGradient id="clinicalRadarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.15" />
            </linearGradient>
          </defs>

          {/* Web Background Rings (25%, 50%, 75%, 100%) */}
          {[0.25, 0.5, 0.75, 1.0].map((level) => {
            const ringPoints = Array.from({ length: totalAxes }).map((_, i) => {
              const { x, y } = getCoordinates(i, level);
              return `${x},${y}`;
            }).join(' ');

            return (
              <polygon
                key={level}
                points={ringPoints}
                fill="none"
                stroke="rgba(6, 182, 212, 0.15)"
                strokeWidth="1"
                strokeDasharray={level === 1.0 ? "" : "2 2"}
              />
            );
          })}

          {/* Concentric crosshair guide circle */}
          <circle cx={center} cy={center} r={radius * 0.5} stroke="rgba(255,255,255,0.06)" fill="none" />

          {/* Radial Spokes from center */}
          {Array.from({ length: totalAxes }).map((_, i) => {
            const { x, y } = getCoordinates(i, 1.0);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="rgba(6, 182, 212, 0.25)"
                strokeWidth="1"
              />
            );
          })}

          {/* Center Crosshair Tick */}
          <line x1={center - 4} y1={center} x2={center + 4} y2={center} stroke="#06b6d4" strokeWidth="1" />
          <line x1={center} y1={center - 4} x2={center} y2={center + 4} stroke="#06b6d4" strokeWidth="1" />

          {/* User Score Polygon Area */}
          <polygon
            points={polygonPoints}
            fill="url(#clinicalRadarGrad)"
            stroke="#22d3ee"
            strokeWidth="2"
            className="transition-all duration-700 ease-out"
          />

          {/* Axis Labels & Vertex Dots */}
          {axes.map((axis, i) => {
            const normalized = Math.max(0.15, axis.score / 100);
            const { x, y } = getCoordinates(i, normalized);
            const labelPos = getCoordinates(i, 1.25);

            return (
              <g key={axis.label}>
                {/* Vertex Dot */}
                <circle
                  cx={x}
                  cy={y}
                  r="3.5"
                  fill="#22d3ee"
                  stroke="#080c14"
                  strokeWidth="2"
                />
                {/* Text Label */}
                <text
                  x={labelPos.x}
                  y={labelPos.y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="600"
                >
                  [{axis.code}] {axis.score}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>Target Baseline: Fully symmetric hexagon</span>
        <span className="text-cyan-300 font-bold">Homeostatic Index: {scores.compositeScore}%</span>
      </div>

    </div>
  );
};

