import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronLeft, Gamepad2, Moon, Brain, Users, Trophy,
  User, UserCircle, Monitor, Smartphone, Layers,
  Minus, AlertCircle, Zap, CloudRain, Flame, Activity, EyeOff, Star, Rocket, Sparkles,
  CheckCircle, AlertTriangle, TrendingDown, XCircle,
} from 'lucide-react'
import { SliderField, ChoiceGrid, RatingScale, ToggleRow } from './components/inputs'
import Results from './components/Results'

// ─── Constants ────────────────────────────────────────────────────────────────

const MODELS = [
  { value: 'decision_tree',       label: 'Decision Tree (99.5%)' },
  { value: 'gradient_boosting',   label: 'Gradient Boosting (99.5%)' },
  { value: 'random_forest',       label: 'Random Forest (99.0%)' },
  { value: 'logistic_regression', label: 'Logistic Regression (98.0%)' },
]

const STEPS_META = [
  { title: 'Your Profile',     subtitle: 'A few basics about you and your gaming history',         icon: <Gamepad2 size={20} />, grad: 'from-orange-500 to-amber-600'  },
  { title: 'Gaming Habits',    subtitle: 'How much you play, on what, and how much you spend',     icon: <Gamepad2 size={20} />, grad: 'from-amber-500 to-orange-600'  },
  { title: 'Sleep & Body',     subtitle: 'Gaming often disrupts sleep and causes physical strain', icon: <Moon size={20} />,     grad: 'from-orange-600 to-red-700'   },
  { title: 'Mind & Mood',      subtitle: 'Emotional patterns are key addiction indicators',        icon: <Brain size={20} />,    grad: 'from-amber-600 to-orange-600' },
  { title: 'Social & Results', subtitle: 'How gaming affects your relationships and performance',  icon: <Users size={20} />,    grad: 'from-orange-500 to-amber-500' },
]

// ─── Default values ───────────────────────────────────────────────────────────
// 17 PDF params → shown in form.
// 8 hidden params → sent to API with dataset-median defaults, never shown.

const DEFAULT = {
  // Shown in form
  age:                              22,
  gender:                           'Male',
  years_gaming:                     5,
  daily_gaming_hours:               3,
  gaming_platform:                  'PC',
  monthly_game_spending_usd:        20,
  sleep_hours:                      7,
  sleep_disruption_frequency:       'Sometimes',
  back_neck_pain:                   0,
  mood_state:                       'Normal',
  mood_swing_frequency:             'Sometimes',
  loss_of_other_interests:          0,
  continued_despite_problems:       0,
  social_isolation_score:           4,
  face_to_face_social_hours_weekly: 8,
  academic_work_performance:        'Good',
  grades_gpa:                       3.0,

  // Hidden — dataset medians / most-frequent
  game_genre:              'MOBA',
  primary_game:            'League of Legends',
  sleep_quality:           'Fair',
  work_productivity_score: 5,
  withdrawal_symptoms:     0,
  eye_strain:              0,
  weight_change_kg:        1,
  exercise_hours_weekly:   3,
}

// icon size used inside choice cards
const IC = 22

// ─── Step components ──────────────────────────────────────────────────────────

function ProfileStep({ v, u }) {
  return (
    <>
      <SliderField
        label="Your Age"
        description="Gaming risk profiles differ significantly across age groups."
        value={v.age} min={13} max={45} step={1} unit=" yrs"
        onChange={val => u('age', val)}
      />
      <ChoiceGrid
        label="Gender"
        description="Helps the model apply the right statistical baseline."
        options={[
          { value: 'Male',   label: 'Male',   icon: <User size={IC} /> },
          { value: 'Female', label: 'Female', icon: <UserCircle size={IC} /> },
        ]}
        columns={2}
        value={v.gender}
        onChange={val => u('gender', val)}
      />
      <SliderField
        label="Years Gaming"
        description="How long have you been a gamer? Veteran players can develop different habits."
        value={v.years_gaming} min={0} max={20} step={1} unit=" yrs"
        onChange={val => u('years_gaming', val)}
      />
    </>
  )
}

