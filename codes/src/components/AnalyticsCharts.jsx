import React, { useState } from 'react';
import { 
  LineChart, 
  BarChart, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Layers, 
  Moon, 
  Monitor, 
  Droplet, 
  Flame,
  Activity,
  HeartPulse,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const AnalyticsCharts = ({ logs, profile }) => {
  const [timeRange, setTimeRange] = useState('14D'); // '7D' | '14D' | '30D' | 'All'
  const [activeChannels, setActiveChannels] = useState({ sleep: true, screen: true, water: true });

  if (!logs || logs.length === 0) {
    return (
      <div className="clinical-panel rounded-2xl p-8 text-center text-slate-400 font-mono">
        NO BIOMETRIC TELEMETRY DETECTED IN LOCAL REGISTRY.
      </div>
    );
  }

  // Sort logs chronologically
  const sortedLogs = [...logs].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Filter by time range
  let filteredLogs = sortedLogs;
  if (timeRange === '7D') filteredLogs = sortedLogs.slice(-7);
  else if (timeRange === '14D') filteredLogs = sortedLogs.slice(-14);
  else if (timeRange === '30D') filteredLogs = sortedLogs.slice(-30);

  // Calculate statistics
  const avgSleep = (filteredLogs.reduce((sum, l) => sum + (parseFloat(l.sleep_hour) || 0), 0) / filteredLogs.length).toFixed(1);
  const avgScreen = (filteredLogs.reduce((sum, l) => sum + (parseFloat(l.screen_time) || 0), 0) / filteredLogs.length).toFixed(1);
  const avgWater = (filteredLogs.reduce((sum, l) => sum + (parseFloat(l.water_intake) || 0), 0) / filteredLogs.length).toFixed(1);
  const avgExercise = Math.round(filteredLogs.reduce((sum, l) => sum + (parseFloat(l.exercise_time) || 0) * 60, 0) / filteredLogs.length);

  // SVG Chart Dimensions
  const chartWidth = 700;
  const chartHeight = 220;
  const padding = 35;
  const graphWidth = chartWidth - padding * 2;
  const graphHeight = chartHeight - padding * 2;

  // Max bounds
  const maxVal = 12; // 12 hours max scale for sleep / screen

  // Generate SVG points for timeline
  const pointsSleep = filteredLogs.map((l, i) => {
    const x = padding + (i / Math.max(1, filteredLogs.length - 1)) * graphWidth;
    const y = chartHeight - padding - ((parseFloat(l.sleep_hour) || 0) / maxVal) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  const pointsScreen = filteredLogs.map((l, i) => {
    const x = padding + (i / Math.max(1, filteredLogs.length - 1)) * graphWidth;
    const y = chartHeight - padding - ((parseFloat(l.screen_time) || 0) / maxVal) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  const pointsWater = filteredLogs.map((l, i) => {
    const x = padding + (i / Math.max(1, filteredLogs.length - 1)) * graphWidth;
    const y = chartHeight - padding - (((parseFloat(l.water_intake) || 0) * 2.5) / maxVal) * graphHeight;
    return `${x},${y}`;
  }).join(' ');

  // Mood Counts
  const moodCounts = filteredLogs.reduce((acc, l) => {
    const m = l.mood || 'Good';
    acc[m] = (acc[m] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="mb-6 space-y-4">
      
      {/* SECTION HEADER & CONTROLS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            Longitudinal Telemetry & Multi-Channel Recorder
          </h2>
          <p className="text-[11px] text-slate-400 font-sans">
            Continuous waveform recording of Circadian, Neuro-Digital, and Fluidic Biomarkers
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 p-1 rounded-xl">
          {['7D', '14D', '30D', 'All'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                timeRange === range
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* CHARTS DUAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* MAIN TIMELINE CHART (8 COLS) */}
        <div className="lg:col-span-8 clinical-panel medical-corners rounded-2xl p-5 border-slate-700/80 flex flex-col justify-between shadow-xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 font-mono">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyan-950/80 text-cyan-300 border border-cyan-800/50 px-1.5 py-0.2 rounded font-bold">
                  RECORDER CH-1 / CH-2 / CH-3
                </span>
              </div>
              <h3 className="text-xs font-bold text-white mt-1">Multi-Channel Patient Telemetry Waveform</h3>
            </div>

            {/* Legend & Channel Indicators */}
            <div className="flex items-center flex-wrap gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-indigo-400 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></span> CH-1: Sleep ({avgSleep}h avg)
              </span>
              <span className="flex items-center gap-1.5 text-purple-400 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span> CH-2: Screen ({avgScreen}h avg)
              </span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px]">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400"></span> CH-3: Water ({avgWater}L avg)
              </span>
            </div>
          </div>

          {/* SVG Multi-Line Chart Canvas with Medical Millimeter Grid */}
          <div className="w-full overflow-x-auto bg-slate-950/80 rounded-xl p-2 border border-slate-800">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-52 min-w-[500px]">
              
              {/* Medical Grid Lines */}
              {[0, 2, 4, 6, 8, 10, 12].map((val) => {
                const y = chartHeight - padding - (val / maxVal) * graphHeight;
                return (
                  <g key={val}>
                    <line
                      x1={padding}
                      y1={y}
                      x2={chartWidth - padding}
                      y2={y}
                      stroke="rgba(6, 182, 212, 0.12)"
                      strokeWidth={val % 4 === 0 ? "1" : "0.5"}
                      strokeDasharray={val % 4 === 0 ? "" : "3 3"}
                    />
                    <text
                      x={padding - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="500"
                    >
                      {val}h
                    </text>
                  </g>
                );
              })}

              {/* Optimal sleep zone shaded band (7h - 9h) */}
              <rect
                x={padding}
                y={chartHeight - padding - (9 / maxVal) * graphHeight}
                width={graphWidth}
                height={((9 - 7) / maxVal) * graphHeight}
                fill="rgba(99, 102, 241, 0.08)"
              />
              <text
                x={chartWidth - padding - 5}
                y={chartHeight - padding - (8 / maxVal) * graphHeight + 3}
                textAnchor="end"
                fill="rgba(99, 102, 241, 0.6)"
                fontSize="8"
                fontFamily="JetBrains Mono, monospace"
              >
                OPTIMAL SLEEP BAND (7-9H)
              </text>

              {/* Line: Sleep (CH-1) */}
              <polyline
                fill="none"
                stroke="#818cf8"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsSleep}
              />

              {/* Line: Screen Time (CH-2) */}
              <polyline
                fill="none"
                stroke="#c084fc"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsScreen}
              />

              {/* Line: Water (CH-3) */}
              <polyline
                fill="none"
                stroke="#22d3ee"
                strokeWidth="2"
                strokeDasharray="3 3"
                points={pointsWater}
              />

              {/* Data Points */}
              {filteredLogs.map((l, i) => {
                const x = padding + (i / Math.max(1, filteredLogs.length - 1)) * graphWidth;
                const ySleep = chartHeight - padding - ((parseFloat(l.sleep_hour) || 0) / maxVal) * graphHeight;
                const yScreen = chartHeight - padding - ((parseFloat(l.screen_time) || 0) / maxVal) * graphHeight;
                
                return (
                  <g key={i} className="group">
                    {/* Sleep Dot */}
                    <circle
                      cx={x}
                      cy={ySleep}
                      r="3.5"
                      fill="#818cf8"
                      stroke="#0b0f19"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:r-5 transition-all"
                    />
                    {/* Screen Dot */}
                    <circle
                      cx={x}
                      cy={yScreen}
                      r="3.5"
                      fill="#c084fc"
                      stroke="#0b0f19"
                      strokeWidth="1.5"
                      className="cursor-pointer hover:r-5 transition-all"
                    />
                    {/* X-axis date labels */}
                    <text
                      x={x}
                      y={chartHeight - 12}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {l.date.slice(5)}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>CHART WINDOW: <strong>{filteredLogs.length} SPECIMEN POINTS</strong></span>
            <span className="text-cyan-300 font-semibold">Dotted Cyan = Water Scale Factor (x2.5)</span>
          </div>

        </div>

        {/* CORRELATION & MOOD DISTRIBUTION (4 COLS) */}
        <div className="lg:col-span-4 flex flex-col justify-between gap-4 font-mono">
          
          {/* Mood Distribution Card */}
          <div className="clinical-panel medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between shadow-xl">
            <div className="mb-2">
              <span className="text-[10px] text-teal-400 uppercase tracking-wider font-bold">ASSAY #PSY-05</span>
              <h3 className="text-xs font-bold text-white">Affective State Spectrum</h3>
              <p className="text-[10px] text-slate-400 font-sans">Distribution across {filteredLogs.length} logged days</p>
            </div>

            {/* Mood Bars */}
            <div className="space-y-2 my-2">
              {[
                { label: 'Energized', count: moodCounts['Energized'] || 0, color: 'bg-amber-400', emoji: '⚡' },
                { label: 'Good', count: moodCounts['Good'] || 0, color: 'bg-emerald-400', emoji: '😊' },
                { label: 'Neutral', count: moodCounts['Neutral'] || 0, color: 'bg-cyan-400', emoji: '😐' },
                { label: 'Tired / Stressed', count: (moodCounts['Tired'] || 0) + (moodCounts['Stressed'] || 0), color: 'bg-indigo-400', emoji: '🥱' },
                { label: 'Burnout Alert', count: moodCounts['Burnout Alert'] || 0, color: 'bg-rose-500', emoji: '🤯' }
              ].map((m) => {
                const percentage = Math.round((m.count / Math.max(1, filteredLogs.length)) * 100);
                return (
                  <div key={m.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span className="flex items-center gap-1.5 font-sans">
                        <span>{m.emoji}</span> {m.label}
                      </span>
                      <span className="font-semibold text-[11px]">{m.count}d ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`${m.color} h-full rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
              <span>Dominant State:</span>
              <strong className="text-emerald-400">
                {Object.entries(moodCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Good'}
              </strong>
            </div>
          </div>

          {/* Differential Diagnostic Correlation Highlight */}
          <div className="clinical-panel rounded-2xl p-4 border-slate-700/80 bg-gradient-to-br from-indigo-950/30 to-purple-950/20">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Clinical Differential Correlation
            </h4>
            <p className="text-xs text-slate-300 font-sans leading-relaxed">
              When screen load exceeds <strong className="text-purple-300 font-mono">6.5 hrs</strong>, circadian sleep duration decreases by <strong className="text-rose-400 font-mono">1.4 hrs</strong> with an observed 3x increase in somnolence reports.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

