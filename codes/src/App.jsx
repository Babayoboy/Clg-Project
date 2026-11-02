import React, { useEffect, useState } from 'react';
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
  HeartPulse,
  Stethoscope,
  Microscope,
  FileCheck,
  AlertOctagon,
  Printer,
  QrCode,
  Thermometer,
  AlertTriangle
} from 'lucide-react';

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
import { AccountGate } from './components/AccountGate.jsx';
import { AdminConsoleModal } from './components/AdminConsoleModal.jsx';

import { getAccountSession, saveAccountData, signOutAccount } from './utils/localAccount.js';
import { calculateMetricScores, generateDiagnosticReport } from './utils/scoring.js';

export function App() {
  const [account, setAccount] = useState(null);
  const [accountStatus, setAccountStatus] = useState('checking');
  const [accountError, setAccountError] = useState('');
  const [logs, setLogs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAdminConsoleOpen, setIsAdminConsoleOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getAccountSession()
      .then((session) => {
        if (!active) return;
        if (session) {
          setAccount(session.account);
          setProfile(session.profile);
          setLogs(session.logs);
        }
        setAccountStatus('ready');
      })
      .catch((error) => {
        if (!active) return;
        setAccountError(error.message);
        setAccountStatus('ready');
      });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (account && profile && account.role !== 'admin') saveAccountData(profile, logs);
  }, [account, profile, logs]);

  const handleAuthenticated = (session) => {
    setAccount(session.account);
    setProfile(session.profile);
    setLogs(session.logs);
    setAccountError('');
    setAccountStatus('ready');
  };

  const handleSignOut = async () => {
    await signOutAccount();
    setAccount(null);
    setProfile(null);
    setLogs([]);
  };

  const handleToggleTheme = () => {
    setProfile((current) => ({
      ...current,
      theme: current.theme === 'light' ? 'dark' : 'light'
    }));
  };

  if (accountStatus === 'checking') {
    return <div className="min-h-screen bg-[#1b1b1e] text-[#a9bcd0] grid place-items-center font-mono text-sm">Connecting to local account database...</div>;
  }

  if (!account || !profile) {
    return <AccountGate onAuthenticated={handleAuthenticated} initialError={accountError} />;
  }

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

  // Reset All Data
  const handleResetAllData = () => {
    setLogs([]);
  };

  return (
    <div data-theme={profile.theme === 'light' ? 'light' : 'dark'} className="min-h-screen bg-[#1b1b1e] text-[#d8dbe2] flex flex-col justify-between selection:bg-[#58a4b0]/30 selection:text-[#d8dbe2]">
      
      {/* 1. CLINICAL HEADER & NAVIGATION */}
      <Header
        profile={profile}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        logs={logs}
        onOpenLogModal={() => {
          setEditingLog(logs.find(l => l.date === selectedDate) || null);
          setIsLogModalOpen(true);
        }}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenEduModal={() => setIsEduModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onSignOut={handleSignOut}
        isAdmin={account.role === 'admin'}
        onOpenAdminConsole={() => setIsAdminConsoleOpen(true)}
        onToggleTheme={handleToggleTheme}
      />

      {/* 2. MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-5 flex-1 w-full space-y-6">
        {account.role === 'admin' ? (
          <section className="clinical-panel mx-auto max-w-3xl rounded-xl border border-[#373f51] bg-[#222834]/80 p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase text-amber-300">Administrator account</p>
                <h1 className="mt-1 text-lg font-bold text-white">Account administration</h1>
                <p className="mt-2 text-sm text-slate-400">Review accounts and the health records users have submitted. Administrator accounts do not create or edit daily entries.</p>
                <button onClick={() => setIsAdminConsoleOpen(true)} className="mt-5 inline-flex items-center gap-2 rounded-md bg-amber-400 px-4 py-2 text-xs font-bold text-[#1b1b1e] hover:bg-amber-300">
                  <ShieldCheck className="h-4 w-4" /> Open Admin Console
                </button>
              </div>
            </div>
          </section>
        ) : (
          <>
        
        {/* DAILY SUMMARY BANNER - Compact */}
        <div className="clinical-panel rounded-2xl px-5 py-3.5 border-[#373f51] bg-gradient-to-r from-[#222834]/95 via-[#2b3342]/95 to-[#222834]/95 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">

            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-[#58a4b0]/15 border border-[#58a4b0]/40 text-[#58a4b0] font-mono text-[11px] font-bold tracking-wide">
                DAILY SUMMARY
              </span>
              <h1 className="text-base font-bold font-display text-white">
                User: <span className="text-[#58a4b0]">{profile.name}</span>
              </h1>
              <span className="text-[11px] font-mono text-[#a9bcd0]">
                ID: <strong className="text-[#d8dbe2]">#HNZ-{profile.user_id || 101}</strong>
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> On-Device
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Status badge */}
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold border ${
                diagnostics.riskLevel === 'Critical' ? 'bg-rose-950/70 border-rose-600 text-rose-300' :
                diagnostics.riskLevel === 'Moderate' ? 'bg-amber-950/70 border-amber-600 text-amber-300' :
                'bg-emerald-950/70 border-emerald-600 text-emerald-300'
              }`}>
                <AlertOctagon className="w-3 h-3 shrink-0" />
                <span>
                  {diagnostics.riskLevel === 'Critical' ? 'FATIGUE RISK' :
                   diagnostics.riskLevel === 'Moderate' ? 'ATTENTION' :
                   'ON TRACK'}
                </span>
              </div>

              {/* Habit micro-strip */}
              <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#a9bcd0] bg-[#1b1b1e] border border-[#373f51] px-3 py-1 rounded-lg">
                <HeartPulse className="w-3.5 h-3.5 text-[#58a4b0] animate-pulse" />
                <span>Sleep: <strong className="text-[#d8dbe2]">{currentLog.sleep_hour}h</strong></span>
                <span>•</span>
                <span>Water: <strong className="text-[#58a4b0]">{currentLog.water_intake}L</strong></span>
                <span>•</span>
                <span>Score: <strong className="text-emerald-400">{currentScores.compositeScore}</strong></span>
              </div>

              {/* Print */}
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#373f51] hover:bg-[#475269] text-[#58a4b0] hover:text-[#d8dbe2] border border-[#4b5873] text-xs font-mono font-semibold transition-all hover:scale-105"
                title="Print Personal Health Summary Report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Print Report</span>
              </button>
            </div>

          </div>
        </div>

        {/* CAUTION & INFORMATIONAL DISCLAIMER */}
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span><strong>Caution:</strong> For personal wellness & habit tracking only. Not an official medical, clinical, or diagnostic report.</span>
          </div>
          <span className="hidden sm:inline text-amber-400/80 text-[10px] uppercase font-bold tracking-wider">Informational Only</span>
        </div>

        {/* SECTION 1: VITALITY SCORE RING, BURNOUT GAUGE & STREAKS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 01
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              Vitality Index & Burnout Risk Assessment
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

        {/* SECTION 2: 6 CORE HABIT METRIC CARDS */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">
              PANEL 02
            </span>
            <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">
              Daily Health Metrics & Habit Targets
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
              Daily Habit Trends & Mood Tracker
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
              Habit Balance Radar & Water Tracker
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#58a4b0] bg-[#58a4b0]/10 border border-[#58a4b0]/30 px-2 py-0.5 rounded">PANEL 05</span>
              <h2 className="text-sm font-bold font-mono text-[#d8dbe2] uppercase tracking-wider">35-Day Compliance Heatmap</h2>
            </div>
            <span className="text-[11px] font-mono text-[#a9bcd0]">Longitudinal Log Matrix</span>
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
              Daily Activity Logbook & History
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
          </>
        )}
      </main>

      {/* 3. MODALS CONTAINER */}
      {account.role !== 'admin' && (
        <>
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
        </>
      )}

      <AdminConsoleModal
        isOpen={isAdminConsoleOpen}
        onClose={() => setIsAdminConsoleOpen(false)}
        currentAccount={account}
      />

      {/* FLOATING ACTION BUTTON (Mobile quick log) */}
      {account.role !== 'admin' && (
      <button
        onClick={() => {
          setEditingLog(logs.find(l => l.date === selectedDate) || null);
          setIsLogModalOpen(true);
        }}
        className="fixed bottom-6 right-6 z-40 p-4 rounded-2xl bg-gradient-to-tr from-[#58a4b0] to-[#7bbec9] text-[#1b1b1e] font-bold shadow-2xl shadow-[#58a4b0]/40 hover:scale-110 active:scale-95 transition-all flex items-center justify-center sm:hidden"
        title="Log Daily Habits"
      >
        <Plus className="w-6 h-6 stroke-[3]" />
      </button>
      )}

      {/* 4. FOOTER */}
      <footer className="clinical-panel border-t border-[#373f51] py-6 px-4 lg:px-8 mt-12 bg-[#161619]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-[#a9bcd0]">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-[#58a4b0]" />
              <strong className="text-[#d8dbe2]">HNAZER HEALTH TRACKER</strong>
            </div>
            <span className="hidden sm:inline">•</span>
            <span className="text-[11px] text-slate-400">Personal Lifestyle Analytics • For informational self-tracking only, not medical advice</span>
          </div>

          <div className="flex items-center flex-wrap gap-4 text-[11px]">
            <span>User: <strong>{profile.name || 'User'}</strong> (ID: {profile.user_id || 101})</span>
            <span>•</span>
            <span>Project: <strong>IGNOU Term-End Project (2026)</strong></span>
            <span>•</span>
            <span className="text-[#58a4b0]">MIT Open Source License</span>
          </div>

        </div>
      </footer>

    </div>
  );
}
export default App;

