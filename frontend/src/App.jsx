import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Gamepad2, Moon, Brain, Heart, Users, Trophy } from 'lucide-react'
import { SliderField, ChoiceGrid, RatingScale, ToggleRow } from './components/inputs'
import Results from './components/Results'

// ─── Constants ───────────────────────────────────────────────────────────────

const MODELS = [
  { value: 'decision_tree',     label: 'Decision Tree (99.5%)' },
  { value: 'gradient_boosting', label: 'Gradient Boosting (99.5%)' },
  { value: 'random_forest',     label: 'Random Forest (99.0%)' },
  { value: 'logistic_regression', label: 'Logistic Regression (98.0%)' },
]

const STEPS_META = [
  { title: 'Your Profile',       subtitle: 'Tell us a bit about yourself and your gaming history',     icon: <Gamepad2 size={20} />, grad: 'from-violet-600 to-purple-700' },
  { title: 'Gaming Habits',      subtitle: 'How, what, and how much you play',                         icon: <Gamepad2 size={20} />, grad: 'from-purple-600 to-indigo-700' },
  { title: 'Sleep & Body',       subtitle: 'Gaming can quietly affect your physical health',           icon: <Moon size={20} />,     grad: 'from-indigo-600 to-blue-700' },
  { title: 'Mind & Mood',        subtitle: 'Your emotional state is a key indicator',                  icon: <Brain size={20} />,    grad: 'from-blue-600 to-cyan-700' },
  { title: 'Physical & Social',  subtitle: 'Activity and social life paint the full picture',          icon: <Heart size={20} />,    grad: 'from-cyan-600 to-teal-700' },
  { title: 'Performance',        subtitle: 'How gaming impacts your work or academic life',            icon: <Trophy size={20} />,   grad: 'from-teal-600 to-emerald-700' },
]

const DEFAULT = {
  age: 22,
  gender: 'Male',
  years_gaming: 5,
  daily_gaming_hours: 3,
  game_genre: 'MOBA',
  primary_game: 'League of Legends',
  gaming_platform: 'PC',
  monthly_game_spending_usd: 20,
  sleep_hours: 7,
  sleep_quality: 'Fair',
  sleep_disruption_frequency: 'Sometimes',
  weight_change_kg: 1,
  mood_state: 'Normal',
  mood_swing_frequency: 'Sometimes',
  withdrawal_symptoms: 0,
  loss_of_other_interests: 0,
  continued_despite_problems: 0,
  eye_strain: 0,
  back_neck_pain: 0,
  exercise_hours_weekly: 3,
  social_isolation_score: 4,
  face_to_face_social_hours_weekly: 8,
  academic_work_performance: 'Good',
  grades_gpa: 3.0,
  work_productivity_score: 7,
}

// ─── Step components ──────────────────────────────────────────────────────────

