import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  User, 
  Target, 
  Key, 
  ShieldCheck, 
  Trash2, 
  Save,
  Moon,
  Droplet,
  Flame,
  Monitor,
  Activity,
  Cpu,
  FileSpreadsheet
} from 'lucide-react';

export const SettingsModal = ({ 
  isOpen, 
  onClose, 
  profile, 
  onSaveProfile, 
  onResetAllData 
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState(profile?.name || 'Ansh Joshi');
  const [userId, setUserId] = useState(profile?.user_id || 101);
  const [targetSleep, setTargetSleep] = useState(profile?.target_sleep || 8.0);
  const [targetWater, setTargetWater] = useState(profile?.target_water || 3.0);
  const [targetExercise, setTargetExercise] = useState(profile?.target_exercise || 0.75);
  const [maxScreen, setMaxScreen] = useState(profile?.max_screen_time || 5.0);
  const [apiKey, setApiKey] = useState(profile?.gemini_api_key || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      name: name.trim(),
      user_id: parseInt(userId) || 101,
      target_sleep: parseFloat(targetSleep),
      target_water: parseFloat(targetWater),
      target_exercise: parseFloat(targetExercise),
      max_screen_time: parseFloat(maxScreen),
      gemini_api_key: apiKey.trim()
    };
    onSaveProfile(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto font-mono">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl my-8 medical-corners text-slate-200">
        
        {/* Header Strip */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                  SYSTEM CONFIG
                </span>
                <span className="text-[11px] text-slate-500">REF: CFG-SYS-99</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                Patient Demographics & Clinical Baselines
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-5 text-xs">
          
          {/* Section 1: Patient Demographic Identity */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h3 className="font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5 text-xs">
                <User className="w-3.5 h-3.5" /> [CFG-DEMO-01] Patient Master Identity
              </h3>
              <span className="text-[10px] text-slate-500">IGNOU DATA DICTIONARY</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Patient Subject Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 uppercase tracking-wider">
                  Medical Record ID (MRN)
                </label>
                <input
                  type="number"
                  required
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-teal-300 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Clinical Target Thresholds */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2">
              <h3 className="font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 text-xs">
                <Target className="w-3.5 h-3.5" /> [REF-RNG-02] Diagnostic Reference Thresholds
              </h3>
              <span className="text-[10px] text-slate-500">HOMEOSTASIS TARGETS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-indigo-300 flex items-center gap-1">
                    <Moon className="w-3.5 h-3.5" /> Target Sleep (Hrs)
                  </label>
                  <span className="text-[9px] text-slate-500 font-mono">REF: 7.0 - 9.0</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="12"
                  value={targetSleep}
                  onChange={(e) => setTargetSleep(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-indigo-200 font-mono"
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-cyan-300 flex items-center gap-1">
                    <Droplet className="w-3.5 h-3.5" /> Target Infusion (L)
                  </label>
                  <span className="text-[9px] text-slate-500 font-mono">REF: 2.5 - 4.0</span>
                </div>
                <input
                  type="number"
                  step="0.25"
                  min="1"
                  max="8"
                  value={targetWater}
                  onChange={(e) => setTargetWater(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-cyan-200 font-mono"
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Kinetic Goal (Hrs)
                  </label>
                  <span className="text-[9px] text-slate-500 font-mono">REF: ≥ 0.50</span>
                </div>
                <input
                  type="number"
                  step="0.25"
                  min="0.25"
                  max="4"
                  value={targetExercise}
                  onChange={(e) => setTargetExercise(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-amber-200 font-mono"
                />
              </div>

              <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold text-purple-300 flex items-center gap-1">
                    <Monitor className="w-3.5 h-3.5" /> Screen Ceil (Hrs)
                  </label>
                  <span className="text-[9px] text-slate-500 font-mono">REF: ≤ 6.0</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  min="2"
                  max="14"
                  value={maxScreen}
                  onChange={(e) => setMaxScreen(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-purple-200 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Gemini Neural Diagnostic Engine API Key */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 text-xs">
                <Cpu className="w-3.5 h-3.5" /> [AI-NEUR-03] Neural Diagnostic Engine Gateway
              </h3>
              <span className="text-[10px] text-slate-500">OPTIONAL</span>
            </div>
            <input
              type="password"
              placeholder="Enter Google Gemini API Key for Automated Clinical Synthesis"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 font-mono"
            />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Standard deterministic clinical lab assays operate 100% offline without key. Adding a key activates generative clinical pathology impressions and pharmacological lifestyle counseling.
            </p>
          </div>

          {/* Section 4: Privacy & Local Ledger Management */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-[11px] font-semibold text-slate-300">Air-Gapped Client Storage</p>
                <p className="text-[9px] text-slate-500">All pathology assays are kept locally in encrypted IndexedDB / LocalStorage</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('CLINICAL PURGE WARNING: Are you sure you want to sanitize and purge all specimen logs and patient dossiers?')) {
                  onResetAllData();
                  onClose();
                }
              }}
              className="text-[11px] text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/60 bg-rose-500/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Purge Dossier Ledger</span>
            </button>
          </div>

          {/* Save Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-lg shadow-teal-500/20 transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              <span>Commit Protocol</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

