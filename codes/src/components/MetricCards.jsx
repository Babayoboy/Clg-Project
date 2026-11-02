import React from 'react';
import { 
  Moon, 
  Flame, 
  Droplets, 
  Monitor, 
  Smile, 
  Utensils, 
  Plus, 
  Clock, 
  Sparkles,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  FlaskConical,
  TestTube,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const MetricCards = ({ 
  currentLog, 
  profile, 
  onQuickAddWater, 
  onOpenLogModal 
}) => {
  const sleep = parseFloat(currentLog?.sleep_hour) || 0;
  const exercise = parseFloat(currentLog?.exercise_time) || 0;
  const water = parseFloat(currentLog?.water_intake) || 0;
  const screen = parseFloat(currentLog?.screen_time) || 0;
  const mood = currentLog?.mood || 'Good';
  const diet = currentLog?.diet || 'Balanced';

  // Mood Config
  const moodConfig = {
    'Energized': { emoji: '⚡', clinicalFlag: 'HIGH ENERGY', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    'Good': { emoji: '😊', clinicalFlag: 'POSITIVE & BALANCED', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
    'Neutral': { emoji: '😐', clinicalFlag: 'STEADY / NORMAL', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
    'Tired': { emoji: '🥱', clinicalFlag: 'LOW ENERGY', color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30' },
    'Stressed': { emoji: '😫', clinicalFlag: 'ELEVATED STRESS', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' },
    'Burnout Alert': { emoji: '🤯', clinicalFlag: 'HIGH FATIGUE', color: 'text-red-500', bg: 'bg-red-500/20', border: 'border-red-500/40' }
  }[mood] || { emoji: '😊', clinicalFlag: 'POSITIVE & BALANCED', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 font-mono">
        <div>
          <h2 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-cyan-400" />
            Daily Habit Metrics (6 Key Areas)
          </h2>
          <p className="text-[11px] text-slate-400 font-sans">
            Self-logged habit tracking compared against healthy daily target guidelines
          </p>
        </div>
        <button
          onClick={onOpenLogModal}
          className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
        >
          <span>[+] Edit Habits</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* CARD 1: SLEEP */}
        <div className="clinical-panel clinical-panel-hover medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between relative overflow-hidden group font-mono">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider block">
                  DAILY SLEEP
                </span>
                <span className="text-xs text-slate-200 font-bold font-sans">Sleep Rest</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-mono font-semibold text-[#a9bcd0] bg-[#222834] border border-[#373f51] px-2 py-0.5 rounded-full">
                Goal: {profile?.target_sleep || 8}h
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                sleep >= 7 && sleep <= 9 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                sleep >= 6 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {sleep >= 7 && sleep <= 9 ? '✓ ON TARGET' : sleep < 6 ? '▼ LOW' : '▲ HIGH'}
              </span>
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{sleep.toFixed(1)}</span>
              <span className="text-xs text-slate-400">hours</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center justify-between">
              <span>Target: <strong>[ 7.0 — 9.0 hrs ]</strong></span>
              <span className="text-indigo-300 font-mono">{sleep >= 7 ? 'Well Rested' : 'Low Sleep'}</span>
            </div>
          </div>

          <div className="space-y-1 mt-2 pt-2 border-t border-slate-800">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (sleep / (profile?.target_sleep || 8)) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Goal: {profile?.target_sleep || 8}h</span>
              <span>{Math.round((sleep / (profile?.target_sleep || 8)) * 100)}% of Goal</span>
            </div>
          </div>
        </div>

        {/* CARD 2: EXERCISE & PHYSICAL ACTIVITY */}
        <div className="clinical-panel clinical-panel-hover medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between relative overflow-hidden group font-mono">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                  ACTIVITY
                </span>
                <span className="text-xs text-slate-200 font-bold font-sans">Exercise</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-mono font-semibold text-[#a9bcd0] bg-[#222834] border border-[#373f51] px-2 py-0.5 rounded-full">
                Goal: {Math.round((profile?.target_exercise || 0.75) * 60)}m
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-amber-500/10 text-amber-300 border-amber-500/30">
                ~{Math.round(exercise * 280)} kcal
              </span>
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{Math.round(exercise * 60)}</span>
              <span className="text-xs text-slate-400">minutes ({exercise.toFixed(2)}h)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center justify-between">
              <span>Target: <strong>[ ≥ 45 min ]</strong></span>
              <span className="text-amber-300 font-mono">{exercise >= 0.75 ? 'Target Met' : 'Under Target'}</span>
            </div>
          </div>

          <div className="space-y-1 mt-2 pt-2 border-t border-slate-800">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (exercise / (profile?.target_exercise || 0.75)) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Goal: {Math.round((profile?.target_exercise || 0.75) * 60)}m</span>
              <span>{Math.round((exercise / (profile?.target_exercise || 0.75)) * 100)}% of Goal</span>
            </div>
          </div>
        </div>

        {/* CARD 3: WATER INTAKE */}
        <div className="clinical-panel clinical-panel-hover medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between relative overflow-hidden group font-mono">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                <Droplets className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
                  HYDRATION
                </span>
                <span className="text-xs text-slate-200 font-bold font-sans">Water Intake</span>
              </div>
            </div>

            {/* Quick +250ml glass */}
            <button
              onClick={() => onQuickAddWater(0.25)}
              className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all shadow-sm"
              title="Add 250ml glass"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>+250ml</span>
            </button>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-cyan-300 tracking-tight">{water.toFixed(2)}</span>
              <span className="text-xs text-slate-400">Litres ({Math.round(water / 0.25)} glasses)</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center justify-between">
              <span>Target: <strong>[ ≥ 3.0 L ]</strong></span>
              <span className="text-cyan-300 font-mono">{water >= 2.5 ? 'Well Hydrated' : 'Drink More Water'}</span>
            </div>
          </div>

          <div className="space-y-1 mt-2 pt-2 border-t border-slate-800">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (water / (profile?.target_water || 3)) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Target: {profile?.target_water || 3}L</span>
              <span>{Math.round((water / (profile?.target_water || 3)) * 100)}% of Goal</span>
            </div>
          </div>
        </div>

        {/* CARD 4: SCREEN TIME */}
        <div className="clinical-panel clinical-panel-hover medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between relative overflow-hidden group font-mono">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                <Monitor className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                  SCREEN TIME
                </span>
                <span className="text-xs text-slate-200 font-bold font-sans">Daily Screen Use</span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-mono font-semibold text-[#a9bcd0] bg-[#222834] border border-[#373f51] px-2 py-0.5 rounded-full">
                Max {profile?.max_screen_time || 5}h
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                screen <= (profile?.max_screen_time || 5) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                screen <= (profile?.max_screen_time || 5) + 2 ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {screen <= (profile?.max_screen_time || 5) ? '✓ ON TARGET' : '▲ OVER TARGET'}
              </span>
            </div>
          </div>

          <div className="my-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{screen.toFixed(1)}</span>
              <span className="text-xs text-slate-400">hours</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5 flex items-center justify-between">
              <span>Limit: <strong>[ ≤ 5.0 hrs ]</strong></span>
              <span className="text-purple-300 font-mono">{screen <= 5 ? 'Healthy Range' : 'High Screen Time'}</span>
            </div>
          </div>

          <div className="space-y-1 mt-2 pt-2 border-t border-slate-800">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  screen <= 5 ? 'bg-purple-400' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.min(100, (screen / 10) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Goal: max {profile?.max_screen_time || 5}h</span>
              <span>Take regular eye breaks</span>
            </div>
          </div>
        </div>

        {/* CARD 5: MOOD & ENERGY */}
        <div className="clinical-panel clinical-panel-hover medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between relative overflow-hidden group font-mono">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                <Smile className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider block">
                  MOOD
                </span>
                <span className="text-xs text-slate-200 font-bold font-sans">Mood & Energy</span>
              </div>
            </div>

            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${moodConfig.bg} ${moodConfig.color} ${moodConfig.border}`}>
              {mood}
            </span>
          </div>

          <div className="my-2 flex items-center gap-3">
            <span className="text-3xl">{moodConfig.emoji}</span>
            <div>
              <div className="text-base font-bold text-white tracking-tight">{mood}</div>
              <div className="text-[10px] text-slate-400 font-sans truncate max-w-[170px]">
                {currentLog?.notes || 'No daily notes recorded.'}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-sans">Status:</span>
            <span className={moodConfig.color}>
              {moodConfig.clinicalFlag}
            </span>
          </div>
        </div>

        {/* CARD 6: DIET & NUTRITION */}
        <div className="clinical-panel clinical-panel-hover medical-corners rounded-2xl p-4 border-slate-700/80 flex flex-col justify-between relative overflow-hidden group font-mono">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <Utensils className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider block">
                  DIET
                </span>
                <span className="text-xs text-slate-200 font-bold font-sans">Daily Meals</span>
              </div>
            </div>

            <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-300 border-emerald-500/30">
              {diet}
            </span>
          </div>

          <div className="my-2">
            <div className="text-2xl font-bold text-white tracking-tight">{diet}</div>
            <div className="text-[11px] text-slate-400 font-sans mt-0.5">
              Goal: <strong>[ Balanced & Fresh ]</strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
            <span className="text-slate-400 font-sans">Meal Quality:</span>
            <span className="text-slate-300">
              {diet === 'Healthy' ? 'Healthy & Fresh' : diet === 'Fast Food' ? 'High Fast Food' : 'Regular Meals'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

