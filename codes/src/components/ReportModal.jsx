import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  ShieldCheck, 
  Activity, 
  Award,
  CheckCircle,
  Calendar,
  HeartPulse,
  FileCheck,
  Sparkles,
  ClipboardList,
  AlertTriangle,
  Info
} from 'lucide-react';
import { generateDiagnosticReport, calculateStreaks } from '../utils/scoring.js';

export const ReportModal = ({ isOpen, onClose, logs, profile }) => {
  if (!isOpen) return null;

  const diagnostics = generateDiagnosticReport(logs, profile);
  const streaks = calculateStreaks(logs, profile);
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  const recentLogs = sortedLogs.slice(0, 10);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090d16] border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl my-8 text-slate-100 max-h-[92vh] overflow-y-auto font-mono">
        
        {/* Actions Bar (hidden in print) */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 no-print">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#58a4b0]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Personal Health & Wellness Summary Report
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#58a4b0] to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-[#58a4b0]/20 hover:scale-105 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PERSONAL HEALTH & LIFESTYLE REPORT */}
        <div className="mt-4 text-slate-900 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-300 font-sans" id="printable-report">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-display tracking-tight text-slate-950">
                  HNAZER HEALTH TRACKER
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Personal Lifestyle & Habit Summary Report • Daily Self-Tracking Analytics
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                On-Device Encrypted Records • Open Source Wellness Platform
              </p>
            </div>

            {/* Report Meta Info */}
            <div className="text-right font-mono text-xs text-slate-700 shrink-0">
              <div className="text-[11px] text-slate-800 font-bold">
                Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Total Days Tracked: <strong>{logs.length}</strong>
              </div>
            </div>
          </div>

          {/* CAUTION / INFORMATIONAL DISCLAIMER */}
          <div className="bg-amber-50 border border-amber-300 rounded-xl p-3.5 my-4 flex items-start gap-3 text-amber-900 text-xs">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-amber-950 uppercase tracking-wide block text-[11px] mb-0.5">
                Caution & Informational Disclaimer:
              </strong>
              <p className="leading-relaxed text-[11px] text-amber-900">
                This report is compiled strictly from <strong>self-reported lifestyle inputs</strong> (sleep, hydration, physical activity, and screen exposure) for personal awareness and habit optimization. It is <strong>NOT an official medical, clinical, or diagnostic report</strong> and must not be used for diagnosis, medical decision-making, or treatment. Always consult a qualified physician or healthcare provider for any health or medical concerns.
              </p>
            </div>
          </div>

          {/* User Demographics & Record Banner */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 my-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">User / Profile:</span>
                <strong className="text-slate-900 text-sm">{profile?.name || 'User'}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Profile Identifier:</span>
                <strong className="text-slate-900 font-mono">#HNZ-{profile?.user_id || 101}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Tracking Scope:</span>
                <span className="text-slate-800 font-medium">Daily Habits & Lifestyle</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Generated On:</span>
                <span className="text-slate-800 font-mono">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 mt-3 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-600 gap-2">
              <div>
                <span>Sampled Logged Days: <strong>{logs.length} Days</strong></span>
                <span className="mx-2">•</span>
                <span>Type: <strong>Self-Reported Personal Health Log</strong></span>
              </div>
              <div className="font-mono text-cyan-900 font-bold bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300 text-[10px]">
                STATUS: PERSONAL WELLNESS SUMMARY
              </div>
            </div>
          </div>

          {/* Daily Health & Habit Summary */}
          <div className="border border-slate-300 rounded-xl p-4 mb-5 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800">
                Daily Health & Habit Summary
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Overview based on your daily sleep, water intake, exercise, and screen time.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <div className="text-right">
                <div className="text-[9px] text-slate-500 font-bold uppercase">Health Score</div>
                <div className="text-2xl font-black text-cyan-800">{100 - diagnostics.burnoutIndex} / 100</div>
              </div>
              <div className="text-right pl-4 border-l border-slate-300">
                <div className="text-[9px] text-slate-500 font-bold uppercase">Fatigue Level</div>
                <div className={`text-sm font-bold ${
                  diagnostics.riskLevel === 'Critical' ? 'text-red-700' :
                  diagnostics.riskLevel === 'Moderate' ? 'text-amber-700' :
                  'text-emerald-700'
                }`}>
                  {diagnostics.riskLevel.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          {/* DAILY HABIT AVERAGES & TARGET TABLE */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-slate-700" />
              Daily Habit Averages & Healthy Targets
            </h4>
            
            <table className="w-full text-left text-xs border-collapse border border-slate-300 font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 font-sans">Tracked Habit</th>
                  <th className="p-2 border-r border-slate-300 text-right">Your 7D Average</th>
                  <th className="p-2 border-r border-slate-300 text-center">Units</th>
                  <th className="p-2 border-r border-slate-300">Target</th>
                  <th className="p-2 border-r border-slate-300 text-center">Status</th>
                  <th className="p-2 font-sans">Data Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {/* 1. Sleep */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Sleep</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.sleep}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">hrs/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ 7.0 — 9.0 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">
                    {parseFloat(diagnostics.averages.sleep) >= 7 ? 'ON TRACK' : 'BELOW TARGET'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Self-Reported Log</td>
                </tr>

                {/* 2. Physical Exercise */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Exercise & Activity</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.exercise}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">min/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ ≥ 30 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">
                    {diagnostics.averages.exercise >= 30 ? 'TARGET MET' : 'BELOW TARGET'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Self-Reported Log</td>
                </tr>

                {/* 3. Hydration */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Water Intake</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.water}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">Litres/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ ≥ 2.5 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-cyan-800">
                    {parseFloat(diagnostics.averages.water) >= 2.5 ? 'TARGET MET' : 'BELOW TARGET'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Self-Reported Log</td>
                </tr>

                {/* 4. Screen Time */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Screen Time</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.screen}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">hrs/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ ≤ 5.0 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-purple-800">
                    {parseFloat(diagnostics.averages.screen) <= 5 ? 'ON TRACK' : 'HIGH'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Self-Reported Log</td>
                </tr>

                {/* 5. Overall Score */}
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2 border-r border-slate-300 font-sans">Overall Health Score</td>
                  <td className="p-2 border-r border-slate-300 text-right text-cyan-800">{100 - diagnostics.burnoutIndex}</td>
                  <td className="p-2 border-r border-slate-300 text-center">Score / 100</td>
                  <td className="p-2 border-r border-slate-300">[ 75 — 100 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center text-emerald-700">OPTIMAL</td>
                  <td className="p-2 font-sans text-[11px]">Daily Habit Score</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Observations & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-700" />
                Observed Lifestyle Patterns
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {diagnostics.alerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-slate-700" />
                Suggested Lifestyle Adjustments
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {diagnostics.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recent Records Logbook Table */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800 mb-2">
              Recent Daily Activity Log (Last 10 Records)
            </h4>
            <table className="w-full text-left text-xs border-collapse border border-slate-300 font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300">Date</th>
                  <th className="p-1.5 border-r border-slate-300">Sleep (h)</th>
                  <th className="p-1.5 border-r border-slate-300">Exer (m)</th>
                  <th className="p-1.5 border-r border-slate-300">Water (L)</th>
                  <th className="p-1.5 border-r border-slate-300">Screen (h)</th>
                  <th className="p-1.5 border-r border-slate-300 font-sans">Mood</th>
                  <th className="p-1.5 font-sans">Personal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {recentLogs.map((l) => (
                  <tr key={l.date}>
                    <td className="p-1.5 font-semibold border-r border-slate-300">{l.date}</td>
                    <td className="p-1.5 border-r border-slate-300">{parseFloat(l.sleep_hour).toFixed(1)}</td>
                    <td className="p-1.5 border-r border-slate-300">{Math.round(parseFloat(l.exercise_time) * 60)}</td>
                    <td className="p-1.5 border-r border-slate-300">{parseFloat(l.water_intake).toFixed(1)}</td>
                    <td className="p-1.5 border-r border-slate-300">{parseFloat(l.screen_time).toFixed(1)}</td>
                    <td className="p-1.5 border-r border-slate-300 font-sans">{l.mood}</td>
                    <td className="p-1.5 truncate max-w-xs font-sans text-[11px]">{l.notes || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Report Footer & Disclaimer Note */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div>
              <div className="font-mono text-[11px]">
                Platform: <strong>Hnazer Health Tracker v1.0</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Self-reported personal data stored locally in user's browser. Informational only.
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-600">
              Personal Summary Prepared For: <strong className="text-slate-900">{profile?.name || 'User'}</strong>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
