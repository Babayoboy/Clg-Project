/**
 * Hnazer - Sample Dataset Generator
 * Realistic 14-day tracking data representing typical student/professional lifestyle patterns
 * for demonstration, viva evaluation, and instant visualization testing.
 */

export const getSampleData = () => {
  const today = new Date();
  const sampleLogs = [];
  
  const sampleTemplates = [
    { sleep: 7.5, exercise: 0.75, water: 2.8, screen: 4.5, mood: 'Energized', diet: 'Healthy', notes: 'Great morning run, slept well, focused study session.' },
    { sleep: 6.0, exercise: 0.5, water: 2.2, screen: 6.5, mood: 'Good', diet: 'Balanced', notes: 'Busy project workday. Had a 30m brisk evening walk.' },
    { sleep: 5.5, exercise: 0.0, water: 1.8, screen: 8.5, mood: 'Tired', diet: 'Fast Food', notes: 'Long assignment deadline sprint. Felt eye strain and lethargy.' },
    { sleep: 8.0, exercise: 1.0, water: 3.2, screen: 3.5, mood: 'Energized', diet: 'Healthy', notes: 'Weekend gym workout, meal prep, very relaxed day.' },
    { sleep: 7.0, exercise: 0.6, water: 2.5, screen: 5.0, mood: 'Good', diet: 'Balanced', notes: 'Consistent sleep schedule, drank plenty of herbal tea.' },
    { sleep: 6.5, exercise: 0.4, water: 2.0, screen: 7.0, mood: 'Neutral', diet: 'Balanced', notes: 'Multiple online meetings. Needed more screen breaks.' },
    { sleep: 4.8, exercise: 0.0, water: 1.4, screen: 9.5, mood: 'Burnout Alert', diet: 'Irregular', notes: 'Late night coding. High fatigue and severe headache.' },
    { sleep: 8.5, exercise: 0.5, water: 2.9, screen: 4.0, mood: 'Good', diet: 'Healthy', notes: 'Catch-up sleep day. Hydrated well and went for a light stroll.' },
    { sleep: 7.2, exercise: 0.8, water: 3.0, screen: 4.8, mood: 'Energized', diet: 'Healthy', notes: 'Outdoor cycling session. Felt high mental clarity.' },
    { sleep: 6.8, exercise: 0.5, water: 2.6, screen: 5.5, mood: 'Good', diet: 'Balanced', notes: 'Productive college lecture day, steady water intake.' },
    { sleep: 5.8, exercise: 0.25, water: 1.9, screen: 7.8, mood: 'Stressed', diet: 'Fast Food', notes: 'Exam preparation stress. Skipped lunch, had quick snacks.' },
    { sleep: 7.0, exercise: 0.75, water: 2.7, screen: 4.2, mood: 'Good', diet: 'Balanced', notes: 'Evening yoga session, 20-20-20 screen rule followed.' },
    { sleep: 7.8, exercise: 1.2, water: 3.4, screen: 3.8, mood: 'Energized', diet: 'Healthy', notes: 'Intense strength training, perfect hydration level.' },
    { sleep: 7.4, exercise: 0.6, water: 2.8, screen: 4.6, mood: 'Energized', diet: 'Healthy', notes: 'Optimal daily balance across sleep, screen time, and hydration.' }
  ];

  for (let i = 13; i >= 0; i--) {
    const dateObj = new Date(today);
    dateObj.setDate(today.getDate() - i);
    const dateStr = dateObj.toISOString().split('T')[0];
    const template = sampleTemplates[13 - i];

    sampleLogs.push({
      id: 'log_' + dateStr,
      user_id: 101,
      name: 'Ansh Joshi',
      date: dateStr,
      sleep_hour: template.sleep,
      exercise_time: template.exercise,
      water_intake: template.water,
      screen_time: template.screen,
      mood: template.mood,
      diet: template.diet,
      notes: template.notes
    });
  }

  return sampleLogs;
};

export const DEFAULT_USER_PROFILE = {
  user_id: 101,
  name: 'Ansh Joshi',
  target_sleep: 8.0,
  target_water: 3.0,
  target_exercise: 0.75, // in hours (45 min)
  max_screen_time: 5.0,
  theme: 'dark',
  ai_provider: 'builtin',
  gemini_api_key: '',
  created_at: '2026-01-01'
};
