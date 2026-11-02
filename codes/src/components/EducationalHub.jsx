import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Moon, 
  Monitor, 
  Droplet, 
  Flame, 
  HeartPulse, 
  HelpCircle,
  Lightbulb,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  ClipboardList
} from 'lucide-react';

export const EducationalHub = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedTopic, setSelectedTopic] = useState('sleep');

  const topics = [
    {
      id: 'sleep',
      code: 'TIP-01',
      title: 'Sleep Quality & Restful Habits',
      icon: Moon,
      color: 'text-indigo-400',
      tag: 'Sleep Habits',
      summary: 'How sleep cycles work and simple everyday habits for restful, refreshing sleep.',
      content: [
        {
          heading: '1. The 90-Minute Sleep Cycle',
          body: 'Sleep naturally progresses in ~90-minute cycles: light sleep, deep sleep, and REM (dreaming). Waking up during deep sleep can make you feel groggy, so aiming for 7–8 hours helps your body complete full cycles.'
        },
        {
          heading: '2. Morning Light & Evening Screen Habits',
          body: 'Getting natural sunlight within 30 minutes of waking sets your internal body clock. Minimizing bright screens in the hour before bed helps your mind wind down naturally.'
        },
        {
          heading: '3. A Cool, Dark Sleep Space',
          body: 'Your body cools down slightly to fall asleep. Keep your bedroom comfortable (around 18–20°C / 65–68°F), quiet, and dark for the best night of rest.'
        }
      ]
    },
    {
      id: 'screen',
      code: 'TIP-02',
      title: 'Screen Time & Eye Care (20-20-20 Rule)',
      icon: Monitor,
      color: 'text-purple-400',
      tag: 'Screen Health',
      summary: 'Practical tips to prevent digital eye strain, headaches, and screen fatigue.',
      content: [
        {
          heading: '1. The 20-20-20 Rule',
          body: 'Every 20 minutes spent looking at a screen, look at something at least 20 feet (6 meters) away for 20 seconds. This relaxes your eye focus muscles.'
        },
        {
          heading: '2. Remember to Blink Regularly',
          body: 'Staring at screens cuts our natural blink rate by more than half, which can lead to dry eyes. Take brief pauses to rest your eyes throughout the day.'
        },
        {
          heading: '3. Evening Screen Wind-down',
          body: 'Switch on warm screen filters (Night Light or blue light filter) an hour before sleep to avoid late-night alertness.'
        }
      ]
    },
    {
      id: 'water',
      code: 'TIP-03',
      title: 'Daily Hydration & Water Habits',
      icon: Droplet,
      color: 'text-cyan-400',
      tag: 'Hydration',
      summary: 'Why drinking enough water keeps your energy, focus, and digestion running smoothly.',
      content: [
        {
          heading: '1. Aim for 2.5 to 3 Litres Daily',
          body: 'Staying well hydrated maintains focus and prevents fatigue and headaches. Even mild dehydration can slow your alertness and physical stamina.'
        },
        {
          heading: '2. Start Your Day with Water',
          body: 'Drink a glass of water when you wake up to rehydrate after sleep. Try to drink water steadily throughout the day rather than all at once late at night.'
        },
        {
          heading: '3. Balance Water with Nutritious Food',
          body: 'Water works best alongside wholesome meals with fruits and vegetables. Keep high-sugar sodas and excessive caffeine moderate.'
        }
      ]
    },
    {
      id: 'burnout',
      code: 'TIP-04',
      title: 'Stress Relief & Mindful Recovery',
      icon: HeartPulse,
      color: 'text-rose-400',
      tag: 'Stress & Recovery',
      summary: 'Easy breathing exercises and daily movement habits to relieve stress and recharge your mind.',
      content: [
        {
          heading: '1. The Relaxing Deep Breath (Physiological Sigh)',
          body: 'Take two quick breaths in through your nose, followed by one long, slow exhale through your mouth. Doing this 2–3 times quickly calms nervous tension.'
        },
        {
          heading: '2. Spotting Early Fatigue Signs',
          body: 'Early burnout often feels like irritability, low motivation, or sluggishness. Regularly tracking your habits helps you notice when you need an extra rest day.'
        },
        {
          heading: '3. Short 5-Minute Movement Breaks',
          body: 'A quick 3–5 minute walk or simple stretching clears mental fog, boosts blood flow, and lowers everyday stress.'
        }
      ]
    }
  ];

  const currentTopic = topics.find(t => t.id === selectedTopic) || topics[0];
  const IconComponent = currentTopic.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-mono">
      <div className="relative w-full max-w-3xl bg-[#0b101c] border border-slate-700/90 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider block">
                HEALTHY HABIT GUIDELINES
              </span>
              <h2 className="text-base font-bold font-display text-white mt-0.5">
                Healthy Habit Guidelines & Scientific Principles
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Scientific habits for sleep, digital screen breaks, exercise, and hydration
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

        {/* Protocols Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 my-2 scrollbar-none">
          {topics.map((t) => {
            const TIcon = t.icon;
            const isActive = t.id === selectedTopic;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <TIcon className="w-3.5 h-3.5" />
                <span>[{t.code}] {t.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Topic Content Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-5 space-y-4 my-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <IconComponent className={`w-4 h-4 ${currentTopic.color}`} />
              {currentTopic.title}
            </h3>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
              {currentTopic.code}
            </span>
          </div>

          <p className="text-xs text-cyan-300/90 italic bg-cyan-950/40 p-3 rounded-xl border border-cyan-900/40 font-sans leading-relaxed">
            {currentTopic.summary}
          </p>

          <div className="space-y-3 pt-1">
            {currentTopic.content.map((sec, idx) => (
              <div key={idx} className="space-y-1">
                <h4 className="text-xs font-bold text-slate-200">{sec.heading}</h4>
                <p className="text-xs text-slate-400 font-sans leading-relaxed">{sec.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Notice Footer */}
        <div className="mt-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-start gap-2.5 text-[11px] text-slate-400 font-sans">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>
            <strong>Educational Notice:</strong> Formulated for educational habit intelligence and academic self-analysis under IGNOU Project terms. For informational habit tracking only; not medical advice.
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Close Guidelines
          </button>
        </div>

      </div>
    </div>
  );
};

