import React from 'react';
import { 
  Activity, 
  PlusCircle, 
  Sparkles, 
  FileText, 
  BookOpen, 
  Settings, 
  ShieldCheck, 
  Calendar,
  Database,
  HeartPulse,
  ClipboardCheck,
  Stethoscope,
  Microscope
} from 'lucide-react';

export const Header = ({ 
  profile, 
  selectedDate, 
  setSelectedDate, 
  onOpenLogModal, 
  onOpenAiModal, 
  onOpenReportModal, 
  onOpenEduModal, 
  onOpenSettingsModal,
  onLoadSampleData,
  onResetData
}) => {
  const formattedToday = new Date().toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 clinical-panel border-b border-[#373f51] bg-[#1b1b1e]/95 backdrop-blur-xl px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Hospital & Clinical Lab Branding */}
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
                  HNAZER <span className="text-[#a9bcd0] font-normal text-xs">CLINICAL</span>
                </h1>
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[#58a4b0]/15 border border-[#58a4b0]/40 text-[#58a4b0] px-1.5 py-0.5 rounded">
                  LAB-DX v1.0
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.5 rounded">
                  ● TELEMETRY LIVE
                </span>
              </div>
              <p className="text-[11px] font-mono text-[#a9bcd0] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Patient Health Dossier & Biometrics Engine</span>
              </p>
            </div>
          </div>

          {/* Mobile quick action pill */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={onOpenLogModal}
              className="p-2 rounded-lg bg-[#58a4b0] text-[#1b1b1e] hover:bg-[#68b1bc] font-semibold text-xs flex items-center gap-1 shadow-md shadow-[#58a4b0]/20"
              title="Log Biometric Assay"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Center: Clinical Specimen / Record Date Controller */}
        <div className="flex items-center gap-2 bg-[#222834] border border-[#373f51] rounded-xl px-3 py-1.5 shadow-inner">
          <Calendar className="w-4 h-4 text-[#58a4b0] shrink-0" />
          <span className="text-[11px] font-mono text-[#a9bcd0] uppercase tracking-wider hidden sm:inline">Dossier Date:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-mono font-bold text-[#58a4b0] focus:outline-none cursor-pointer"
          />
          {selectedDate !== new Date().toISOString().split('T')[0] && (
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="text-[10px] font-mono bg-[#58a4b0]/20 text-[#58a4b0] border border-[#58a4b0]/50 hover:bg-[#58a4b0]/30 px-1.5 py-0.5 rounded transition-colors"
              title="Jump to Current Telemetry"
            >
              Today
            </button>
          )}
        </div>

        {/* Right Navigation & Clinical CTAs */}
        <div className="flex items-center flex-wrap justify-center gap-2 w-full md:w-auto">
          
          {/* Quick Log Biomarkers */}
          <button
            onClick={onOpenLogModal}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#58a4b0] hover:bg-[#68b1bc] text-[#1b1b1e] font-bold text-xs shadow-md shadow-[#58a4b0]/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle className="w-4 h-4 text-[#1b1b1e] stroke-[2.5]" />
            <span>Log Biometric Assay</span>
          </button>

          {/* Clinical Diagnostic AI */}
          <button
            onClick={onOpenAiModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#373f51]/70 hover:bg-[#373f51] border border-[#4b5873] text-[#d8dbe2] font-medium text-xs transition-all hover:border-[#58a4b0]/50 shadow-sm"
            title="Clinical Diagnostic AI Consultant"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#58a4b0] animate-pulse" />
            <span>AI Consultant</span>
          </button>

          {/* Medical Clinical Guidelines */}
          <button
            onClick={onOpenEduModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#222834] hover:bg-[#373f51] border border-[#373f51] text-[#a9bcd0] hover:text-[#d8dbe2] font-medium text-xs transition-all"
            title="Evidence-Based Medical Guidelines"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#a9bcd0]" />
            <span className="hidden lg:inline">Protocols</span>
          </button>

          {/* Official Printable Pathology / Health Report */}
          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25393d]/80 hover:bg-[#25393d] border border-[#58a4b0]/50 text-[#58a4b0] font-semibold text-xs transition-all hover:border-[#58a4b0] shadow-sm"
            title="Generate Official Clinical Medical Report (PDF)"
          >
            <FileText className="w-3.5 h-3.5 text-[#58a4b0]" />
            <span>Medical Report</span>
          </button>

          {/* Clinical Demo Dataset */}
          <button
            onClick={onLoadSampleData}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#222834] hover:bg-[#373f51] border border-[#373f51] hover:border-[#58a4b0]/50 text-[#a9bcd0] hover:text-[#58a4b0] font-medium text-xs transition-all font-mono"
            title="Preload 14-Day Clinical Cohort Demo Data"
          >
            <Database className="w-3.5 h-3.5 text-[#58a4b0]" />
            <span className="hidden xl:inline">Demo Cohort</span>
          </button>

          {/* Patient Profile & Targets */}
          <button
            onClick={onOpenSettingsModal}
            className="p-2 rounded-xl bg-[#222834] hover:bg-[#373f51] border border-[#373f51] text-[#a9bcd0] hover:text-white transition-all"
            title="Patient Profile & Diagnostic Targets"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

