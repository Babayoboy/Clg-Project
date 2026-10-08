import React from 'react';
import { Calendar, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';
import { calculateMetricScores } from '../utils/scoring.js';

export const HabitHeatmap = ({ logs, profile, selectedDate, onSelectDate }) => {
  // Generate past 35 days grid (5 weeks x 7 days)
  const today = new Date();
  const days = [];

  const logMap = {};
  if (logs) {
    logs.forEach(l => {
      const scores = calculateMetricScores(l, profile);
      logMap[l.date] = { ...l, score: scores.compositeScore };
    });
  }

  for (let i = 34; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const logData = logMap[dateStr];
    days.push({
      dateStr,
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
      data: logData
    });
  }

  return (
    <div className="clinical-panel medical-corners rounded-2xl p-5 border-slate-700/80 shadow-xl flex flex-col justify-between font-mono">
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            LONGITUDINAL COMPLIANCE #CMP-35
          </span>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            35-Day Patient Biometric Compliance Matrix
          </h3>
          <p className="text-[10px] text-slate-400 font-sans">
            Longitudinal habit adherence and biomarker stability tracking (Select any cell to inspect dossier)
          </p>
        </div>

        {/* Clinical Compliance Legend */}
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded-lg border border-slate-800">
          <span>Non-Compliant</span>
          <span className="w-2.5 h-2.5 rounded bg-slate-900 border border-slate-700"></span>
          <span className="w-2.5 h-2.5 rounded bg-rose-600/80"></span>
          <span className="w-2.5 h-2.5 rounded bg-amber-500/80"></span>
          <span className="w-2.5 h-2.5 rounded bg-cyan-500/90"></span>
          <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
          <span>Homeostatic</span>
        </div>
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 gap-1.5 my-2">
        {days.map((item) => {
          const score = item.data?.score;
          const isSelected = item.dateStr === selectedDate;
          
          let cellBg = 'bg-slate-950/80 border-slate-800/80 text-slate-600 hover:border-slate-600';
          if (score !== undefined) {
            if (score >= 85) cellBg = 'bg-emerald-500/90 text-slate-950 font-bold border-emerald-400 shadow-sm shadow-emerald-500/20';
            else if (score >= 70) cellBg = 'bg-cyan-500/90 text-slate-950 font-bold border-cyan-400 shadow-sm shadow-cyan-500/20';
            else if (score >= 50) cellBg = 'bg-amber-500/80 text-slate-950 font-bold border-amber-400';
            else cellBg = 'bg-rose-600/80 text-white font-bold border-rose-400';
          }

          return (
            <button
              key={item.dateStr}
              onClick={() => onSelectDate(item.dateStr)}
              className={`h-9 rounded-lg flex flex-col items-center justify-center p-0.5 text-xs border transition-all relative group ${cellBg} ${
                isSelected ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10' : ''
              }`}
              title={`${item.dateStr}: ${score !== undefined ? `${score} pts (${item.data.mood})` : 'No specimen recorded'}`}
            >
              <span className="text-[9px] leading-none opacity-80">{item.dayNumber}</span>
              {score !== undefined && (
                <span className="text-[8px] leading-none mt-0.5 font-bold">
                  {score}
                </span>
              )}

              {/* Tooltip on hover */}
              <div className="absolute bottom-full mb-1 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                <div className="bg-slate-900 text-white text-[9px] font-mono px-2 py-1 rounded shadow-lg border border-slate-700 whitespace-nowrap">
                  {item.dateStr}: {score !== undefined ? `${score} Pts • ${item.data.mood}` : 'Empty'}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
        <span>ACTIVE DOSSIER DATE: <strong className="text-cyan-300">{selectedDate}</strong></span>
        <span>Diagnostic Target: &ge; 85 Pts (Grade A)</span>
      </div>

    </div>
  );
};