function GamingHabitsStep({ v, u }) {
  return (
    <>
      <SliderField
        label="Daily Gaming Hours"
        description="The strongest single predictor of risk. Be honest — average across all days including weekends."
        value={v.daily_gaming_hours} min={0.5} max={15} step={0.5} unit=" hrs"
        onChange={val => u('daily_gaming_hours', val)}
      />
      <ChoiceGrid
        label="Gaming Platform"
        description="Platform shapes session length and accessibility — mobile is especially hard to limit."
        options={[
          { value: 'PC',             label: 'PC',             icon: <Monitor size={IC} /> },
          { value: 'Console',        label: 'Console',        icon: <Gamepad2 size={IC} /> },
          { value: 'Mobile',         label: 'Mobile',         icon: <Smartphone size={IC} /> },
          { value: 'Multi-platform', label: 'Multi-platform', icon: <Layers size={IC} /> },
        ]}
        columns={4}
        value={v.gaming_platform}
        onChange={val => u('gaming_platform', val)}
      />
      <SliderField
        label="Monthly Game Spending"
        description="Games, DLC, battle passes, or in-game purchases. High spending is a known risk signal."
        value={v.monthly_game_spending_usd} min={0} max={500} step={5}
        formatFn={val => `$${val}`}
        onChange={val => u('monthly_game_spending_usd', val)}
      />
    </>
  )
}

function SleepBodyStep({ v, u }) {
  return (
    <>
      <SliderField
        label="Sleep Hours per Night"
        description="Gaming is one of the top reasons people sacrifice sleep. The healthy range is 7–9 hours."
        value={v.sleep_hours} min={2} max={12} step={0.5} unit=" hrs"
        onChange={val => u('sleep_hours', val)}
      />
      <RatingScale
        label="How Often Does Gaming Disrupt Your Sleep?"
        description="Staying up late to play, or feeling too stimulated to fall asleep after a session."
        options={[
          { value: 'Never',     label: 'Never' },
          { value: 'Rarely',    label: 'Rarely' },
          { value: 'Sometimes', label: 'Sometimes' },
          { value: 'Often',     label: 'Often' },
          { value: 'Always',    label: 'Always' },
        ]}
        value={v.sleep_disruption_frequency}
        onChange={val => u('sleep_disruption_frequency', val)}
      />
      <ToggleRow
        label="Back or Neck Pain"
        description="Do you regularly experience back, neck, or shoulder discomfort from long gaming sessions?"
        value={v.back_neck_pain}
        onChange={val => u('back_neck_pain', val)}
      />
    </>
  )
}

function MindMoodStep({ v, u }) {
  return (
    <>
      <ChoiceGrid
        label="General Mood (past few weeks)"
        description="How you typically feel day-to-day. Negative mood states are often amplified by heavy gaming."
        options={[
          { value: 'Normal',    label: 'Normal',    icon: <Minus size={IC} /> },
          { value: 'Anxious',   label: 'Anxious',   icon: <AlertCircle size={IC} /> },
          { value: 'Irritable', label: 'Irritable', icon: <Zap size={IC} /> },
          { value: 'Depressed', label: 'Depressed', icon: <CloudRain size={IC} /> },
          { value: 'Angry',     label: 'Angry',     icon: <Flame size={IC} /> },
          { value: 'Restless',  label: 'Restless',  icon: <Activity size={IC} /> },
          { value: 'Withdrawn', label: 'Withdrawn', icon: <EyeOff size={IC} /> },
          { value: 'Euphoric',  label: 'Euphoric',  icon: <Sparkles size={IC} /> },
          { value: 'Excited',   label: 'Excited',   icon: <Rocket size={IC} /> },
        ]}
        columns={3}
        value={v.mood_state}
        onChange={val => u('mood_state', val)}
      />
      <RatingScale
        label="Mood Swing Frequency"
        description="Sudden emotional shifts — especially irritability when you can't play or right after losing."
        options={[
          { value: 'Never',     label: 'Never' },
          { value: 'Rarely',    label: 'Rarely' },
          { value: 'Sometimes', label: 'Sometimes' },
          { value: 'Often',     label: 'Often' },
          { value: 'Daily',     label: 'Daily' },
        ]}
        value={v.mood_swing_frequency}
        onChange={val => u('mood_swing_frequency', val)}
      />
      <div className="mt-1">
        <p className="text-neutral-500 text-xs mb-3 font-medium uppercase tracking-wide">Behavioural patterns</p>
        <ToggleRow
          label="Loss of Interest in Other Activities"
          description="Have hobbies, sports, or activities you once enjoyed lost their appeal since gaming took over?"
          value={v.loss_of_other_interests}
          onChange={val => u('loss_of_other_interests', val)}
        />
        <ToggleRow
          label="Continued Gaming Despite Problems"
          description="Do you keep playing even when it's causing issues with relationships, work, or health?"
          value={v.continued_despite_problems}
          onChange={val => u('continued_despite_problems', val)}
        />
      </div>
    </>
  )
}

