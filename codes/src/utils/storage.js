/**
 * Hnazer Storage & Data Management Service
 * Manages 100% client-side data persistence with LocalStorage, JSON backup, and CSV exporting.
 */

import { getSampleData, DEFAULT_USER_PROFILE } from './sampleData.js';

const STORAGE_KEYS = {
  LOGS: 'hnazer_lifestyle_logs_v1',
  PROFILE: 'hnazer_user_profile_v1'
};

export const loadLogsFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (!raw) {
      const sample = getSampleData();
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(sample));
      return sample;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading logs from storage:', err);
    return getSampleData();
  }
};

export const saveLogsToStorage = (logs) => {
  try {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Error saving logs to storage:', err);
  }
};

export const loadProfileFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_USER_PROFILE));
      return DEFAULT_USER_PROFILE;
    }
    return { ...DEFAULT_USER_PROFILE, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Error reading profile from storage:', err);
    return DEFAULT_USER_PROFILE;
  }
};

export const saveProfileToStorage = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (err) {
    console.error('Error saving profile to storage:', err);
  }
};

// Export to JSON file
export const exportDataAsJSON = (logs, profile) => {
  const data = {
    app: 'Hnazer Lifestyle Analyzer',
    version: '1.0.0',
    export_date: new Date().toISOString(),
    profile,
    logs
  };
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `hnazer_backup_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
};

// Export to CSV file (Compatible with Excel, Sheets, IGNOU Data Analysis)
export const exportDataAsCSV = (logs) => {
  if (!logs || logs.length === 0) return;
  const headers = ['user_id', 'name', 'date', 'sleep_hour', 'exercise_time_hours', 'water_intake_litres', 'screen_time_hours', 'mood', 'diet', 'notes'];
  const rows = logs.map(l => [
    l.user_id || 101,
    `"${(l.name || 'User').replace(/"/g, '""')}"`,
    l.date,
    l.sleep_hour,
    l.exercise_time,
    l.water_intake,
    l.screen_time,
    `"${(l.mood || '').replace(/"/g, '""')}"`,
    `"${(l.diet || '').replace(/"/g, '""')}"`,
    `"${(l.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `hnazer_logs_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
