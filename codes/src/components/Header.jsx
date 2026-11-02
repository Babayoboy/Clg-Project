import React from 'react';
import {
  Activity,
  PlusCircle,
  Sparkles,
  BookOpen,
  Settings,
  ShieldCheck,
  Calendar,
  HeartPulse,
  ClipboardCheck,
  Stethoscope,
  Microscope,
  LogOut,
  ShieldAlert,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Flame
} from 'lucide-react';
import { calculateStreaks } from '../utils/scoring.js';

export const Header = ({
  profile,
  selectedDate,
  setSelectedDate,
  onOpenLogModal,
  onOpenAiModal,
  onOpenEduModal,
  onOpenSettingsModal,
  onSignOut,
  isAdmin,
  onOpenAdminConsole,
  onToggleTheme,
  logs = []
}) => {
  const streaks = calculateStreaks(logs, profile);

  const goToPrevDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() - 1);
    const m = d.getMonth() + 1, x = d.getDate();
    setSelectedDate(`${d.getFullYear()}-${m < 10 ? '0' : ''}${m}-${x < 10 ? '0' : ''}${x}`);
  };

  const goToNextDay = () => {
    const parts = selectedDate.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    d.setDate(d.getDate() + 1);
    const m = d.getMonth() + 1, x = d.getDate();
    setSelectedDate(`${d.getFullYear()}-${m < 10 ? '0' : ''}${m}-${x < 10 ? '0' : ''}${x}`);
  };

  const goToToday = () => {
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === todayStr;

  const parts = selectedDate.split('-');
  const dObj = new Date(parts[0], parts[1] - 1, parts[2]);
  const dateLabel = isToday
    ? 'Today'
    : dObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <header className="sticky top-0 z-30 clinical-panel border-b border-[#373f51] bg-[#1b1b1e]/95 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">

        {/* Brand */}
        <div className="flex items-center justify-between w-full md:w-auto gap-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#58a4b0] via-[#74b3bd] to-[#a9bcd0] p-[2px] shadow-glow-teal">
                <div className="w-full h-full bg-[#1b1b1e] rounded-[10px] flex items-center justify-center">
                  <HeartPulse className="w-5 h-5 text-[#58a4b0] group-hover:scale-110 transition-transform animate-pulse" />
                </div>
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#58a4b0] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#58a4b0]"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold font-display tracking-tight text-white flex items-center gap-1.5">
                  HNAZER <span className="text-[#a9bcd0] font-normal text-xs"></span>
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[#58a4b0]/15 border border-[#58a4b0]/40 text-[#58a4b0] px-1.5 py-0.5 rounded">
                  HEATH TRACKER
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#a9bcd0] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Daily Health &amp; Habit Tracker</span>
              </p>
            </div>
          </div>

          {!isAdmin && (
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onOpenLogModal}
                className="p-2 rounded-lg bg-[#58a4b0] text-[#1b1b1e] hover:bg-[#68b1bc] font-semibold text-xs flex items-center gap-1 shadow-md shadow-[#58a4b0]/20"
                title="Log Daily Habits"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>

        {/* Center: Date Navigator with Prev/Next */}
        {!isAdmin && (
        <div className="flex items-center gap-2 flex-wrap justify-center">
          <div className="flex items-center gap-1.5 bg-[#222834] border border-[#373f51] rounded-xl px-3 py-1.5 shadow-inner">
            <button
              onClick={goToPrevDay}
              className="w-6 h-6 rounded-lg bg-[#373f51] hover:bg-[#475269] border border-[#373f51] hover:border-[#58a4b0]/60 text-[#a9bcd0] hover:text-[#58a4b0] flex items-center justify-center transition-all"
              title="Previous day"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <Calendar className="w-4 h-4 text-[#58a4b0] shrink-0" />
            <span className="text-[11px] font-mono text-[#a9bcd0] uppercase tracking-wider hidden sm:inline">Date:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-xs font-mono font-bold text-[#58a4b0] focus:outline-none cursor-pointer"
            />

            <button
              onClick={goToNextDay}
              className="w-6 h-6 rounded-lg bg-[#373f51] hover:bg-[#475269] border border-[#373f51] hover:border-[#58a4b0]/60 text-[#a9bcd0] hover:text-[#58a4b0] flex items-center justify-center transition-all"
              title="Next day"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {!isToday && (
              <button
                onClick={goToToday}
                className="text-[10px] font-mono bg-[#58a4b0]/20 text-[#58a4b0] border border-[#58a4b0]/50 hover:bg-[#58a4b0]/30 px-1.5 py-0.5 rounded transition-colors"
                title="Jump to Today"
              >
                Today
              </button>
            )}
          </div>

          {/* Date label badge */}
          <span className="hidden md:inline-flex text-[11px] font-mono text-[#a9bcd0] bg-[#222834] border border-[#373f51] px-2.5 py-1 rounded-lg">
            {isToday ? <span className="text-emerald-400 font-bold">Today</span> : dateLabel}
          </span>
        </div>
        )}

        {/* Right: Streak + Actions */}
        <div className="flex items-center flex-wrap justify-center gap-2 w-full md:w-auto">

          {!isAdmin && <>
          {/* Streak Pill */}
          <div
            className="inline-flex items-center gap-1.5 bg-[#222834] border border-[#373f51] px-3 py-1.5 rounded-full text-[12px] font-bold text-[#d8dbe2] shadow-sm"
            title="Consecutive days with logged entries"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>{streaks.activeDays}d streak</span>
          </div>

          {/* Log Habits */}
          <button
            onClick={onOpenLogModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#58a4b0] hover:bg-[#68b1bc] text-[#1b1b1e] font-bold text-xs shadow-md shadow-[#58a4b0]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-[#1b1b1e] stroke-[2.5]" />
            <span>Log Habits</span>
          </button>
          </>}

          {/* AI Advisor */}
          {!isAdmin && <>
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#373f51]/70 hover:bg-[#373f51] border border-[#4b5873] text-[#d8dbe2] font-medium text-xs transition-all hover:border-[#58a4b0]/50 shadow-sm"
            title="AI Wellness Assistant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#58a4b0] animate-pulse" />
            <span>AI</span>
          </button>

          {/* Protocols */}
          <button
            onClick={onOpenEduModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222834] hover:bg-[#373f51] border border-[#373f51] text-[#a9bcd0] hover:text-[#d8dbe2] font-medium text-xs transition-all"
            title="Healthy Habit Guidelines"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#a9bcd0]" />
            <span className="hidden lg:inline">Protocols</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-[#222834] hover:bg-[#373f51] border border-[#373f51] text-[#a9bcd0] hover:text-white transition-all"
            title={`Switch to ${profile.theme === 'light' ? 'dark' : 'light'} theme`}
            aria-label={`Switch to ${profile.theme === 'light' ? 'dark' : 'light'} theme`}
          >
            {profile.theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* Settings */}
          {isAdmin && (
            <button
              onClick={onOpenAdminConsole}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 transition-all"
              title="Open administrator console"
              aria-label="Open administrator console"
            >
              <ShieldAlert className="w-4 h-4" />
            </button>
          )}

          {/* Settings */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl bg-[#222834] hover:bg-[#373f51] border border-[#373f51] text-[#a9bcd0] hover:text-white transition-all"
            title="User Profile & Habit Targets"
          >
            <Settings className="w-4 h-4" />
          </button>
          </>}

          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-[#222834] hover:bg-rose-950/70 border border-[#373f51] hover:border-rose-700 text-[#a9bcd0] hover:text-rose-300 transition-all"
            title="Sign out of local account"
            aria-label="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};
