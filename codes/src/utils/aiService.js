/**
 * Hnazer AI Insights Service
 * Complies with Synopsis Section 1.4 & 2.2:
 * 1. Default Mode: 100% On-Device local diagnostic reasoning (No data sent to any cloud/server).
 * 2. Optional AI Mode: User can opt-in and provide their own Gemini API key for deep generative synthesis.
 */

import { generateDiagnosticReport } from './scoring.js';

export const generateLocalAIAnalysis = (logs, profile) => {
  const diag = generateDiagnosticReport(logs, profile);
  const recentLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  
  const goodSleepDays = recentLogs.filter(l => (parseFloat(l.sleep_hour) || 0) >= 7.0).length;
  const goodHydrationDays = recentLogs.filter(l => (parseFloat(l.water_intake) || 0) >= 2.5).length;
  
  let lifestyleSummary = '';
  if (diag.burnoutIndex >= 50) {
    lifestyleSummary = `Your biometric and behavioral indicators reflect high physiological load. There is an active correlation between screen time (${diag.averages.screen} hrs/day) and reduced sleep duration (${diag.averages.sleep} hrs/day). Immediate habit recalibration is recommended.`;
  } else if (diag.burnoutIndex >= 25) {
    lifestyleSummary = `Your lifestyle metrics show moderate stability, but irregular hydration (${goodHydrationDays}/7 target days) and fluctuating sleep routines are causing periodic energy slumps.`;
  } else {
    lifestyleSummary = `Outstanding lifestyle equilibrium! You have maintained optimal sleep on ${goodSleepDays}/7 days and controlled screen fatigue. Keep nurturing this routine.`;
  }

  const strategicActionPlan = [
    {
      title: 'Digital Sunset & Melatonin Protection',
      detail: 'Set a hard boundary to disconnect from bright screens at least 45 minutes before sleep. Blue light from displays suppresses natural melatonin secretion.',
      impact: 'High Impact on Sleep Quality'
    },
    {
      title: 'Hydration Frontloading',
      detail: `Aim to consume at least 1.5 Litres of your ${profile?.target_water || 3.0}L daily target before 2:00 PM to combat afternoon cognitive fatigue.`,
      impact: 'Immediate Energy Reset'
    },
    {
      title: 'Active Decompression Micro-breaks',
      detail: 'Implement 5-minute movement or eye-resting intervals after every 50 minutes of deep desk work.',
      impact: 'Burnout Prevention'
    }
  ];

  return {
    source: 'On-Device Private Diagnostics Engine (Rule-based AI)',
    isExternal: false,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    vitalityScore: 100 - diag.burnoutIndex,
    riskLevel: diag.riskLevel,
    riskColor: diag.riskColor,
    summary: lifestyleSummary,
    metricsAverages: diag.averages,
    alerts: diag.alerts,
    actionPlan: strategicActionPlan
  };
};

export const callGeminiAI = async (logs, profile, apiKey) => {
  if (!apiKey) {
    throw new Error('Please provide a valid Gemini API Key in Settings or the AI prompt modal.');
  }

  const recentLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  const dataSummary = recentLogs.map(l => 
    `Date: ${l.date}, Sleep: ${l.sleep_hour}h, Exercise: ${l.exercise_time}h, Water: ${l.water_intake}L, Screen: ${l.screen_time}h, Mood: ${l.mood}, Diet: ${l.diet}`
  ).join('\n');

  const prompt = `
You are Hnazer AI, an expert lifestyle and wellness coach for the open-source Hnazer health analytics platform.
Analyze the following 7-day user logs for ${profile.name || 'the user'}:

User Goals:
- Target Sleep: ${profile.target_sleep} hours
- Target Water: ${profile.target_water} Litres
- Target Exercise: ${profile.target_exercise * 60} minutes
- Max Screen Time: ${profile.max_screen_time} hours

User Logs (Last 7 Days):
${dataSummary}

Provide a structured, encouraging, and highly actionable analysis in JSON format with the following schema:
{
  "summary": "2-3 concise sentences summarizing key trends, fatigue risks, or positive habits.",
  "burnout_risk": "Low" | "Moderate" | "Critical",
  "key_findings": ["Point 1", "Point 2", "Point 3"],
  "action_plan": [
    {"title": "Habit 1", "detail": "Actionable explanation", "impact": "Why this matters"},
    {"title": "Habit 2", "detail": "Actionable explanation", "impact": "Why this matters"}
  ],
  "encouragement": "A motivating closing thought."
}
Only output valid JSON.
`;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' }
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API Error (${res.status}): ${errorText}`);
  }

  const responseJson = await res.json();
  const textContent = responseJson.candidates?.[0]?.content?.parts?.[0]?.text;
  const parsed = JSON.parse(textContent);

  return {
    source: 'Google Gemini AI (External API)',
    isExternal: true,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    summary: parsed.summary,
    riskLevel: parsed.burnout_risk || 'Moderate',
    alerts: parsed.key_findings || [],
    actionPlan: parsed.action_plan || [],
    encouragement: parsed.encouragement
  };
};
