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
      code: 'PROT-SLP-01',
      title: 'Circadian Biology & Sleep Architecture Protocol',
      icon: Moon,
      color: 'text-indigo-400',
      tag: 'Circadian Biology',
      summary: 'Chronobiological mechanisms governing 90-minute ultradian cycles and restorative delta slow-wave sleep.',
      content: [
        {
          heading: '1. The 90-Minute Ultradian Sleep Cycle',
          body: 'Human sleep architecture progresses through ~90-minute cycles: NREM-1, NREM-2, Slow-Wave Deep Sleep (NREM-3), and REM. Waking during slow-wave sleep triggers severe sleep inertia and cognitive impairment.'
        },
        {
          heading: '2. Melanopsin Activation & Melatonin Phase Shift',
          body: 'Morning photon exposure within 30 minutes of waking triggers suprachiasmatic nucleus (SCN) circadian synchronization. Evening blue light (>460nm) suppresses pineal melatonin secretion by up to 90 minutes.'
        },
        {
          heading: '3. Thermoregulatory Sleep Environment',
          body: 'Optimal sleep initiation requires a 1°C drop in core body temperature. Maintain bedroom ambient temperature at 18–20°C (65–68°F) with photic blackout conditions.'
        }
      ]
    },
    {
      id: 'screen',
      code: 'PROT-SCR-02',
      title: 'Digital Ergonomics & Asthenopia Prevention (20-20-20)',
      icon: Monitor,
      color: 'text-purple-400',
      tag: 'Digital Ergonomics',
      summary: 'Clinical guidelines to prevent digital asthenopia, ciliary muscle spasm, and dopamine fatigue.',
      content: [
        {
          heading: '1. The 20-20-20 Clinical Rule',
          body: 'Every 20 minutes of continuous screen focus, fixate on a target at least 20 feet (6 meters) away for 20 seconds to release tonic ciliary muscle accommodation spasm.'
        },
        {
          heading: '2. Blink Rate Deficit & Tear Film Instability',
          body: 'Digital screen exposure reduces spontaneous blink rates from 18/min to 5–7/min, destabilizing the ocular lipid tear film and inducing corneal desiccation.'
        },
        {
          heading: '3. Digital Sunset Protocol',
          body: 'Activate circadian display filtration (night shift / blue-light reduction) 60 minutes before scheduled sleep to downregulate autonomic sympathetic tone.'
        }
      ]
    },
    {
      id: 'water',
      code: 'PROT-H2O-03',
      title: 'Cellular Osmoregulation & Hydration Kinetics',
      icon: Droplet,
      color: 'text-cyan-400',
      tag: 'Metabolic Osmoregulation',
      summary: 'Physiological mechanisms of osmoregulation and cellular metabolic efficiency.',
      content: [
        {
          heading: '1. 2.5–3.0 Litre Normohydration Baseline',
          body: 'Cerebral tissue contains ~73% water by mass. A 1.5% decrease in total body water elevates plasma osmolality, precipitating microvascular perfusion deficits and executive fatigue.'
        },
        {
          heading: '2. Frontloaded Hydration Strategy',
          body: 'Administer 500ml of ambient water upon waking to compensate for respiratory and perspiration losses, completing 70% of daily fluid titration before 16:00.'
        },
        {
          heading: '3. Mineral Synergism (Electrolyte Homeostasis)',
          body: 'Intracellular hydration requires adequate potassium and sodium gradients. Excessive diuretic intake (caffeine/energy drinks) accelerates renal free-water clearance.'
        }
      ]
    },
    {
      id: 'burnout',
      code: 'PROT-BUR-04',
      title: 'Autonomic Vagal Modulation & Stress Homeostasis',
      icon: HeartPulse,
      color: 'text-rose-400',
      tag: 'Neuro-Autonomic Balance',
      summary: 'Evidence-based protocols to stimulate parasympathetic vagal tone and reverse chronic sympathovagal imbalance.',
      content: [
        {
          heading: '1. Physiological Sigh & Vagal Tone Activation',
          body: 'Two consecutive nasal inhalations followed by a prolonged oral exhalation rapidly optimizes alveolar gas exchange and activates the cardiac vagal decelerator reflex.'
        },
        {
          heading: '2. Clinical Stages of Burnout Syndrome',
          body: 'Stage 1: Allostatic load compensation. Stage 2: Chronic cortisol dysregulation and affective blunting. Stage 3: Executive exhaustion. Hnazer detects and flags Stage 1 variances.'
        },
        {
          heading: '3. Kinetic De-Stressing Intervals',
          body: 'A brief 3-5 minute bout of brisk ambulation or dynamic mobility stimulates skeletal muscle GLUT4 glucose uptake and accelerates plasma cortisol clearance.'
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
                EVIDENCE-BASED PROTOCOLS
              </span>
              <h2 className="text-base font-bold font-display text-white mt-0.5">
                Clinical Reference Protocols & Medical Guidelines
              </h2>
              <p className="text-[11px] text-slate-400 font-sans">
                Evidence-based physiological guidelines for circadian, digital, and autonomic homeostasis
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
            <strong>Clinical Education Notice:</strong> Formulated for educational habit intelligence and academic self-analysis under IGNOU Project Synopsis terms.
          </span>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors"
          >
            Close Protocols
          </button>
        </div>

      </div>
    </div>
  );
};

