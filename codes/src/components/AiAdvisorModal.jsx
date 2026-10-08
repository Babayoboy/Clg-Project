import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  Bot, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Key, 
  RefreshCw,
  Cpu,
  Globe,
  Stethoscope,
  HeartPulse,
  ClipboardCheck,
  Microscope
} from 'lucide-react';
import { generateLocalAIAnalysis, callGeminiAI } from '../utils/aiService.js';

export const AiAdvisorModal = ({ isOpen, onClose, logs, profile, onUpdateProfile }) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('local'); // 'local' | 'gemini'
  const [apiKey, setApiKey] = useState(profile?.gemini_api_key || '');
  const [loading, setLoading] = useState(false);
  const [externalAnalysis, setExternalAnalysis] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const localReport = generateLocalAIAnalysis(logs, profile);

  const handleRunGemini = async () => {
    if (!apiKey.trim()) {
      setErrorMsg('Please enter a Google Gemini API Key to run cloud AI synthesis.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      // Save API key to profile
      if (profile && onUpdateProfile) {
        onUpdateProfile({ ...profile, gemini_api_key: apiKey.trim() });
      }

      const result = await callGeminiAI(logs, profile, apiKey.trim());
      setExternalAnalysis(result);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate external AI insights.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-mono">
      <div className="relative w-full max-w-3xl bg-[#0b101c] border border-purple-800/70 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-cyan-500 p-[2px] shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#080c14] rounded-[14px] flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-purple-400" />
              </div>
            </div>
            <div>
              <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider block">
                CLINICAL DECISION SUPPORT SYSTEM (CDSS)
              </span>
              <h2 className="text-base font-bold font-display text-white mt-0.5">
                AI Diagnostic Consultant & Differential Analysis
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Evidence-based circadian synthesis & personalized lifestyle intervention protocol
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Engine Tabs */}
        <div className="flex items-center gap-2 my-4 bg-slate-950 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('local')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'local'
                ? 'bg-cyan-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>On-Device Clinical Engine (Default)</span>
          </button>

          <button
            onClick={() => setActiveTab('gemini')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'gemini'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-purple-300" />
            <span>Gemini AI Synthesis (Opt-In)</span>
          </button>
        </div>

        {/* TAB 1: ON-DEVICE LOCAL CLINICAL ENGINE */}
        {activeTab === 'local' && (
          <div className="space-y-4">
            {/* Privacy Shield */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-emerald-300 text-xs font-sans">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>
                <strong>Zero Data Egress:</strong> Biometric differentials are evaluated 100% in-browser on your local machine.
              </span>
            </div>

            {/* Diagnostic Impression Summary */}
            <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <HeartPulse className="w-3.5 h-3.5" /> Clinical Differential Impression
                </span>
                <span className="text-[10px] text-slate-500 font-mono">TIMESTAMP: {localReport.timestamp}</span>
              </div>
              <p className="text-xs text-slate-200 font-sans leading-relaxed">
                {localReport.summary}
              </p>
            </div>

            {/* Critical Anomalies & Pathologies */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Identified Biomarker Variances
              </h4>
              <div className="space-y-2">
                {localReport.alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0 font-mono"></span>
                    <span>{alert}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Clinical Protocol (Rx) */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Clinical Action Protocol (Rx)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {localReport.actionPlan.map((plan, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-bold text-white mb-1 font-mono">{plan.title}</h5>
                      <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{plan.detail}</p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[9px] text-cyan-300 font-bold font-mono uppercase">
                      Target: {plan.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OPTIONAL GEMINI AI INTEGRATION */}
        {activeTab === 'gemini' && (
          <div className="space-y-4">
            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-3 py-2 rounded-xl bg-purple-950/40 border border-purple-800/50 text-purple-300 text-xs font-sans">
              <Bot className="w-4 h-4 shrink-0 text-purple-400 mt-0.5" />
              <div>
                <strong>External Clinical AI (Opt-In):</strong> 7-day anonymized biometric telemetry will be synthesized by Google Gemini AI.
              </div>
            </div>

            {/* API Key Input */}
            <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2.5">
              <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1.5 font-mono">
                <Key className="w-3.5 h-3.5 text-purple-400" /> Google Gemini API Key
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="password"
                  placeholder="Paste your Gemini API key (AIzaSy...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  onClick={handleRunGemini}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Generate AI Synthesis</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 font-sans">
                Keys can be generated free at <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-purple-400 underline">Google AI Studio</a>.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs font-mono">
                {errorMsg}
              </div>
            )}

            {/* External AI Results */}
            {externalAnalysis && (
              <div className="space-y-3 animate-in fade-in duration-300 font-sans">
                <div className="bg-purple-950/20 border border-purple-800/40 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2 font-mono">
                    <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Gemini Clinical Synthesis
                    </span>
                    <span className="text-[10px] bg-purple-900/60 text-purple-200 px-2 py-0.5 rounded font-bold">
                      Burnout Risk: {externalAnalysis.riskLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed mb-2 font-sans">
                    {externalAnalysis.summary}
                  </p>
                  {externalAnalysis.encouragement && (
                    <p className="text-xs italic text-purple-300 font-sans">
                      &ldquo;{externalAnalysis.encouragement}&rdquo;
                    </p>
                  )}
                </div>

                {/* AI Action Plan */}
                {externalAnalysis.actionPlan && externalAnalysis.actionPlan.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono">
                    {externalAnalysis.actionPlan.map((item, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                        <h5 className="text-xs font-bold text-white mb-1">{item.title}</h5>
                        <p className="text-[11px] text-slate-400 font-sans mb-1.5">{item.detail}</p>
                        <span className="text-[9px] font-bold text-purple-400">{item.impact}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors font-mono"
          >
            Close Consultation
          </button>
        </div>

      </div>
    </div>
  );
};

