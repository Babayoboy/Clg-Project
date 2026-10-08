import React from 'react';
import { Droplet, Plus, Minus, RotateCcw, Sparkles, TestTube, Syringe } from 'lucide-react';

export const QuickWaterLogger = ({ currentWater, targetWater, onUpdateWater }) => {
  const water = parseFloat(currentWater) || 0;
  const target = parseFloat(targetWater) || 3.0;
  const percentage = Math.min(100, Math.round((water / target) * 100));

  return (
    <div className="clinical-panel medical-corners rounded-2xl p-5 border-slate-700/80 shadow-xl flex flex-col justify-between font-mono h-full">
      
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            ASSAY #H2O-INF
          </span>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Droplet className="w-3.5 h-3.5 text-cyan-400" />
            Graduated Fluid Infusion Visualizer
          </h3>
          <p className="text-[10px] text-slate-400 font-sans">
            Real-time fluid volumetric assay & hydration titration
          </p>
        </div>
        <span className="text-xs font-bold text-cyan-300 bg-cyan-950/90 border border-cyan-800/60 px-2.5 py-1 rounded">
          {percentage}% DOSAGE
        </span>
      </div>

      <div className="flex items-center justify-around my-3 gap-3">
        
        {/* Medical Graduated Fluid Cylinder */}
        <div className="relative w-24 h-40 border-2 border-slate-600 rounded-b-xl rounded-t-sm bg-slate-950/90 overflow-hidden flex flex-col justify-end shadow-inner">
          
          {/* Volumetric Graduation Ticks on side */}
          <div className="absolute inset-y-0 left-0 w-full flex flex-col justify-between py-2 px-1 z-10 pointer-events-none opacity-50">
            {[3.0, 2.5, 2.0, 1.5, 1.0, 0.5].map((tick) => (
              <div key={tick} className="flex items-center justify-between text-[7px] text-slate-300 border-b border-slate-700/50 pb-0.5">
                <span>—</span>
                <span>{tick}L</span>
              </div>
            ))}
          </div>

          {/* Water Fill Level */}
          <div 
            className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-teal-300 transition-all duration-700 relative opacity-85"
            style={{ height: `${percentage}%` }}
          >
            {/* Wave meniscus line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/60 animate-pulse"></div>
          </div>

          {/* Centered Overlay Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
            <span className="text-lg font-mono font-extrabold text-white drop-shadow-md">
              {water.toFixed(2)}L
            </span>
            <span className="text-[9px] font-mono text-cyan-100 drop-shadow">
              of {target.toFixed(1)}L goal
            </span>
          </div>
        </div>

        {/* Quick Clinical Administration Actions */}
        <div className="flex flex-col gap-2 font-mono">
          <button
            onClick={() => onUpdateWater(Math.min(6, +(water + 0.25).toFixed(2)))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-sm transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+250 ml Bolus</span>
          </button>

          <button
            onClick={() => onUpdateWater(Math.min(6, +(water + 0.5).toFixed(2)))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs border border-cyan-800/40 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+500 ml Flask</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpdateWater(Math.max(0, +(water - 0.25).toFixed(2)))}
              disabled={water <= 0}
              className="flex-1 flex items-center justify-center gap-1 px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 font-medium text-xs border border-slate-700 disabled:opacity-30"
              title="Deduct 250ml"
            >
              <Minus className="w-3 h-3" />
              <span>-250ml</span>
            </button>

            <button
              onClick={() => onUpdateWater(0)}
              className="p-1.5 rounded bg-slate-900 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 text-xs border border-slate-700 transition-colors"
              title="Reset Fluid Assay to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>Clinical Rule: 250ml / 90min Interval</span>
        <span className="text-cyan-300 font-bold">{Math.max(0, (target - water).toFixed(2))}L Remaining</span>
      </div>

    </div>
  );
};

