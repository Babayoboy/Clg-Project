import React, { useState } from 'react';
import { 
  History, 
  Download, 
  Upload, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  FileSpreadsheet, 
  FileJson,
  Plus,
  ClipboardList,
  FlaskConical,
  FileCheck
} from 'lucide-react';
import { calculateMetricScores, getVitalityStatus } from '../utils/scoring.js';
import { exportDataAsCSV, exportDataAsJSON } from '../utils/storage.js';

export const HistoryManager = ({ 
  logs, 
  profile, 
  onEditLog, 
  onDeleteLog, 
  onImportLogs, 
  onOpenLogModal 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [moodFilter, setMoodFilter] = useState('All');

  const filteredLogs = (logs || [])
    .filter(l => {
      const matchesSearch = l.date.includes(searchTerm) || (l.notes || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMood = moodFilter === 'All' || l.mood === moodFilter;
      return matchesSearch && matchesMood;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Handle JSON Import
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.logs && Array.isArray(parsed.logs)) {
          onImportLogs(parsed.logs);
          alert(`Successfully imported ${parsed.logs.length} clinical records!`);
        } else if (Array.isArray(parsed)) {
          onImportLogs(parsed);
          alert(`Successfully imported ${parsed.length} clinical records!`);
        } else {
          alert('Invalid JSON clinical backup structure.');
        }
      } catch (err) {
        alert('Error parsing clinical file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="clinical-panel medical-corners rounded-2xl p-5 border-slate-700/80 shadow-xl mb-6 font-mono">
      
      {/* Header & Export Actions */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">
            SPECIMEN REGISTRY #REG-DB
          </span>
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5 mt-0.5">
            <ClipboardList className="w-4 h-4 text-cyan-400" />
            Clinical Specimen Registry & Case Logbook
          </h2>
          <p className="text-[10px] text-slate-400 font-sans">
            Longitudinal biometric database conforming to Hnazer IGNOU schema
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 w-full lg:w-auto">
          {/* Export CSV */}
          <button
            onClick={() => exportDataAsCSV(logs)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
            title="Download CSV for Laboratory Analysis"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={() => exportDataAsJSON(logs, profile)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
            title="Download Encrypted JSON Dossier"
          >
            <FileJson className="w-3.5 h-3.5 text-amber-400" />
            <span>Backup JSON</span>
          </button>

          {/* Import JSON */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white cursor-pointer transition-all shadow-sm">
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>Restore JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          {/* Add Entry */}
          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ New Assay</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specimen date or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Mood Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <select
            value={moodFilter}
            onChange={(e) => setMoodFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="All">All Affect States</option>
            <option value="Energized">⚡ Energized (Hyper)</option>
            <option value="Good">😊 Good (Euthymic)</option>
            <option value="Neutral">😐 Neutral (Stable)</option>
            <option value="Tired">🥱 Tired (Somnolent)</option>
            <option value="Stressed">😫 Stressed (Cortisol)</option>
            <option value="Burnout Alert">🤯 Burnout Alert (Critical)</option>
          </select>
        </div>
      </div>

      {/* Clinical Registry Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-950/70">
        <table className="w-full text-left text-xs border-collapse font-mono">
          <thead>
            <tr className="bg-slate-900 text-slate-300 border-b border-slate-700 font-bold">
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-2.5">[SLP] Sleep</th>
              <th className="py-2.5 px-2.5">[ACT] Exer</th>
              <th className="py-2.5 px-2.5">[H2O] Water</th>
              <th className="py-2.5 px-2.5">[SCR] Screen</th>
              <th className="py-2.5 px-2.5">[PSY] Affect</th>
              <th className="py-2.5 px-2.5">[NUT] Diet</th>
              <th className="py-2.5 px-2.5">Vitality Score</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-8 text-center text-slate-500">
                  No specimen records match query criteria.
                </td>
              </tr>
            ) : (
              filteredLogs.map((log) => {
                const scores = calculateMetricScores(log, profile);
                const status = getVitalityStatus(scores.compositeScore);
                const sleepVal = parseFloat(log.sleep_hour) || 0;
                const waterVal = parseFloat(log.water_intake) || 0;
                const screenVal = parseFloat(log.screen_time) || 0;

                return (
                  <tr 
                    key={log.id || log.date}
                    className="hover:bg-slate-900/70 transition-colors group"
                  >
                    <td className="py-2.5 px-3 font-bold text-slate-200">
                      {log.date}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={sleepVal >= 7 ? 'text-indigo-300' : 'text-rose-400 font-bold'}>
                        {sleepVal.toFixed(1)}h {sleepVal < 6 ? '[L]' : sleepVal > 9 ? '[H]' : '[N]'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-amber-300">
                      {Math.round((parseFloat(log.exercise_time) || 0) * 60)}m
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={waterVal >= 2.5 ? 'text-cyan-300' : 'text-amber-400 font-bold'}>
                        {waterVal.toFixed(1)}L {waterVal < 2 ? '[L]' : '[N]'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={screenVal <= 5 ? 'text-purple-300' : 'text-rose-400 font-bold'}>
                        {screenVal.toFixed(1)}h {screenVal > 7 ? '[H]' : '[N]'}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className="text-[11px] text-slate-300 truncate max-w-[100px] inline-block font-sans">
                        {log.mood}
                      </span>
                    </td>
                    <td className="py-2.5 px-2.5 text-slate-400 font-sans text-[11px]">
                      {log.diet || 'Standard'}
                    </td>
                    <td className="py-2.5 px-2.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${status.bg} ${status.color} ${status.border}`}>
                        {scores.compositeScore} Pts
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => onEditLog(log)}
                          className="p-1 rounded bg-slate-900 hover:bg-cyan-950 text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Edit Specimen Record"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete specimen record for ${log.date}?`)) {
                              onDeleteLog(log.id || log.date);
                            }
                          }}
                          className="p-1 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Purge Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400">
        <span>Displaying <strong>{filteredLogs.length}</strong> of <strong>{logs.length}</strong> verified clinical specimens</span>
        <span className="text-slate-500">Flags: [N] Normal • [L] Low Deficit • [H] High Elevation</span>
      </div>

    </div>
  );
};

