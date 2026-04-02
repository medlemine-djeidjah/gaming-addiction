import { motion } from 'framer-motion'
import { RotateCcw, Shield, AlertTriangle, Zap, Skull, CheckCircle } from 'lucide-react'

const RISK_CONFIG = {
  Low:      { color: '#10b981', bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)',  glow: 'rgba(16,185,129,0.4)',  score: 12, icon: <Shield size={32} />,        label: 'Low Risk',      desc: 'Your gaming habits appear healthy. Keep maintaining a balanced lifestyle.' },
  Moderate: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)',  glow: 'rgba(245,158,11,0.4)',  score: 38, icon: <AlertTriangle size={32} />, label: 'Moderate Risk', desc: 'Some warning signs detected. Consider setting clearer boundaries around gaming time.' },
  High:     { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.3)',  glow: 'rgba(249,115,22,0.4)',  score: 65, icon: <Zap size={32} />,           label: 'High Risk',     desc: 'Significant addiction indicators present. It\'s important to seek balance and consider talking to someone.' },
  Severe:   { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  border: 'rgba(239,68,68,0.3)',   glow: 'rgba(239,68,68,0.5)',   score: 90, icon: <Skull size={32} />,          label: 'Severe Risk',   desc: 'Strong signs of gaming addiction detected. We strongly recommend professional support.' },
}

// SVG arc gauge — 240° sweep
const R = 80
const CIRC = 2 * Math.PI * R
const ARC = (240 / 360) * CIRC   // arc length for 240°
const GAP = CIRC - ARC

function Gauge({ score, color }) {
  const filled = (score / 100) * ARC

  return (
    <svg width="200" height="160" viewBox="0 0 200 160">
      {/* Track */}
      <circle
        cx="100" cy="110" r={R}
        fill="none"
        stroke="#1e1e3a"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${ARC} ${GAP}`}
        strokeDashoffset={0}
        transform="rotate(150 100 110)"
      />
      {/* Filled arc */}
      <motion.circle
        cx="100" cy="110" r={R}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={`${ARC} ${CIRC}`}
        initial={{ strokeDashoffset: ARC }}
        animate={{ strokeDashoffset: ARC - filled }}
        transition={{ duration: 1.4, ease: 'easeOut', delay: 0.3 }}
        transform="rotate(150 100 110)"
        filter={`drop-shadow(0 0 8px ${color})`}
      />
      {/* Score text */}
      <text x="100" y="102" textAnchor="middle" fill="white" fontSize="32" fontWeight="800" fontFamily="Inter">
        {score}
      </text>
      <text x="100" y="122" textAnchor="middle" fill="#6b7280" fontSize="11" fontFamily="Inter">
        RISK SCORE
      </text>
    </svg>
  )
}

function ProbBar({ label, value, color, isActive }) {
  const pct = Math.round(value * 100)

  return (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1.5">
        <div className="flex items-center gap-2">
          <div
            className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${isActive ? 'animate-pulse' : ''}`}
            style={{ background: color, boxShadow: isActive ? `0 0 8px ${color}` : 'none' }}
          />
          <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-400'}`}>
            {label}
          </span>
          {isActive && (
            <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: `${color}25`, color }}>
              Predicted
            </span>
          )}
        </div>
        <span className={`text-sm font-bold tabular-nums ${isActive ? 'text-white' : 'text-gray-500'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: isActive ? color : `${color}60` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
        />
      </div>
    </div>
  )
}

const TIPS = {
  Low:      ['Great job! Your gaming habits are healthy.', 'Continue balancing gaming with physical activity.', 'Keep nurturing your real-world social connections.'],
  Moderate: ['Try setting a daily gaming time limit (e.g., 2 hours).', 'Make sure sleep isn\'t being sacrificed for gaming.', 'Schedule regular breaks and offline activities.'],
  High:     ['Consider using app timers to limit daily gaming.', 'Talk to a trusted friend or family member about your habits.', 'Prioritize sleep — aim for 7–8 hours per night.', 'Try replacing one gaming session per day with outdoor activity.'],
  Severe:   ['Please consider speaking with a mental health professional.', 'Gaming addiction is a recognized condition — help is available.', 'Contact resources like the Game Quitters community or a counselor.', 'Set strict daily limits and ask someone to help you stick to them.'],
}

export default function Results({ result, onReset }) {
  const { prediction, probabilities, model_info } = result
  const cfg = RISK_CONFIG[prediction] || RISK_CONFIG.Moderate
  const ORDER = ['Low', 'Moderate', 'High', 'Severe']
  const tips = TIPS[prediction] || []

  return (
    <div className="min-h-screen bg-[#070711] text-white flex flex-col items-center pb-12">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full blur-3xl" style={{ background: `${cfg.color}18` }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ background: `${cfg.color}10` }} />
      </div>

      <div className="w-full max-w-2xl px-4 pt-8 relative z-10">
        {/* Header */}
        <motion.div
          className="flex items-center gap-3 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-3xl">🎮</div>
          <div>
            <h1 className="text-xl font-bold">GamingCheck</h1>
            <p className="text-gray-500 text-xs">Your personalized risk assessment</p>
          </div>
          <button
            onClick={onReset}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 text-gray-400 hover:border-purple-500/30 hover:text-white text-sm transition-all"
          >
            <RotateCcw size={14} />
            Retake
          </button>
        </motion.div>

        {/* Risk badge */}
        <motion.div
          className="rounded-2xl p-6 mb-5 text-center"
          style={{ background: cfg.bg, border: `1px solid ${cfg.border}` }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex justify-center mb-3"
            style={{ color: cfg.color }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {cfg.icon}
          </motion.div>
          <h2 className="text-3xl font-black mb-2" style={{ color: cfg.color }}>
            {cfg.label}
          </h2>
          <p className="text-gray-300 text-sm max-w-md mx-auto leading-relaxed">
            {cfg.desc}
          </p>
          <p className="text-gray-600 text-xs mt-3">
            Analyzed by {model_info?.name || 'AI model'} · {model_info?.accuracy}% accuracy
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          {/* Gauge */}
          <motion.div
            className="glass rounded-2xl p-5 flex flex-col items-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold text-sm mb-2">Risk Meter</h3>
            <Gauge score={cfg.score} color={cfg.color} />
            <div className="flex justify-between w-full text-xs text-gray-600 mt-1 px-2">
              <span>Low</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Severe</span>
            </div>
          </motion.div>

          {/* Probability breakdown */}
          <motion.div
            className="glass rounded-2xl p-5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold text-sm mb-4">Confidence Breakdown</h3>
            {ORDER.map(level => (
              <ProbBar
                key={level}
                label={level}
                value={probabilities[level] ?? 0}
                color={RISK_CONFIG[level]?.color}
                isActive={level === prediction}
              />
            ))}
          </motion.div>
        </div>

        {/* Tips */}
        <motion.div
          className="glass rounded-2xl p-5 mb-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <CheckCircle size={16} style={{ color: cfg.color }} />
            Recommendations
          </h3>
          <div className="space-y-2.5">
            {tips.map((tip, i) => (
              <motion.div
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
              >
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ background: `${cfg.color}25`, color: cfg.color }}
                >
                  {i + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{tip}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Retake CTA */}
        <motion.button
          onClick={onReset}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3.5 rounded-xl font-bold text-white transition-all text-sm"
          style={{
            background: `linear-gradient(135deg, ${cfg.color}cc, ${cfg.color}88)`,
            boxShadow: `0 8px 30px ${cfg.color}30`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Take the assessment again
        </motion.button>
      </div>
    </div>
  )
}