function ProfileStep({ v, u }) {
  return (
    <>
      <SliderField
        label="Your Age"
        description="How old are you? Gaming habits and risks vary significantly with age."
        value={v.age} min={13} max={45} step={1} unit=" yrs"
        onChange={val => u('age', val)}
      />
      <ChoiceGrid
        label="Gender"
        description="Biological factors can influence gaming patterns and addiction risk."
        options={[
          { value: 'Male',   label: 'Male',   icon: '♂️' },
          { value: 'Female', label: 'Female', icon: '♀️' },
          { value: 'Other',  label: 'Other',  icon: '⚧️' },
        ]}
        columns={3}
        value={v.gender}
        onChange={val => u('gender', val)}
      />
      <SliderField
        label="Years of Gaming"
        description="How long have you been a gamer? Long-term players may have different risk profiles."
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
        description="On average, how many hours do you game per day? This is the single biggest indicator."
        value={v.daily_gaming_hours} min={0.5} max={15} step={0.5} unit=" hrs"
        onChange={val => u('daily_gaming_hours', val)}
      />
      <ChoiceGrid
        label="Favourite Game Genre"
        description="Certain genres (like MMOs and MOBAs) are more strongly linked to addictive patterns."
        options={[
          { value: 'MOBA',         label: 'MOBA',          icon: '⚔️' },
          { value: 'FPS',          label: 'FPS / Shooter',  icon: '🔫' },
          { value: 'RPG',          label: 'RPG',            icon: '🧙' },
          { value: 'MMO',          label: 'MMO',            icon: '🌍' },
          { value: 'Battle Royale',label: 'Battle Royale',  icon: '🪂' },
          { value: 'Strategy',     label: 'Strategy',       icon: '♟️' },
          { value: 'Mobile Games', label: 'Mobile',         icon: '📱' },
        ]}
        columns={4}
        value={v.game_genre}
        onChange={val => u('game_genre', val)}
      />
      <ChoiceGrid
        label="Primary Game"
        description="The specific title you spend the most time on."
        options={[
          { value: 'League of Legends', label: 'League of Legends' },
          { value: 'Dota 2',            label: 'Dota 2' },
          { value: 'Valorant',          label: 'Valorant' },
          { value: 'CS:GO',             label: 'CS:GO' },
          { value: 'Fortnite',          label: 'Fortnite' },
          { value: 'PUBG',              label: 'PUBG' },
          { value: 'PUBG Mobile',       label: 'PUBG Mobile' },
          { value: 'Apex Legends',      label: 'Apex Legends' },
          { value: 'Warzone',           label: 'Warzone' },
          { value: 'World of Warcraft', label: 'World of Warcraft' },
          { value: 'Final Fantasy XIV', label: 'FF XIV' },
          { value: 'Elder Scrolls Online', label: 'ESO' },
          { value: 'Genshin Impact',    label: 'Genshin Impact' },
          { value: 'Mobile Legends',    label: 'Mobile Legends' },
          { value: 'Clash of Clans',    label: 'Clash of Clans' },
          { value: 'Candy Crush',       label: 'Candy Crush' },
          { value: 'Minecraft',         label: 'Minecraft' },
          { value: 'Overwatch',         label: 'Overwatch' },
          { value: 'Elden Ring',        label: 'Elden Ring' },
          { value: 'Cyberpunk 2077',    label: 'Cyberpunk 2077' },
          { value: 'Skyrim',            label: 'Skyrim' },
          { value: 'StarCraft II',      label: 'StarCraft II' },
          { value: 'Civilization VI',   label: 'Civ VI' },
          { value: 'Age of Empires',    label: 'Age of Empires' },
        ]}
        columns={4}
        value={v.primary_game}
        onChange={val => u('primary_game', val)}
      />
      <ChoiceGrid
        label="Gaming Platform"
        options={[
          { value: 'PC',             label: 'PC',           icon: '🖥️' },
          { value: 'Console',        label: 'Console',      icon: '🎮' },
          { value: 'Mobile',         label: 'Mobile',       icon: '📱' },
          { value: 'Multi-platform', label: 'Multi-platform', icon: '🔀' },
        ]}
        columns={4}
        value={v.gaming_platform}
        onChange={val => u('gaming_platform', val)}
      />
      <SliderField
        label="Monthly Game Spending"
        description="How much do you spend per month on games, DLC, battle passes, or in-game items?"
        value={v.monthly_game_spending_usd} min={0} max={500} step={5}
        formatFn={val => `$${val}`}
        onChange={val => u('monthly_game_spending_usd', val)}
      />
    </>
  )
}

function SleepHealthStep({ v, u }) {
  return (
    <>
      <SliderField
        label="Hours of Sleep per Night"
        description="Adults need 7–9 hours. Gaming often pushes bedtime later, disrupting sleep cycles."
        value={v.sleep_hours} min={2} max={12} step={0.5} unit=" hrs"
        onChange={val => u('sleep_hours', val)}
      />
      <RatingScale
        label="Sleep Quality"
        description="How refreshed do you feel after waking up most mornings?"
        options={[
          { value: 'Very Poor', label: 'Very Poor' },
          { value: 'Poor',      label: 'Poor' },
          { value: 'Fair',      label: 'Fair' },
          { value: 'Good',      label: 'Good' },
          { value: 'Insomnia',  label: 'Insomnia' },
        ]}
        value={v.sleep_quality}
        onChange={val => u('sleep_quality', val)}
      />
      <RatingScale
        label="How Often Does Gaming Disrupt Your Sleep?"
        description="Staying up late to game, or feeling too wired to sleep after a session."
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
      <SliderField
        label="Weight Change (kg)"
        description="Have you noticed any weight gain over the past year? Sedentary gaming can contribute."
        value={v.weight_change_kg} min={0} max={9} step={0.5} unit=" kg"
        onChange={val => u('weight_change_kg', val)}
      />
    </>
  )
}

