/**
 * Hnazer Lifestyle Analytics & Scoring Algorithms
 * Calculates Daily Vitality Scores, Burnout Risk Indices, Habit Streaks, and Diagnostic Insights.
 */

// Calculate Individual Metric Scores (0-100)
export const calculateMetricScores = (log, profile) => {
  if (!log) {
    return {
      compositeScore: 0,
      sleepScore: 0,
      waterScore: 0,
      exerciseScore: 0,
      screenScore: 0,
      moodScore: 0,
      dietScore: 0
    };
  }

  const targetSleep = profile?.target_sleep || 8.0;
  const targetWater = profile?.target_water || 3.0;
  const targetExercise = profile?.target_exercise || 0.75;
  const maxScreen = profile?.max_screen_time || 5.0;

  // 1. Sleep Score (Optimal: 7-9h)
  let sleepScore = 0;
  const sleep = parseFloat(log.sleep_hour) || 0;
  if (sleep >= 7 && sleep <= 9) {
    sleepScore = 100;
  } else if (sleep >= 6 && sleep < 7) {
    sleepScore = 80;
  } else if (sleep > 9 && sleep <= 10) {
    sleepScore = 85;
  } else if (sleep >= 5 && sleep < 6) {
    sleepScore = 60;
  } else if (sleep > 10) {
    sleepScore = 65; // Oversleeping lethargy penalty
  } else if (sleep >= 4) {
    sleepScore = 35;
  } else {
    sleepScore = 15;
  }

  // 2. Water Score (Target: ~3.0 Litres)
  const water = parseFloat(log.water_intake) || 0;
  let waterScore = Math.min(100, Math.round((water / targetWater) * 100));

  // 3. Exercise Score (Target: ~0.75 hrs / 45 mins)
  const exercise = parseFloat(log.exercise_time) || 0;
  let exerciseScore = Math.min(100, Math.round((exercise / targetExercise) * 100));

  // 4. Screen Time Score (Inverted: Lower is better up to max threshold)
  const screen = parseFloat(log.screen_time) || 0;
  let screenScore = 100;
  if (screen <= 3.5) {
    screenScore = 100;
  } else if (screen <= maxScreen) {
    screenScore = 85;
  } else if (screen <= maxScreen + 2) {
    screenScore = 60;
  } else if (screen <= maxScreen + 4) {
    screenScore = 35;
  } else {
    screenScore = 15;
  }

  // 5. Mood Score
  const moodMap = {
    'Energized': 100,
    'Good': 85,
    'Neutral': 70,
    'Tired': 45,
    'Stressed': 35,
    'Burnout Alert': 15
  };
  const moodScore = moodMap[log.mood] || 70;

  // 6. Diet Score
  const dietMap = {
    'Healthy': 100,
    'Balanced': 85,
    'Average': 65,
    'Fast Food': 40,
    'Irregular': 30
  };
  const dietScore = dietMap[log.diet] || 70;

  // Weighted Composite Vitality Score
  // Sleep (25%), Exercise (20%), Screen (20%), Water (15%), Mood (10%), Diet (10%)
  const compositeScore = Math.round(
    sleepScore * 0.25 +
    exerciseScore * 0.20 +
    screenScore * 0.20 +
    waterScore * 0.15 +
    moodScore * 0.10 +
    dietScore * 0.10
  );

  return {
    compositeScore: Math.min(100, Math.max(0, compositeScore)),
    sleepScore,
    waterScore,
    exerciseScore,
    screenScore,
    moodScore,
    dietScore
  };
};

