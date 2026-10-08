import React from 'react';
import { 
  Flame, 
  Droplet, 
  Moon, 
  CalendarDays, 
  ShieldAlert, 
  TrendingUp, 
  Award,
  Sparkles,
  Zap,
  Activity,
  HeartPulse,
  CheckCircle2,
  Stethoscope,
  ClipboardList
} from 'lucide-react';
import { getVitalityStatus, calculateStreaks, generateDiagnosticReport } from '../utils/scoring.js';

export const VitalityOverview = ({ currentLog, allLogs, profile, onOpenLogModal, onOpenAiModal }) => {
  const currentScore = currentLog?.wellness_score ?? 78;
  const status = getVitalityStatus(currentScore);
  const streaks = calculateStreaks(allLogs, profile);
  const diagnostics = generateDiagnosticReport(allLogs, profile);

  // SVG circular calculation
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (currentScore / 100) * circumference;

  // Clinical Diagnostic Grade Calculation
  const getClinicalGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'EXCELLENT HOMEOSTASIS', desc: 'Optimal biomarker equilibrium across all physiological vectors.' };
    if (score >= 80) return { grade: 'A', label: 'OPTIMAL VITALITY', desc: 'Strong routine consistency with minor sub-optimal variances.' };
    if (score >= 70) return { grade: 'B+', label: 'NORMAL / STABLE', desc: 'Physiological parameters within acceptable clinical limits.' };
    if (score >= 55) return { grade: 'C', label: 'MILD ROUTINE STRAIN', desc: 'Elevated digital exposure or minor sleep deficit detected.' };
    return { grade: 'D', label: 'ACUTE BURNOUT RISK', desc: 'Critical circadian deficit or dehydration requiring corrective protocol.' };
  };

  const clinicalGrade = getClinicalGrade(currentScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      
      {/* Primary Clinical Vitality Gauge Panel (5 cols) */}
      <div className="lg:col-span-5 clinical-panel medical-corners rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border-[#373f51] hover:border-[#58a4b0]/50 transition-all shadow-xl bg-gradient-to-b from-[#222834]/95 to-[#1b1b1e]/95">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#58a4b0]/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        
        {/* Panel Header */}
        <div className="flex items-center justify-between z-10 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#58a4b0] bg-[#58a4b0]/15 border border-[#58a4b0]/40 px-2 py-0.5 rounded">
                <HeartPulse className="w-3 h-3" /> CLINICAL ASSAY #VTL-01
              </span>
            </div>
            <h2 className="text-base font-bold font-display text-white mt-1">
              Composite Vitality Index
            </h2>
          </div>
          
          <div className="text-right">
            <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded border ${status.bg} ${status.color} ${status.border}`}>
              GRADE {clinicalGrade.grade}
            </span>
          </div>
        </div>

        {/* Circular Dial & Breakdown */}
        <div className="flex flex-col sm:flex-row items-center gap-5 my-2 z-10">
          
          {/* Circular SVG Clinical Gauge */}
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Outer tick marks circle */}
              <circle
                cx="72"
                cy="72"
                r={radius + 8}
                className="stroke-[#373f51]/70"
                strokeWidth="1"
                strokeDasharray="2 6"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-[#373f51]"
                strokeWidth="9"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                stroke="currentColor"
                className={`transition-all duration-1000 ease-out ${
                  currentScore >= 75 ? 'text-[#58a4b0]' : currentScore >= 50 ? 'text-[#d99b4d]' : 'text-[#d45d6a]'
                }`}
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-mono font-extrabold text-white tracking-tight">
                {currentScore}
              </span>
              <span className="text-[10px] font-mono text-[#a9bcd0] uppercase tracking-wider">/ 100 PTS</span>
              <span className="text-[9px] font-mono font-semibold text-[#58a4b0] mt-0.5">
                {clinicalGrade.label}
              </span>
            </div>
          </div>

          {/* Biometric Sub-Assay Bars */}
          <div className="space-y-2 w-full font-mono text-xs">
            {/* Sleep Rest */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#a9bcd0] flex items-center gap-1">
                  <Moon className="w-3 h-3 text-[#a9bcd0]" /> Circadian Rest
                </span>
                <span className="font-semibold text-[#d8dbe2]">
                  {currentLog?.sleep_hour ? `${currentLog.sleep_hour}h / ${profile?.target_sleep || 8}h` : 'No Entry'}
                </span>
              </div>
              <div className="w-full bg-[#1b1b1e] border border-[#373f51] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#a9bcd0] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, ((currentLog?.sleep_hour || 0) / (profile?.target_sleep || 8)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#a9bcd0] flex items-center gap-1">
                  <Droplet className="w-3 h-3 text-[#58a4b0]" /> Fluid Hydration
                </span>
                <span className="font-semibold text-[#d8dbe2]">
                  {currentLog?.water_intake ? `${currentLog.water_intake}L / ${profile?.target_water || 3}L` : '0L'}
                </span>
              </div>
              <div className="w-full bg-[#1b1b1e] border border-[#373f51] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#58a4b0] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, ((currentLog?.water_intake || 0) / (profile?.target_water || 3)) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Kinetic Activity */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#a9bcd0] flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#d99b4d]" /> Kinetic Energy
                </span>
                <span className="font-semibold text-[#d8dbe2]">
                  {currentLog?.exercise_time ? `${Math.round(currentLog.exercise_time * 60)}m / 45m` : '0m'}
                </span>
              </div>
              <div className="w-full bg-[#1b1b1e] border border-[#373f51] h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#d99b4d] h-full rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, (((currentLog?.exercise_time || 0) * 60) / 45) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action footnote */}
        <div className="pt-3 border-t border-[#373f51] flex items-center justify-between text-[11px] font-mono text-[#a9bcd0] z-10">
          <span>SPECIMEN DATE: <strong className="text-[#d8dbe2]">{currentLog?.date || 'Today'}</strong></span>
          <button 
            onClick={onOpenLogModal}
            className="text-[#58a4b0] hover:text-[#d8dbe2] font-semibold flex items-center gap-1 transition-colors"
          >
            [+] Edit Assay &rarr;
          </button>
        </div>
      </div>

      {/* Burnout Risk & Clinical Compliance Panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-4">
        
        {/* Burnout Diagnostic Assessment Banner */}
        <div className="clinical-panel medical-corners rounded-2xl p-4 border-[#373f51] bg-gradient-to-r from-[#222834]/90 to-[#1b1b1e]/90">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                diagnostics.riskLevel === 'Critical' ? 'bg-rose-950/70 text-rose-400 border border-rose-800/60' :
                diagnostics.riskLevel === 'Moderate' ? 'bg-amber-950/70 text-amber-400 border border-amber-800/60' :
                'bg-emerald-950/70 text-emerald-400 border border-emerald-800/60'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#a9bcd0]">
                    DIAGNOSTIC TRIAGE SCORE: {diagnostics.burnoutIndex}/100
                  </span>
                </div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  Neuro-Fatigue & Burnout Index: <span className={diagnostics.riskColor}>{diagnostics.riskLevel}</span>
                </h3>
              </div>
            </div>

            <button
              onClick={onOpenAiModal}
              className="shrink-0 text-xs font-mono px-3 py-1.5 rounded-xl bg-[#373f51] border border-[#4b5873] text-[#58a4b0] hover:text-[#d8dbe2] hover:bg-[#475269] font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#58a4b0]" />
              <span>Run AI Differential &rarr;</span>
            </button>
          </div>

          {/* Diagnostic Clinical Impression snippet */}
          <div className="bg-[#1b1b1e] rounded-xl p-3 border border-[#373f51] text-xs font-mono text-[#d8dbe2] flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#58a4b0] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Clinical Impression:</strong> {diagnostics.alerts[0] || 'Physiological and behavioral parameters indicate stable homeostatic baseline.'}
            </p>
          </div>
        </div>

        {/* 4 Clinical Compliance & Tracking Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          
          {/* Metric 1: Total Recorded Cohort Days */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Cohort Registry</span>
              <CalendarDays className="w-3.5 h-3.5 text-[#58a4b0]" />
            </div>
            <div className="text-xl font-bold text-white">
              {streaks.activeDays} <span className="text-xs text-[#a9bcd0] font-normal">days</span>
            </div>
            <div className="text-[9px] text-[#58a4b0] mt-1">
              Specimen records
            </div>
          </div>

          {/* Metric 2: Fluid Compliance */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Hydro Protocol</span>
              <Droplet className="w-3.5 h-3.5 text-[#58a4b0]" />
            </div>
            <div className="text-xl font-bold text-[#58a4b0]">
              {streaks.waterStreak} <span className="text-xs text-[#a9bcd0] font-normal">days</span>
            </div>
            <div className="text-[9px] text-[#a9bcd0] mt-1">
              &ge; 2.5L threshold
            </div>
          </div>

          {/* Metric 3: Circadian Compliance */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Rest Protocol</span>
              <Moon className="w-3.5 h-3.5 text-[#a9bcd0]" />
            </div>
            <div className="text-xl font-bold text-[#a9bcd0]">
              {streaks.sleepStreak} <span className="text-xs text-[#a9bcd0] font-normal">days</span>
            </div>
            <div className="text-[9px] text-[#a9bcd0] mt-1">
              &ge; 6.5h sleep met
            </div>
          </div>

          {/* Metric 4: Diagnostic Milestone */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all bg-gradient-to-br from-[#d99b4d]/10 to-transparent">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Bio-Compliance</span>
              <Award className="w-3.5 h-3.5 text-[#d99b4d]" />
            </div>
            <div className="text-sm font-bold text-[#d99b4d] truncate">
              {streaks.activeDays >= 7 ? 'Cohort Master' : 'Initial Phase'}
            </div>
            <div className="text-[9px] text-[#d99b4d]/90 mt-1">
              {streaks.activeDays >= 14 ? 'Tier-3 Certified' : 'Level-1 Baseline'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

