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

  // Vitality Grade Calculation
  const getClinicalGrade = (score) => {
    if (score >= 90) return { grade: 'A+', label: 'EXCELLENT BALANCE', desc: 'Optimal routine consistency across sleep, hydration, and activity.' };
    if (score >= 80) return { grade: 'A', label: 'OPTIMAL VITALITY', desc: 'Strong daily habit consistency with healthy lifestyle balance.' };
    if (score >= 70) return { grade: 'B+', label: 'HEALTHY & STABLE', desc: 'Habits are steady and within recommended target ranges.' };
    if (score >= 55) return { grade: 'C', label: 'MILD ROUTINE STRAIN', desc: 'Elevated screen time or low sleep detected.' };
    return { grade: 'D', label: 'FATIGUE RISK', desc: 'Low sleep hours or lower activity requiring rest.' };
  };

  const clinicalGrade = getClinicalGrade(currentScore);

  // Goals met count (used for progress dots)
  const log = currentLog || {};
  const goalsMetCount = [
    (parseFloat(log.sleep_hour) || 0) >= 7,
    (parseFloat(log.exercise_time) || 0) >= 0.5,
    (parseFloat(log.water_intake) || 0) >= 2.5,
    (parseFloat(log.screen_time) || 0) <= 5,
    ['Good', 'Energized'].includes(log.mood || ''),
    ['Balanced', 'Healthy'].includes(log.diet || '')
  ].filter(Boolean).length;

  // Verdict badge label
  const verdictBadge = currentScore === 0 ? { label: 'Pending', cls: 'bg-[#373f51] text-[#a9bcd0]' }
    : currentScore >= 85 ? { label: 'Optimal', cls: 'bg-emerald-950/80 text-emerald-300 border border-emerald-700' }
    : currentScore >= 65 ? { label: 'On Track', cls: 'bg-[#58a4b0]/15 text-[#58a4b0] border border-[#58a4b0]/40' }
    : { label: 'Attention', cls: 'bg-amber-950/70 text-amber-300 border border-amber-700' };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      
      {/* Primary Vitality Gauge Panel (5 cols) */}
      <div className="lg:col-span-5 clinical-panel medical-corners rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between border-[#373f51] hover:border-[#58a4b0]/50 transition-all shadow-xl bg-gradient-to-b from-[#222834]/95 to-[#1b1b1e]/95">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#58a4b0]/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        
        {/* Panel Header */}
        <div className="flex items-center justify-between z-10 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider text-[#58a4b0] bg-[#58a4b0]/15 border border-[#58a4b0]/40 px-2 py-0.5 rounded">
                <HeartPulse className="w-3 h-3" /> VITALITY INDEX
              </span>
            </div>
            <h2 className="text-base font-bold font-display text-white mt-1">
              Composite Vitality Index
            </h2>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <span className={`text-[11px] font-mono font-bold px-2.5 py-1 rounded border ${status.bg} ${status.color} ${status.border}`}>
              GRADE {clinicalGrade.grade}
            </span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${verdictBadge.cls}`}>
              {verdictBadge.label}
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

          {/* Sub-Metric Progress Bars */}
          <div className="space-y-2 w-full font-mono text-xs">
            {/* Sleep */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#a9bcd0] flex items-center gap-1 font-sans">
                  <Moon className="w-3 h-3 text-[#a9bcd0]" /> Daily Sleep
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
                <span className="text-[#a9bcd0] flex items-center gap-1 font-sans">
                  <Droplet className="w-3 h-3 text-[#58a4b0]" /> Water Intake
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

            {/* Exercise */}
            <div>
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-[#a9bcd0] flex items-center gap-1 font-sans">
                  <Flame className="w-3 h-3 text-[#d99b4d]" /> Exercise & Activity
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

        {/* Action footnote + Goals dots */}
        <div className="pt-3 border-t border-[#373f51] space-y-2 z-10">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#a9bcd0]">
            <span>LOG DATE: <strong className="text-[#d8dbe2]">{currentLog?.date || 'Today'}</strong></span>
            <button 
              onClick={onOpenLogModal}
              className="text-[#58a4b0] hover:text-[#d8dbe2] font-semibold flex items-center gap-1 transition-colors"
            >
              [+] Edit Log &rarr;
            </button>
          </div>
          {/* Goals progress dots */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-[#a9bcd0] uppercase tracking-wider">{goalsMetCount} of 6 targets met</span>
            <div className="flex gap-1.5 ml-1">
              {[0,1,2,3,4,5].map(i => (
                <span key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i < goalsMetCount ? 'bg-[#58a4b0] scale-110' : 'bg-[#373f51]'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Burnout Risk & Habit Tracking Panel (7 cols) */}
      <div className="lg:col-span-7 flex flex-col justify-between gap-4">
        
        {/* Burnout Risk Assessment Banner */}
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
                    FATIGUE RISK SCORE: {diagnostics.burnoutIndex}/100
                  </span>
                </div>
                <h3 className="text-sm font-bold font-mono text-white flex items-center gap-2">
                  Fatigue & Burnout Risk: <span className={diagnostics.riskColor}>{diagnostics.riskLevel}</span>
                </h3>
              </div>
            </div>

            <button
              onClick={onOpenAiModal}
              className="shrink-0 text-xs font-mono px-3 py-1.5 rounded-xl bg-[#373f51] border border-[#4b5873] text-[#58a4b0] hover:text-[#d8dbe2] hover:bg-[#475269] font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#58a4b0]" />
              <span>Run AI Insights &rarr;</span>
            </button>
          </div>

          {/* Lifestyle insight snippet */}
          <div className="bg-[#1b1b1e] rounded-xl p-3 border border-[#373f51] text-xs font-mono text-[#d8dbe2] flex items-start gap-2.5">
            <TrendingUp className="w-4 h-4 text-[#58a4b0] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Lifestyle Insight:</strong> {diagnostics.alerts[0] || 'Daily habits indicate steady balance across sleep and activity.'}
            </p>
          </div>
        </div>

        {/* 4 Habit Tracking Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
          
          {/* Metric 1: Total Recorded Days */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Tracked Days</span>
              <CalendarDays className="w-3.5 h-3.5 text-[#58a4b0]" />
            </div>
            <div className="text-xl font-bold text-white">
              {streaks.activeDays} <span className="text-xs text-[#a9bcd0] font-normal">days</span>
            </div>
            <div className="text-[9px] text-[#58a4b0] mt-1">
              Logged entries
            </div>
          </div>

          {/* Metric 2: Water Consistency */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Water Goal</span>
              <Droplet className="w-3.5 h-3.5 text-[#58a4b0]" />
            </div>
            <div className="text-xl font-bold text-[#58a4b0]">
              {streaks.waterStreak} <span className="text-xs text-[#a9bcd0] font-normal">days</span>
            </div>
            <div className="text-[9px] text-[#a9bcd0] mt-1">
              &ge; 2.5L target met
            </div>
          </div>

          {/* Metric 3: Sleep Consistency */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Sleep Goal</span>
              <Moon className="w-3.5 h-3.5 text-[#a9bcd0]" />
            </div>
            <div className="text-xl font-bold text-[#a9bcd0]">
              {streaks.sleepStreak} <span className="text-xs text-[#a9bcd0] font-normal">days</span>
            </div>
            <div className="text-[9px] text-[#a9bcd0] mt-1">
              &ge; 7h sleep met
            </div>
          </div>

          {/* Metric 4: Progress Status */}
          <div className="clinical-panel rounded-xl p-3 border-[#373f51] bg-[#222834]/80 flex flex-col justify-between hover:border-[#58a4b0]/50 transition-all bg-gradient-to-br from-[#d99b4d]/10 to-transparent">
            <div className="flex items-center justify-between text-[#a9bcd0] mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider">Habit Consistency</span>
              <Award className="w-3.5 h-3.5 text-[#d99b4d]" />
            </div>
            <div className="text-sm font-bold text-[#d99b4d] truncate">
              {streaks.activeDays >= 7 ? 'Consistent' : 'Getting Started'}
            </div>
            <div className="text-[9px] text-[#d99b4d]/90 mt-1">
              {streaks.activeDays >= 14 ? '2+ Weeks Strong' : 'Building Routine'}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