function SocialResultsStep({ v, u }) {
  return (
    <>
      <SliderField
        label="Social Isolation Level"
        description="1 = fully connected with the people around you.  10 = feeling completely cut off from others."
        value={v.social_isolation_score} min={1} max={10} step={1}
        formatFn={val => {
          const labels = { 1: 'Very connected', 3: 'Connected', 5: 'Neutral', 7: 'Isolated', 9: 'Very isolated', 10: 'Completely isolated' }
          return `${val}${labels[val] ? ` — ${labels[val]}` : ''}`
        }}
        onChange={val => u('social_isolation_score', val)}
      />
      <SliderField
        label="In-Person Social Hours (per week)"
        description="Time spent face-to-face with friends or family. Online interactions don't count here."
        value={v.face_to_face_social_hours_weekly} min={0} max={20} step={0.5} unit=" hrs"
        onChange={val => u('face_to_face_social_hours_weekly', val)}
      />
      <ChoiceGrid
        label="Academic / Work Performance"
        description="How would you honestly rate your performance at school or work over the past few months?"
        options={[
          { value: 'Excellent',     label: 'Excellent',     icon: <Star size={IC} /> },
          { value: 'Good',          label: 'Good',          icon: <CheckCircle size={IC} /> },
          { value: 'Average',       label: 'Average',       icon: <Minus size={IC} /> },
          { value: 'Below Average', label: 'Below Average', icon: <AlertTriangle size={IC} /> },
          { value: 'Poor',          label: 'Poor',          icon: <TrendingDown size={IC} /> },
          { value: 'Failing',       label: 'Failing',       icon: <XCircle size={IC} /> },
        ]}
        columns={3}
        value={v.academic_work_performance}
        onChange={val => u('academic_work_performance', val)}
      />
      <SliderField
        label="GPA / Grade Score"
        description="Current academic GPA (0–4 scale). If working, estimate: 4.0 = outstanding, 1.0 = very poor."
        value={v.grades_gpa} min={1.0} max={4.0} step={0.1}
        formatFn={val => val.toFixed(1)}
        onChange={val => u('grades_gpa', val)}
      />
    </>
  )
}