function MentalMoodStep({ v, u }) {
  return (
    <>
      <ChoiceGrid
        label="How Would You Describe Your General Mood?"
        description="Your typical emotional state over the past few weeks."
        options={[
          { value: 'Normal',    label: 'Normal',    icon: '😐' },
          { value: 'Anxious',   label: 'Anxious',   icon: '😰' },
          { value: 'Irritable', label: 'Irritable', icon: '😤' },
          { value: 'Depressed', label: 'Depressed', icon: '😔' },
          { value: 'Angry',     label: 'Angry',     icon: '😠' },
          { value: 'Restless',  label: 'Restless',  icon: '😬' },
          { value: 'Withdrawn', label: 'Withdrawn', icon: '🙁' },
          { value: 'Euphoric',  label: 'Euphoric',  icon: '🤩' },
          { value: 'Excited',   label: 'Excited',   icon: '😃' },
        ]}
        columns={3}
        value={v.mood_state}
        onChange={val => u('mood_state', val)}
      />
      <RatingScale
        label="How Often Do You Experience Mood Swings?"
        description="Sudden emotional shifts, especially when not playing or after losing."
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
      <div className="mt-2">
        <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wide">Behavioural Signals</p>
        <ToggleRow
          label="Withdrawal Symptoms"
          description="Do you feel irritable, anxious, or restless when you can't game?"
          value={v.withdrawal_symptoms}
          onChange={val => u('withdrawal_symptoms', val)}
        />
        <ToggleRow
          label="Loss of Other Interests"
          description="Have hobbies or activities you used to enjoy lost their appeal?"
          value={v.loss_of_other_interests}
          onChange={val => u('loss_of_other_interests', val)}
        />
        <ToggleRow
          label="Continued Despite Problems"
          description="Do you keep gaming even when it causes issues (relationship, work, health)?"
          value={v.continued_despite_problems}
          onChange={val => u('continued_despite_problems', val)}
        />
      </div>
    </>
  )
}

function PhysicalSocialStep({ v, u }) {
  return (
    <>
      <div className="mb-2">
        <p className="text-gray-400 text-xs mb-3 font-medium uppercase tracking-wide">Physical Symptoms</p>
        <ToggleRow
          label="Eye Strain"
          description="Do you regularly experience sore, tired, or strained eyes after gaming?"
          value={v.eye_strain}
          onChange={val => u('eye_strain', val)}
        />
        <ToggleRow
          label="Back or Neck Pain"
          description="Do you often have back, neck, or wrist discomfort from long gaming sessions?"
          value={v.back_neck_pain}
          onChange={val => u('back_neck_pain', val)}
        />
      </div>
      <SliderField
        label="Weekly Exercise Hours"
        description="Physical activity is a strong protective factor against addiction. How many hours per week do you exercise?"
        value={v.exercise_hours_weekly} min={0} max={15} step={0.5} unit=" hrs"
        onChange={val => u('exercise_hours_weekly', val)}
      />
      <SliderField
        label="Social Isolation Level"
        description="On a scale of 1 (very connected) to 10 (very isolated), how socially isolated do you feel?"
        value={v.social_isolation_score} min={1} max={10} step={1}
        formatFn={val => {
          const labels = ['', 'Very Connected', '', 'Connected', '', 'Neutral', '', 'Isolated', '', 'Very Isolated', 'Completely Isolated']
          return `${val} — ${labels[val] || ''}`
        }}
        onChange={val => u('social_isolation_score', val)}
      />
      <SliderField
        label="Face-to-Face Social Hours (per week)"
        description="Time spent in-person with friends or family. Digital interaction doesn't count here."
        value={v.face_to_face_social_hours_weekly} min={0} max={20} step={0.5} unit=" hrs"
        onChange={val => u('face_to_face_social_hours_weekly', val)}
      />
    </>
  )
}

