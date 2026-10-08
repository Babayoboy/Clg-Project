import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Moon, 
  Flame, 
  Droplet, 
  Monitor, 
  Smile, 
  Utensils, 
  Sparkles,
  Calendar,
  AlertCircle,
  FlaskConical,
  HeartPulse,
  ClipboardList
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateMetricScores } from '../utils/scoring.js';

export const DailyLogModal = ({ 
  isOpen, 
  onClose, 
  initialData, 
  selectedDate, 
  profile, 
  onSaveLog 
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
  const [sleepHour, setSleepHour] = useState(7.5);
  const [exerciseTime, setExerciseTime] = useState(0.5); // in hours
  const [waterIntake, setWaterIntake] = useState(2.5);
  const [screenTime, setScreenTime] = useState(5.0);
  const [mood, setMood] = useState('Good');
  const [diet, setDiet] = useState('Balanced');
  const [notes, setNotes] = useState('');

  // Load initialData when opening or editing
  useEffect(() => {
    if (initialData) {
      setDate(initialData.date || selectedDate);
      setSleepHour(parseFloat(initialData.sleep_hour) || 7.5);
      setExerciseTime(parseFloat(initialData.exercise_time) || 0.5);
      setWaterIntake(parseFloat(initialData.water_intake) || 2.5);
      setScreenTime(parseFloat(initialData.screen_time) || 5.0);
      setMood(initialData.mood || 'Good');
      setDiet(initialData.diet || 'Balanced');
      setNotes(initialData.notes || '');
    } else {
      setDate(selectedDate || new Date().toISOString().split('T')[0]);
      setSleepHour(7.5);
      setExerciseTime(0.5);
      setWaterIntake(2.5);
      setScreenTime(5.0);
      setMood('Good');
      setDiet('Balanced');
      setNotes('');
    }
  }, [initialData, selectedDate, isOpen]);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const newLog = {
      id: initialData?.id || 'log_' + date,
      user_id: profile?.user_id || 101,
      name: profile?.name || 'User',
      date,
      sleep_hour: parseFloat(sleepHour),
      exercise_time: parseFloat(exerciseTime),
      water_intake: parseFloat(waterIntake),
      screen_time: parseFloat(screenTime),
      mood,
      diet,
      notes: notes.trim()
    };

    const calculated = calculateMetricScores(newLog, profile);
    newLog.wellness_score = calculated.compositeScore;

    // Trigger celebration if high score
    if (calculated.compositeScore >= 80) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }

    onSaveLog(newLog);
    onClose();
  };

  const moods = [
    { label: 'Energized', emoji: '⚡', clinical: 'Hyper-Energetic', color: 'border-amber-400 text-amber-400 bg-amber-500/10' },
    { label: 'Good', emoji: '😊', clinical: 'Euthymic (Optimal)', color: 'border-emerald-400 text-emerald-400 bg-emerald-500/10' },
    { label: 'Neutral', emoji: '😐', clinical: 'Normo-Affect', color: 'border-cyan-400 text-cyan-400 bg-cyan-500/10' },
    { label: 'Tired', emoji: '🥱', clinical: 'Mild Somnolence', color: 'border-indigo-400 text-indigo-400 bg-indigo-500/10' },
    { label: 'Stressed', emoji: '😫', clinical: 'Cortisol Strain', color: 'border-rose-400 text-rose-400 bg-rose-500/10' },
    { label: 'Burnout Alert', emoji: '🤯', clinical: 'Acute Neuro-Fatigue', color: 'border-red-500 text-red-500 bg-red-500/20' }
  ];

  const dietOptions = ['Healthy', 'Balanced', 'Average', 'Fast Food', 'Irregular'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-mono">
      <div className="relative w-full max-w-2xl bg-[#0b101c] border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
              INTAKE PROTOCOL #LOG-01
            </span>
            <h2 className="text-base font-bold text-white flex items-center gap-2 mt-0.5 font-display">
              <FlaskConical className="w-5 h-5 text-cyan-400" />
              {initialData ? 'Edit Biometric Assay Entry' : 'Log Daily Biometric Assay'}
            </h2>
            <p className="text-xs text-slate-400 font-sans">
              Enter clinical readings for Circadian Rest, Fluidics, Kinetics, and Neuro-Screen Exposure
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-5 mt-4 text-xs">
          
          {/* Specimen Date Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Specimen Record Date (YYYY-MM-DD)
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-cyan-300 font-bold focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* 2-Column Metrics Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Sleep Hour */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-400" /> [LAB-SLP] Sleep Duration
                </span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {sleepHour} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="14"
                step="0.5"
                value={sleepHour}
                onChange={(e) => setSleepHour(e.target.value)}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0h</span>
                <span className="text-indigo-300 font-semibold">7-9h (Standard Ref)</span>
                <span>14h</span>
              </div>
            </div>

            {/* 2. Physical Activity */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" /> [LAB-ACT] Kinetic Load
                </span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {Math.round(exerciseTime * 60)} min ({exerciseTime}h)
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="3"
                step="0.25"
                value={exerciseTime}
                onChange={(e) => setExerciseTime(e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0 min</span>
                <span className="text-amber-300 font-semibold">&ge; 45 min (Target)</span>
                <span>3 hrs</span>
              </div>
            </div>

            {/* 3. Water Intake */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-cyan-400" /> [LAB-H2O] Fluid Volume
                </span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {waterIntake} Litres
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.25"
                value={waterIntake}
                onChange={(e) => setWaterIntake(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0L</span>
                <span className="text-cyan-300 font-semibold">&ge; 3.0L (Standard)</span>
                <span>6L</span>
              </div>
            </div>

            {/* 4. Screen Time */}
            <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4 text-purple-400" /> [LAB-SCR] Screen Load
                </span>
                <span className="text-xs font-bold text-white bg-slate-800 px-2 py-0.5 rounded">
                  {screenTime} hrs
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                value={screenTime}
                onChange={(e) => setScreenTime(e.target.value)}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0h</span>
                <span className="text-purple-300 font-semibold">&le; 5h (Safe Ceiling)</span>
                <span>16h</span>
              </div>
            </div>

          </div>

          {/* 5. Mood Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Smile className="w-4 h-4 text-teal-400" /> [LAB-PSY] Affective & Psycho-Emotional State
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {moods.map((m) => (
                <button
                  type="button"
                  key={m.label}
                  onClick={() => setMood(m.label)}
                  className={`flex flex-col items-start p-2 rounded-xl border text-xs font-semibold transition-all ${
                    mood === m.label
                      ? `${m.color} ring-2 ring-cyan-400/50 scale-[1.02]`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{m.emoji}</span>
                    <span>{m.label}</span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-sans mt-0.5">{m.clinical}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Diet Quality Selector */}
          <div>
            <label className="block font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Utensils className="w-4 h-4 text-emerald-400" /> [LAB-NUT] Nutritional Pattern
            </label>
            <div className="flex flex-wrap gap-2">
              {dietOptions.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDiet(d)}
                  className={`px-3 py-1 rounded-xl border text-xs font-semibold transition-all ${
                    diet === d
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* 7. Clinical Observations / Notes */}
          <div>
            <label className="block font-bold text-slate-300 mb-1">
              Subjective Clinical Notes & Triggers (Optional)
            </label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Completed 45 min kinetic workout, evening screen exposure was limited, hydration maintained..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-sans"
            ></textarea>
          </div>

          {/* Submit Footer */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Save className="w-4 h-4 stroke-[2.5]" />
              <span>Commit Assay Log</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

