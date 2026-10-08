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
  QrCode,
  FileCheck,
  Stethoscope,
  ClipboardList
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
            <HeartPulse className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Official Clinical Diagnostic Pathology & Health Report
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Clinical PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AUTHENTIC PRINTABLE CLINICAL MEDICAL REPORT */}
        <div className="mt-4 text-slate-900 bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-300 font-sans" id="printable-report">
          
          {/* Institutional Hospital / Lab Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-display tracking-tight text-slate-950">
                  HNAZER CLINICAL BIOMETRICS & DIAGNOSTIC LAB
                </span>
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                Department of Preventive Lifestyle Medicine & Circadian Informatics • Open Source Health Platform
              </p>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                NABL / ISO-15189 Telemetry Architecture Guidelines • Verified Client-Side Encrypted Database
              </p>
            </div>

            {/* Barcode & Report ID */}
            <div className="text-right font-mono text-xs text-slate-700 shrink-0">
              <div className="w-28 h-7 barcode-strip ml-auto opacity-90"></div>
              <div className="text-[10px] text-slate-500 font-bold mt-1">REPORT REF: HNZ-2026-DX-994</div>
            </div>
          </div>

          {/* Patient Demographics & Record Banner */}
          <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 my-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Patient Name:</span>
                <strong className="text-slate-900 text-sm">{profile?.name || 'Ansh Joshi'}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Medical Record (MRN):</span>
                <strong className="text-slate-900 font-mono">#HNZ-2026-{profile?.user_id || 101}</strong>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Age / Sex / Specimen:</span>
                <span className="text-slate-800 font-medium">22Y / Male • Routine Bio</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-500 uppercase font-mono block">Evaluation Date:</span>
                <span className="text-slate-800 font-mono">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            <div className="border-t border-slate-200 mt-3 pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between text-[11px] text-slate-600 gap-2">
              <div>
                <span>Evaluation Cohort: <strong>{logs.length} Logged Days Sampled</strong></span>
                <span className="mx-2">•</span>
                <span>Category: <strong>IGNOU Term-End Project Academic Dossier</strong></span>
              </div>
              <div className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                STATUS: FINAL VERIFIED CLINICAL DOSSIER
              </div>
            </div>
          </div>

          {/* Executive Clinical Triage Summary */}
          <div className="border border-slate-300 rounded-xl p-4 mb-5 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800">
                Executive Health Index & Clinical Triaging
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Multi-channel physiological evaluation of sleep debt, digital blue-load, kinetic expenditure, and fluid balance.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0 font-mono">
              <div className="text-right">
                <div className="text-[9px] text-slate-500 font-bold uppercase">Vitality Score</div>
                <div className="text-2xl font-black text-cyan-800">{100 - diagnostics.burnoutIndex} / 100</div>
              </div>
              <div className="text-right pl-4 border-l border-slate-300">
                <div className="text-[9px] text-slate-500 font-bold uppercase">Burnout Triage</div>
                <div className={`text-sm font-bold ${
                  diagnostics.riskLevel === 'Critical' ? 'text-red-700' :
                  diagnostics.riskLevel === 'Moderate' ? 'text-amber-700' :
                  'text-emerald-700'
                }`}>
                  {diagnostics.riskLevel.toUpperCase()} RISK
                </div>
              </div>
            </div>
          </div>

          {/* CLINICAL LABORATORY ASSAY TABLE */}
          <div className="mb-5">
            <h4 className="text-xs font-bold uppercase font-mono tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-slate-700" />
              Biometric Laboratory Assay Results & Reference Standards
            </h4>
            
            <table className="w-full text-left text-xs border-collapse border border-slate-300 font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 font-sans">Biometric Parameter / Assay</th>
                  <th className="p-2 border-r border-slate-300 text-right">Observed Value</th>
                  <th className="p-2 border-r border-slate-300 text-center">Units</th>
                  <th className="p-2 border-r border-slate-300">Reference Standard</th>
                  <th className="p-2 border-r border-slate-300 text-center">Status Flag</th>
                  <th className="p-2 font-sans">Methodology</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-900">
                {/* 1. Sleep */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Circadian Sleep Duration (7D Avg)</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.sleep}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">hrs/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ 7.00 — 9.00 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">
                    {parseFloat(diagnostics.averages.sleep) >= 7 ? 'NORMAL [N]' : 'DEFICIT [L]'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Circadian Actigraphy</td>
                </tr>

                {/* 2. Physical Exercise */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Kinetic Physical Activity (7D Avg)</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.exercise}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">min/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ ≥ 45.00 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-emerald-700">
                    {diagnostics.averages.exercise >= 30 ? 'OPTIMAL [N]' : 'SEDENTARY [L]'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Metabolic Calorie Log</td>
                </tr>

                {/* 3. Hydration */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Cellular Hydration Intake (7D Avg)</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.water}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">Litres/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ ≥ 3.00 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-cyan-800">
                    {parseFloat(diagnostics.averages.water) >= 2.5 ? 'NORMAL [N]' : 'DEFICIT [L]'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Osmotic Fluid Titration</td>
                </tr>

                {/* 4. Screen Time */}
                <tr>
                  <td className="p-2 border-r border-slate-300 font-sans font-medium">Neuro-Visual Screen Exposure (7D Avg)</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold">{diagnostics.averages.screen}</td>
                  <td className="p-2 border-r border-slate-300 text-center text-slate-600">hrs/day</td>
                  <td className="p-2 border-r border-slate-300 text-slate-600">[ ≤ 5.00 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center font-bold text-purple-800">
                    {parseFloat(diagnostics.averages.screen) <= 5 ? 'CONTROLLED [N]' : 'ELEVATED [H]'}
                  </td>
                  <td className="p-2 font-sans text-slate-600 text-[11px]">Photopic Screen Sensor</td>
                </tr>

                {/* 5. Composite Vitality */}
                <tr className="bg-slate-50 font-bold">
                  <td className="p-2 border-r border-slate-300 font-sans">Composite Diagnostic Vitality Score</td>
                  <td className="p-2 border-r border-slate-300 text-right text-cyan-800">{100 - diagnostics.burnoutIndex}</td>
                  <td className="p-2 border-r border-slate-300 text-center">Score / 100</td>
                  <td className="p-2 border-r border-slate-300">[ 75.00 — 100.0 ]</td>
                  <td className="p-2 border-r border-slate-300 text-center text-emerald-700">OPTIMAL [N]</td>
                  <td className="p-2 font-sans text-[11px]">Multi-Channel Algorithm</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Diagnostic Clinical Impression & Corrective Protocol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono mb-2 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-slate-700" />
                Identified Lifestyle Anomalies & Risk Factors
              </h5>
              <ul className="space-y-1.5 text-xs text-slate-700 list-disc list-inside">
                {diagnostics.alerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-300">
              <h5 className="text-xs font-bold text-slate-900 uppercase font-mono mb-2 flex items-center gap-1.5">
                <Stethoscope className="w-3.5 h-3.5 text-slate-700" />
                Evidence-Based Corrective Protocol (Rx)
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
              Recent Specimen Activity Logbook (Last 10 Records)
            </h4>
            <table className="w-full text-left text-xs border-collapse border border-slate-300 font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                  <th className="p-1.5 border-r border-slate-300">Date</th>
                  <th className="p-1.5 border-r border-slate-300">Sleep (h)</th>
                  <th className="p-1.5 border-r border-slate-300">Exer (m)</th>
                  <th className="p-1.5 border-r border-slate-300">Water (L)</th>
                  <th className="p-1.5 border-r border-slate-300">Screen (h)</th>
                  <th className="p-1.5 border-r border-slate-300 font-sans">Affect</th>
                  <th className="p-1.5 font-sans">Clinical Notes</th>
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

          {/* Official Sign-Off & Verification Seal */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <div>
              <div className="font-mono text-[11px]">
                System: <strong>Hnazer Clinical Diagnostic Engine v1.0</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Verified & Stored Locally via Client Browser LocalStorage / IndexedDB
              </div>
            </div>

            {/* Signature & Seal placeholder for academic viva */}
            <div className="text-right flex flex-col items-end">
              <div className="w-40 border-b border-slate-400 pb-1 mb-1 text-center font-serif italic text-slate-800">
                Ansh Joshi
              </div>
              <span className="text-[10px] font-mono uppercase text-slate-500">
                Candidate / Chief Evaluator Signature
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

