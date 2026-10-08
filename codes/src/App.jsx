import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  Heart, 
  Layers, 
  FileText,
  Calendar,
  CheckCircle2,
  Database,
  HeartPulse,
  Stethoscope,
  Microscope,
  FileCheck,
  AlertOctagon,
  Printer,
  QrCode,
  Thermometer
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { Header } from './components/Header.jsx';
import { VitalityOverview } from './components/VitalityOverview.jsx';
import { MetricCards } from './components/MetricCards.jsx';
import { AnalyticsCharts } from './components/AnalyticsCharts.jsx';
import { BurnoutRadar } from './components/BurnoutRadar.jsx';
import { HabitHeatmap } from './components/HabitHeatmap.jsx';
import { QuickWaterLogger } from './components/QuickWaterLogger.jsx';
import { DailyLogModal } from './components/DailyLogModal.jsx';
import { HistoryManager } from './components/HistoryManager.jsx';
import { AiAdvisorModal } from './components/AiAdvisorModal.jsx';
import { EducationalHub } from './components/EducationalHub.jsx';
import { ReportModal } from './components/ReportModal.jsx';
import { SettingsModal } from './components/SettingsModal.jsx';

import { 
  loadLogsFromStorage, 
  saveLogsToStorage, 
  loadProfileFromStorage, 
  saveProfileToStorage 
} from './utils/storage.js';
import { calculateMetricScores, generateDiagnosticReport } from './utils/scoring.js';
import { getSampleData } from './utils/sampleData.js';