// Calculate Vitality Rating Category
export const getVitalityStatus = (score) => {
  if (score >= 85) return { label: 'Optimal Vitality', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
  if (score >= 70) return { label: 'Healthy & Balanced', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
  if (score >= 55) return { label: 'Mild Fatigue', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
  return { label: 'High Burnout Risk', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30' };
};

// Compute Streaks and Habit Consistency
export const calculateStreaks = (logs, profile) => {
  if (!logs || logs.length === 0) return { currentStreak: 0, waterStreak: 0, sleepStreak: 0, activeDays: 0 };
  
  const sorted = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));
  let waterStreak = 0;
  let sleepStreak = 0;

  for (let i = 0; i < sorted.length; i++) {
    const log = sorted[i];
    if ((parseFloat(log.water_intake) || 0) >= (profile?.target_water || 2.5) * 0.8) waterStreak++;
    if ((parseFloat(log.sleep_hour) || 0) >= 6.5) sleepStreak++;
  }

  return {
    currentStreak: sorted.length,
    waterStreak: Math.min(waterStreak, sorted.length),
    sleepStreak: Math.min(sleepStreak, sorted.length),
    activeDays: sorted.length
  };
};

// Diagnostic & Burnout Analysis Engine (Rule-based, 100% On-Device)
export const generateDiagnosticReport = (logs, profile) => {
  if (!logs || logs.length === 0) {
    return {
      burnoutIndex: 0,
      riskLevel: 'No Data',
      alerts: ['No daily logs recorded yet. Start by logging your habits today!'],
      recommendations: ['Log your sleep, water, and screen time to generate self-analysis intelligence.']
    };
  }

  const recentLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  const avgSleep = recentLogs.reduce((acc, l) => acc + (parseFloat(l.sleep_hour) || 0), 0) / recentLogs.length;
  const avgScreen = recentLogs.reduce((acc, l) => acc + (parseFloat(l.screen_time) || 0), 0) / recentLogs.length;
  const avgWater = recentLogs.reduce((acc, l) => acc + (parseFloat(l.water_intake) || 0), 0) / recentLogs.length;
  const avgExercise = recentLogs.reduce((acc, l) => acc + (parseFloat(l.exercise_time) || 0), 0) / recentLogs.length;
  
  const alerts = [];
  const recommendations = [];
  let burnoutPoints = 0;

  // 1. Sleep Debt Analysis
  if (avgSleep < 6.0) {
    burnoutPoints += 30;
    alerts.push(`Sleep Deficit: Your 7-day average sleep is ${avgSleep.toFixed(1)}h (below recommended 7-9h threshold).`);
    recommendations.push('Establish a consistent sleep schedule. Dim lights and disconnect screens 45 minutes before bed.');
  } else if (avgSleep > 9.5) {
    alerts.push(`High Sleep Duration: Averaging ${avgSleep.toFixed(1)}h. If you still feel exhausted, investigate lethargy triggers.`);
  }

  // 2. Screen Time Exposure Analysis
  if (avgScreen > 7.0) {
    burnoutPoints += 25;
    alerts.push(`Excessive Screen Exposure: Screen time is averaging ${avgScreen.toFixed(1)} hrs/day, contributing to digital fatigue.`);
    recommendations.push('Adopt the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.');
  }

  // 3. Hydration Deficit
  if (avgWater < 2.0) {
    burnoutPoints += 15;
    alerts.push(`Hydration Shortfall: Water intake is ${avgWater.toFixed(1)}L/day. Mild dehydration causes brain fog and lethargy.`);
    recommendations.push('Keep a dedicated 1-litre water bottle at your desk and sip 250ml every 90 minutes.');
  }

  // 4. Physical Inactivity
  if (avgExercise < 0.3) {
    burnoutPoints += 20;
    alerts.push(`Sedentary Routine: Physical activity averages under 20 minutes daily.`);
    recommendations.push('Incorporate a daily 30-minute brisk walk or light stretching routine to reset dopamine and energy levels.');
  }

  // 5. Mood / Stress Correlation
  const stressCount = recentLogs.filter(l => l.mood === 'Stressed' || l.mood === 'Burnout Alert' || l.mood === 'Tired').length;
  if (stressCount >= 3) {
    burnoutPoints += 20;
    alerts.push(`Stress Cluster: You experienced fatigue or stress on ${stressCount} out of the last ${recentLogs.length} days.`);
    recommendations.push('Practice 5 minutes of 4-7-8 breathing when transitioning between study/work sessions.');
  }

  let riskLevel = 'Low';
  let riskColor = 'text-emerald-400';
  if (burnoutPoints >= 50) {
    riskLevel = 'Critical';
    riskColor = 'text-rose-500';
  } else if (burnoutPoints >= 25) {
    riskLevel = 'Moderate';
    riskColor = 'text-amber-400';
  }

  if (recommendations.length === 0) {
    recommendations.push('Your daily habits are well-balanced! Maintain your current sleep, hydration, and exercise consistency.');
  }

  return {
    burnoutIndex: Math.min(100, burnoutPoints),
    riskLevel,
    riskColor,
    averages: {
      sleep: avgSleep.toFixed(1),
      screen: avgScreen.toFixed(1),
      water: avgWater.toFixed(1),
      exercise: Math.round(avgExercise * 60) // in minutes
    },
    alerts,
    recommendations
  };
};