const STEP_RENDERERS = [ProfileStep, GamingHabitsStep, SleepBodyStep, MindMoodStep, SocialResultsStep]

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep]       = useState(0)
  const [dir, setDir]         = useState(1)
  const [values, setValues]   = useState(DEFAULT)
  const [model, setModel]     = useState('decision_tree')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const update = (key, val) => setValues(v => ({ ...v, [key]: val }))

  const handleNext = async () => {
    if (step === 0 && values.years_gaming > values.age) {
      setError(`Wait, you have ${values.years_gaming} years of gaming experience but you are only ${values.age} years old? That's not possible!`)
      return
    }
    setError(null)
    if (step < STEPS_META.length - 1) {
      setDir(1)
      setStep(s => s + 1)
    } else {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...values, model_name: model }),
        })
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const data = await res.json()
        setResult(data)
      } catch (e) {
        setError(e.message || 'Could not reach the prediction server — make sure the API is running.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleBack = () => {
    setDir(-1)
    setStep(s => s - 1)
  }

  if (result) {
    return (
      <Results
        result={result}
        onReset={() => { setResult(null); setStep(0); setValues(DEFAULT) }}
      />
    )
  }

  const StepComponent = STEP_RENDERERS[step]
  const meta = STEPS_META[step]
  const isLast = step === STEPS_META.length - 1

  return (
    <div className="min-h-screen bg-[#fcfdfd] text-slate-800 flex flex-col items-center pb-12 sm:pb-20 selection:bg-amber-100 selection:text-amber-900 transition-all duration-500 overflow-x-hidden">
      {/* Refined Structural Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div className="absolute top-0 right-0 w-[50%] h-[30%] bg-amber-50/20 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1.5px,transparent_1.5px)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="w-full max-w-5xl px-4 sm:px-10 lg:px-16 pt-6 sm:pt-12 relative z-10">
        {/* Header Section - Modern Horizontal Logic */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-10 mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <motion.div
              className="p-4 rounded-[2rem] bg-slate-900 shadow-sm transition-transform hover:scale-105 shrink-0"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <Gamepad2 size={28} className="text-white" />
            </motion.div>
            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">GamingCheck</h1>
              <div className="flex items-center justify-center sm:justify-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.25em] text-slate-400">Diagnostic Suite v4</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
            {/* Model Engine Selector */}
            <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Diagnostic Matrix</span>
              <div className="relative group w-full sm:w-auto">
                <select
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="w-full sm:w-auto bg-white border border-slate-200 rounded-2xl px-5 py-3 text-[11px] font-black text-slate-900 shadow-sm outline-none cursor-pointer hover:border-amber-400 transition-all appearance-none pr-10 text-center sm:text-left"
                >
                  {MODELS.map(m => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none rotate-90" size={14} />
              </div>
            </div>

            {/* Global Progress Indicator */}
            <div className="hidden sm:flex flex-col items-end gap-2">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none">Session Status</span>
              <div className="flex items-center gap-2">
                {[...Array(STEPS_META.length)].map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === step ? 'bg-amber-500 scale-125' : i < step ? 'bg-slate-900' : 'bg-slate-200'}`} />
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Main Interface Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Sidebar Navigation - Desktop only */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-3">
            {STEPS_META.map((s, i) => (
              <div
                key={i}
                className={`p-5 rounded-2xl border transition-all duration-500 flex items-center gap-4 ${
                  i === step 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                    : i < step ? 'bg-white border-slate-100 text-slate-400' : 'bg-transparent border-transparent text-slate-200'
                }`}
              >
                <div className="shrink-0">{s.icon}</div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 opacity-50">Phase 0{i + 1}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{s.title}</span>
                </div>
              </div>
            ))}
          </aside>

          {/* Diagnostic Core Card */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="bg-white rounded-[2.5rem] p-8 sm:p-14 border border-slate-100 shadow-sm relative overflow-hidden min-h-[460px] flex flex-col"
              >
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none select-none">
                  {meta.icon && <div className="scale-[8] lg:scale-[10] origin-top-right transition-transform">{meta.icon}</div>}
                </div>

                <div className="mb-12 relative z-10">
                  <motion.span 
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600 mb-4 block"
                    layoutId="category"
                  >
                    Diagnostic Parameter {step + 1}
                  </motion.span>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight uppercase max-w-2xl">
                    {meta.title}
                  </h2>
                  <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-lg mt-6 font-medium">
                    {meta.subtitle}
                  </p>
                </div>

                <div className="flex-1 flex flex-col justify-center relative z-10 py-6">
                  <StepComponent v={values} u={update} />
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-10 flex items-center gap-4 text-orange-900 bg-orange-50 p-5 rounded-2xl border border-orange-100"
                  >
                    <AlertCircle size={20} className="shrink-0 text-orange-600" />
                    <span className="text-xs font-bold uppercase tracking-wider leading-relaxed">{error}</span>
                  </motion.div>
                )}

                {/* Progress bar for mobile */}
                <div className="lg:hidden mt-12 pt-8 border-t border-slate-50 flex items-center justify-between gap-6">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${((step + 1) / STEPS_META.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{step + 1} / 5</span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Tactical Controls */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="w-full sm:w-auto px-10 py-5 rounded-2xl border border-slate-100 bg-white text-slate-400 hover:text-slate-900 hover:border-slate-200 transition-all text-xs font-black uppercase tracking-widest flex items-center justify-center gap-4 shadow-sm"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="w-full flex-1 px-10 py-5 rounded-2xl bg-slate-900 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs font-black uppercase tracking-[0.3em] shadow-sm flex items-center justify-center gap-4 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing Bio-Data...
                  </>
                ) : (
                  <>
                    {isLast ? 'Initiate Diagnosis' : 'Acknowledge Pattern'}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
