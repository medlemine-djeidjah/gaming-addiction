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
    if (step === 0 && (values.age - values.years_gaming) < 7) {
      setError(`Wait, you have ${values.years_gaming} years of gaming experience but you are only ${values.age} years old? This implies you started at age ${values.age - values.years_gaming}, which is unrealistic. Please ensure at least a 7–9 year gap for a credible diagnostic profile.`)
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
    <div className="min-h-screen bg-[#080604] text-white flex flex-col items-center">

      {/* Ambient background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div className="absolute -top-60 -left-40 w-96 h-96 bg-orange-950/60 rounded-full blur-[80px]" />
        <div className="absolute -bottom-60 -right-40 w-[30rem] h-[30rem] bg-amber-950/40 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-orange-900/20 rounded-full blur-[60px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#f97316 1px, transparent 1px), linear-gradient(90deg, #f97316 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full max-w-2xl px-4 pt-8 pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-orange-500/15 border border-orange-500/25">
            <Gamepad2 size={24} className="text-orange-400" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">GamingCheck</h1>
            <p className="text-neutral-600 text-xs">AI-powered gaming addiction risk assessment</p>
          </div>

          {/* Model picker */}
          <div className="ml-auto">
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-neutral-400 outline-none cursor-pointer hover:border-orange-500/30 transition-colors"
            >
              {MODELS.map(m => (
                <option key={m.value} value={m.value} className="bg-[#100c06]">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="flex gap-1.5 mb-2">
          {STEPS_META.map((_, i) => (
            <div key={i} className="h-1 flex-1 rounded-full overflow-hidden bg-white/10">
              {i <= step && (
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.35 }}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-neutral-600">
          <span>Step {step + 1} of {STEPS_META.length}</span>
          <span>{Math.round(((step + 1) / STEPS_META.length) * 100)}% complete</span>
        </div>
      </header>

      {/* Step card */}
      <main className="w-full max-w-2xl px-4 flex-1 relative z-10">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            variants={{
              enter:  d => ({ opacity: 0, x: d > 0 ?  70 : -70 }),
              center:   { opacity: 1, x: 0 },
              exit:   d => ({ opacity: 0, x: d > 0 ? -70 :  70 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="glass rounded-2xl p-6 shadow-2xl">
              {/* Step header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.grad} shadow-lg flex-shrink-0`}>
                  {meta.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">{meta.title}</h2>
                  <p className="text-neutral-400 text-sm leading-relaxed">{meta.subtitle}</p>
                </div>
              </div>

              <StepComponent v={values} u={update} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Error banner */}
        {error && (
          <motion.div
            className="mt-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-4 mb-10">
          {step > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBack}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-neutral-300 hover:border-orange-500/30 hover:text-white text-sm font-medium transition-all"
            >
              <ChevronLeft size={16} />
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleNext}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-500 hover:to-amber-400 text-white font-semibold flex-1 text-sm transition-all shadow-lg shadow-orange-950/50 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                {isLast ? 'Analyze My Risk' : 'Continue'}
                <ChevronRight size={16} />
              </>
            )}
          </motion.button>
        </div>
      </main>
    </div>
  )
}