export function App() {
  const [logs, setLogs] = useState(() => loadLogsFromStorage());
  const [profile, setProfile] = useState(() => loadProfileFromStorage());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    saveLogsToStorage(logs);
  }, [logs]);

  useEffect(() => {
    saveProfileToStorage(profile);
  }, [profile]);

  // Current selected log
  const currentLog = logs.find(l => l.date === selectedDate) || {
    id: 'temp_' + selectedDate,
    user_id: profile.user_id,
    name: profile.name,
    date: selectedDate,
    sleep_hour: 7.0,
    exercise_time: 0.5,
    water_intake: 2.0,
    screen_time: 5.0,
    mood: 'Good',
    diet: 'Balanced',
    notes: 'No entries saved for this date yet.',
    wellness_score: 75
  };

  const diagnostics = generateDiagnosticReport(logs, profile);
  const currentScores = calculateMetricScores(currentLog, profile);

  // Save or Update Log
  const handleSaveLog = (newLog) => {
    setLogs(prevLogs => {
      const filtered = prevLogs.filter(l => l.date !== newLog.date && l.id !== newLog.id);
      return [newLog, ...filtered];
    });
  };

  // Quick Add Water
  const handleQuickAddWater = (amount) => {
    setLogs(prevLogs => {
      const existingIndex = prevLogs.findIndex(l => l.date === selectedDate);
      if (existingIndex >= 0) {
        const updated = [...prevLogs];
        const oldLog = updated[existingIndex];
        const newWater = +(Math.max(0, (parseFloat(oldLog.water_intake) || 0) + amount)).toFixed(2);
        const updatedLog = { ...oldLog, water_intake: newWater };
        const calculated = calculateMetricScores(updatedLog, profile);
        updatedLog.wellness_score = calculated.compositeScore;
        updated[existingIndex] = updatedLog;
        return updated;
      } else {
        const newLog = {
          id: 'log_' + selectedDate,
          user_id: profile.user_id,
          name: profile.name,
          date: selectedDate,
          sleep_hour: 7.0,
          exercise_time: 0.5,
          water_intake: Math.max(0, amount),
          screen_time: 5.0,
          mood: 'Good',
          diet: 'Balanced',
          notes: 'Quick hydration logged.',
          wellness_score: 75
        };
        return [newLog, ...prevLogs];
      }
    });
  };

  // Delete Log
  const handleDeleteLog = (idOrDate) => {
    setLogs(prev => prev.filter(l => l.id !== idOrDate && l.date !== idOrDate));
  };

  // Import Logs
  const handleImportLogs = (imported) => {
    setLogs(imported);
  };

  // Load Sample Demo Data
  const handleLoadSampleData = () => {
    const sample = getSampleData();
    setLogs(sample);
    setSelectedDate(new Date().toISOString().split('T')[0]);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.4 }
      });
    } catch (e) {}
  };

  // Reset All Data
  const handleResetAllData = () => {
    setLogs([]);
  };

  return (
    <div className="min-h-screen bg-[#1b1b1e] text-[#d8dbe2] flex flex-col justify-between selection:bg-[#58a4b0]/30 selection:text-[#d8dbe2]">
      
      {/* 1. CLINICAL HEADER & NAVIGATION */}
      <Header
        profile={profile}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        onOpenLogModal={() => {
          setEditingLog(logs.find(l => l.date === selectedDate) || null);
          setIsLogModalOpen(true);
        }}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenEduModal={() => setIsEduModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onLoadSampleData={handleLoadSampleData}
        onResetData={handleResetAllData}
      />

      {/* 2. MAIN CLINICAL DOSSIER CONTENT */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex-1 w-full space-y-6">
        
        {/* PATIENT DOSSIER & CLINICAL INTAKE BANNER */}
        <div className="clinical-panel medical-corners rounded-2xl p-5 border-[#373f51] bg-gradient-to-r from-[#222834]/95 via-[#2b3342]/95 to-[#222834]/95 shadow-xl">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            
            {/* Left: Patient Metadata */}
            <div className="space-y-1">
              <div className="flex items-center flex-wrap gap-2">
                <span className="px-2 py-0.5 rounded bg-[#58a4b0]/15 border border-[#58a4b0]/40 text-[#58a4b0] font-mono text-[11px] font-bold tracking-wide">
                  PATIENT CASE DOSSIER
                </span>
                <span className="text-xs font-mono text-[#a9bcd0]">
                  MRN: <strong className="text-[#d8dbe2]">#HNZ-2026-{profile.user_id || 101}</strong>
                </span>
                <span className="text-[#373f51]">•</span>
                <span className="text-xs font-mono text-[#a9bcd0]">
                  SPECIMEN DATE: <strong className="text-[#58a4b0] font-bold">{selectedDate}</strong>
                </span>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <h1 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2">
                  <span>Patient:</span>
                  <span className="text-[#58a4b0] underline decoration-[#58a4b0]/40 underline-offset-4">{profile.name}</span>
                </h1>
                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-[#373f51]/70 text-[#d8dbe2] border border-[#373f51]">
                  Adult Biometrics (22Y / M)
                </span>
              </div>

              <p className="text-xs font-mono text-[#a9bcd0] flex items-center gap-2 pt-0.5">
                <span>Attending Engine: <strong>Rule-Based Private Bio-Telemetry Engine v1.0</strong></span>
                <span className="text-[#373f51]">•</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% On-Device HIPAA/GDPR Compliant
                </span>
              </p>
            </div>

            {/* Right: Barcode & Triage Priority Flag */}
            <div className="flex items-center gap-4 self-stretch lg:self-auto justify-between lg:justify-end border-t lg:border-t-0 pt-3 lg:pt-0 border-[#373f51]/70">
              
              {/* Triage Status */}
              <div className="text-right">
                <div className="text-[10px] font-mono uppercase tracking-widest text-[#a9bcd0]">
                  Clinical Triaging Status
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono font-bold mt-1 border ${
                  diagnostics.riskLevel === 'Critical' ? 'bg-rose-950/70 border-rose-600 text-rose-300 shadow-glow-rose' :
                  diagnostics.riskLevel === 'Moderate' ? 'bg-amber-950/70 border-amber-600 text-amber-300 shadow-glow-amber' :
                  'bg-emerald-950/70 border-emerald-600 text-emerald-300 shadow-glow-emerald'
                }`}>
                  <AlertOctagon className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {diagnostics.riskLevel === 'Critical' ? 'TRIAGE: ELEVATED FATIGUE RISK' :
                     diagnostics.riskLevel === 'Moderate' ? 'TRIAGE: GUARDED ROUTINE' :
                     'TRIAGE: NORMAL (HOMEOSTATIC)'}
                  </span>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="hidden sm:flex flex-col items-center bg-[#1b1b1e] px-3 py-1.5 rounded-xl border border-[#373f51]">
                <div className="w-24 h-6 barcode-strip-light opacity-90"></div>
                <span className="text-[9px] font-mono text-[#a9bcd0] tracking-widest mt-0.5">
                  HNZ-{profile.user_id || 101}-LCL
                </span>
              </div>

              {/* Print CTA */}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#373f51] hover:bg-[#475269] text-[#58a4b0] hover:text-[#d8dbe2] border border-[#4b5873] text-xs font-mono font-semibold transition-all hover:scale-105"
                title="Print Official Medical Diagnostic Report"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden md:inline">Print Report</span>
              </button>

            </div>

          </div>

          {/* LIVE ECG & BIOMETRIC TELEMETRY STRIP */}
          <div className="mt-4 pt-3 border-t border-[#373f51]/70 flex flex-col md:flex-row items-center justify-between gap-3 text-xs font-mono">
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800/40">
                <HeartPulse className="w-4 h-4 animate-pulse" />
                <span className="text-[11px] font-bold">ECG MONITOR ACTIVE</span>
              </div>

              {/* Animated ECG Pulse Waveform SVG */}
              <div className="flex-1 md:w-48 h-6 overflow-hidden relative opacity-85">
                <svg viewBox="0 0 200 30" className="w-full h-full stroke-[#58a4b0] fill-none stroke-2">
                  <path d="M0,15 L30,15 L35,5 L40,25 L45,10 L50,18 L55,15 L90,15 L95,5 L100,25 L105,10 L110,18 L115,15 L150,15 L155,5 L160,25 L165,10 L170,18 L175,15 L200,15" className="animate-pulse" />
                </svg>
              </div>
            </div>

            {/* Quick Diagnostic Telemetry Readouts */}
            <div className="flex items-center flex-wrap gap-4 text-[11px] text-[#a9bcd0]">
              <span>Resting BPM Eq: <strong className="text-[#d8dbe2]">72 bpm</strong></span>
              <span>•</span>
              <span>Circadian Rest: <strong className="text-[#a9bcd0] font-semibold">{currentLog.sleep_hour} hrs</strong></span>
              <span>•</span>
              <span>Fluid Volume: <strong className="text-[#58a4b0] font-semibold">{currentLog.water_intake} L</strong></span>
              <span>•</span>
              <span>Composite Diagnostic Index: <strong className="text-emerald-400">{currentScores.compositeScore} / 100</strong></span>
            </div>

          </div>

        </div>

        {/* SECTION 1: VITALITY SCORE RING, BURNOUT GAUGE & STREAKS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 01
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              Diagnostic Vitality Index & Burnout Triaging Assessment
            </h2>
          </div>

          <VitalityOverview
            currentLog={currentLog}
            allLogs={logs}
            profile={profile}
            onOpenLogModal={() => {
              setEditingLog(logs.find(l => l.date === selectedDate) || null);
              setIsLogModalOpen(true);
            }}
            onOpenAiModal={() => setIsAiModalOpen(true)}
          />
        </section>

        {/* SECTION 2: 6 CORE CLINICAL LABORATORY ASSAY METRIC CARDS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 02
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              Clinical Biometric Assays & Data Dictionary Parameters
            </h2>
          </div>

          <MetricCards
            currentLog={currentLog}
            profile={profile}
            onQuickAddWater={handleQuickAddWater}
            onOpenLogModal={() => {
              setEditingLog(logs.find(l => l.date === selectedDate) || null);
              setIsLogModalOpen(true);
            }}
          />
        </section>

        {/* SECTION 3: VISUAL INTELLIGENCE & MULTI-METRIC TREND CHARTS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 03
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              Longitudinal Multi-Channel Telemetry & Mood Spectrum
            </h2>
          </div>

          <AnalyticsCharts
            logs={logs}
            profile={profile}
          />
        </section>

        {/* SECTION 4: RADAR EQUILIBRIUM & INTERACTIVE WATER GLASS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 04
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              6-Axis Homeostasis Reticle & Metabolic Fluid Infusion
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-2">
            <div className="lg:col-span-7">
              <BurnoutRadar
                currentLog={currentLog}
                profile={profile}
              />
            </div>
            <div className="lg:col-span-5">
              <QuickWaterLogger
                currentWater={currentLog?.water_intake || 0}
                targetWater={profile?.target_water || 3.0}
                onUpdateWater={(newVal) => {
                  const diff = newVal - (parseFloat(currentLog?.water_intake) || 0);
                  handleQuickAddWater(diff);
                }}
              />
            </div>
          </div>
        </section>

        {/* SECTION 5: 35-DAY HABIT CONSISTENCY HEATMAP */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 05
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              35-Day Patient Longitudinal Compliance Matrix
            </h2>
          </div>

          <HabitHeatmap
            logs={logs}
            profile={profile}
            selectedDate={selectedDate}
            onSelectDate={(d) => setSelectedDate(d)}
          />
        </section>

        {/* SECTION 6: FULL DATABASE LOG MANAGER & EXPORT/IMPORT */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 06
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              Clinical Specimen Registry & Longitudinal Case Logbook
            </h2>
          </div>

          <HistoryManager
            logs={logs}
            profile={profile}
            onEditLog={(log) => {
              setEditingLog(log);
              setSelectedDate(log.date);
              setIsLogModalOpen(true);
            }}
            onDeleteLog={handleDeleteLog}
            onImportLogs={handleImportLogs}
            onOpenLogModal={() => {
              setEditingLog(null);
              setIsLogModalOpen(true);
            }}
          />
        </section>

      </main>

      {/* 3. MODALS CONTAINER */}
      <DailyLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingLog(null);
        }}
        initialData={editingLog}
        selectedDate={selectedDate}
        profile={profile}
        onSaveLog={handleSaveLog}
      />

      <AiAdvisorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        logs={logs}
        profile={profile}
        onUpdateProfile={(updated) => setProfile(updated)}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        logs={logs}
        profile={profile}
      />

      <EducationalHub
        isOpen={isEduModalOpen}
        onClose={() => setIsEduModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        profile={profile}
        onSaveProfile={(updated) => setProfile(updated)}
        onResetAllData={handleResetAllData}
      />

      {/* FLOATING ACTION BUTTON (Mobile quick log) */}
      <button
        onClick={() => {
          setEditingLog(logs.find(l => l.date === selectedDate) || null);
          setIsLogModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-[#58a4b0] to-[#7bbec9] text-[#1b1b1e] font-bold shadow-2xl shadow-[#58a4b0]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center sm:hidden"
        title="Log Biometric Assay"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>

      {/* 4. CLINICAL FOOTER */}
      <footer className="clinical-panel border-t border-[#373f51] py-6 px-4 lg:px-8 mt-12 bg-[#161619]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#a9bcd0]">
          
          <div className="flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-[#58a4b0]" />
            <span>
              <strong className="text-[#d8dbe2]">HNAZER CLINICAL BIOMETRICS & DIAGNOSTIC LAB</strong> • Open-Source Term-End Project
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-4 text-[11px]">
            <span>Candidate: <strong>{profile.name || 'Ansh Joshi'}</strong> (ID: {profile.user_id || 101})</span>
            <span>•</span>
            <span>Evaluation: <strong>IGNOU Term-End Project (2026)</strong></span>
            <span>•</span>
            <span className="text-[#58a4b0]">MIT Open Source License</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
export default App;