function PerformanceStep({ v, u }) {
  return (
    <>
      <ChoiceGrid
        label="Academic or Work Performance"
        description="How would you rate your performance at school or work lately?"
        options={[
          { value: 'Excellent',     label: 'Excellent',     icon: '🌟' },
          { value: 'Good',          label: 'Good',          icon: '✅' },
          { value: 'Average',       label: 'Average',       icon: '➖' },
          { value: 'Below Average', label: 'Below Average', icon: '⚠️' },
          { value: 'Poor',          label: 'Poor',          icon: '📉' },
          { value: 'Failing',       label: 'Failing',       icon: '❌' },
        ]}
        columns={3}
        value={v.academic_work_performance}
        onChange={val => u('academic_work_performance', val)}
      />
      <SliderField
        label="GPA / Grade Score"
        description="If you're a student, enter your current GPA (0–4 scale). If working, enter your closest equivalent (e.g. 3.5 = good performance)."
        value={v.grades_gpa} min={1.0} max={4.0} step={0.1}
        formatFn={val => val.toFixed(1)}
        onChange={val => u('grades_gpa', val)}
      />
      <SliderField
        label="Work / Study Productivity"
        description="On a scale of 1–10, how productive are you at work or studying on most days?"
        value={v.work_productivity_score} min={1} max={10} step={1}
        formatFn={val => `${val} / 10`}
        onChange={val => u('work_productivity_score', val)}
      />
    </>
  )
}

const STEP_RENDERERS = [ProfileStep, GamingHabitsStep, SleepHealthStep, MentalMoodStep, PhysicalSocialStep, PerformanceStep]

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)
  const [values, setValues] = useState(DEFAULT)
  const [model, setModel] = useState('decision_tree')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (key, val) => setValues(v => ({ ...v, [key]: val }))

  const handleNext = async () => {
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
        if (!res.ok) throw new Error(`Server error: ${res.status}`)
        const data = await res.json()
        setResult(data)
      } catch (e) {
        setError(e.message || 'Failed to connect to the prediction server. Make sure the API is running.')
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
    return <Results result={result} onReset={() => { setResult(null); setStep(0); setValues(DEFAULT) }} />
  }

  const StepComponent = STEP_RENDERERS[step]
  const meta = STEPS_META[step]
  const isLast = step === STEPS_META.length - 1

  return (
    <div className="min-h-screen bg-[#070711] text-white flex flex-col items-center">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none" aria-hidden>
        <div className="absolute -top-60 -left-40 w-96 h-96 bg-purple-900/25 rounded-full blur-[80px]" />
        <div className="absolute -bottom-60 -right-40 w-[30rem] h-[30rem] bg-indigo-900/15 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-10 w-64 h-64 bg-cyan-900/10 rounded-full blur-[60px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#8b5cf6 1px, transparent 1px), linear-gradient(90deg, #8b5cf6 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Header */}
      <header className="w-full max-w-2xl px-4 pt-8 pb-4 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-purple-500/15 border border-purple-500/25">
            <Gamepad2 size={24} className="text-purple-400" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-white">GamingCheck</h1>
            <p className="text-gray-600 text-xs">AI-powered gaming addiction risk assessment</p>
          </div>
          {/* Model picker */}
          <div className="ml-auto">
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-400 outline-none cursor-pointer hover:border-purple-500/30 transition-colors"
            >
              {MODELS.map(m => (
                <option key={m.value} value={m.value} className="bg-[#0d0d1a]">
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Progress bar */}
        <div className="flex gap-1.5 mb-2">
          {STEPS_META.map((_, i) => (
            <motion.div
              key={i}
              className="h-1 flex-1 rounded-full overflow-hidden bg-white/10"
            >
              {i <= step && (
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.4 }}
                />
              )}
            </motion.div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-gray-600">
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
              enter: d  => ({ opacity: 0, x: d > 0 ? 70 : -70 }),
              center:    { opacity: 1, x: 0 },
              exit:  d  => ({ opacity: 0, x: d > 0 ? -70 : 70 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="glass rounded-2xl p-6 shadow-2xl">
              {/* Step header */}
              <div className="flex items-center gap-3.5 mb-6">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${meta.grad} shadow-lg`}>
                  {meta.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight">{meta.title}</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">{meta.subtitle}</p>
                </div>
              </div>

              {/* Fields */}
              <StepComponent v={values} u={update} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Error */}
        {error && (
          <motion.div
            className="mt-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-4 mb-10">
          {step > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleBack}
              className="flex items-center gap-1.5 px-5 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:border-purple-500/30 hover:text-white text-sm font-medium transition-all"
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
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white font-semibold flex-1 text-sm transition-all shadow-lg shadow-purple-900/40 disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                {isLast ? '🎯 Analyze My Risk' : 'Continue'}
                {!isLast && <ChevronRight size={16} />}
              </>
            )}
          </motion.button>
        </div>
      </main>
    </div>
  )
}
