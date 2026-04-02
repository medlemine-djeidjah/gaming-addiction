import { motion } from 'framer-motion'
import { RotateCcw, Shield, AlertTriangle, Zap, Skull, CheckCircle, Gamepad2 } from 'lucide-react'

const RISK_CONFIG = {
  Low:      { color: '#059669', bg: '#f0fdf4', border: '#bbf7d0', dash: '#10b981', score: 12, icon: <Shield size={32} />,        label: 'Healthy Balance', desc: 'Your gaming habits demonstrate high self-regulation and a low probability of addiction risk.' },
  Moderate: { color: '#d97706', bg: '#fffbeb', border: '#fef3c7', dash: '#f59e0b', score: 38, icon: <AlertTriangle size={32} />, label: 'Mild concern',   desc: 'Analysis indicates emerging behavioral patterns that may require proactive boundary setting.' },
  High:     { color: '#ea580c', bg: '#fff7ed', border: '#ffedd5', dash: '#f97316', score: 65, icon: <Zap size={32} />,           label: 'Elevated Risk',  desc: 'Clinical indicators suggest significant displacement of core lifestyle activities by gaming.' },
  Severe:   { color: '#dc2626', bg: '#fef2f2', border: '#fee2e2', dash: '#ef4444', score: 90, icon: <Skull size={32} />,          label: 'Critical Risk',  desc: 'Diagnostic markers strongly correlate with clinical gaming disorder. Immediate professional intervention is advised.' },
}

// SVG arc gauge — 240° sweep
const R = 80
const CIRC = 2 * Math.PI * R
const ARC = (240 / 360) * CIRC
const GAP = CIRC - ARC

function Gauge({ score, color }) {
  const filled = (score / 100) * ARC

  return (
    <svg width="220" height="180" viewBox="0 0 220 180" className="drop-shadow-sm">
      <defs>
        <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f1f5f9" />
          <stop offset="100%" stopColor="#e2e8f0" />
        </linearGradient>
      </defs>
      {/* Track */}
      <circle
        cx="110" cy="110" r={R}
        fill="none"
        stroke="url(#gaugeGradient)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${ARC} ${GAP}`}
        strokeDashoffset={0}
        transform="rotate(150 110 110)"
      />
      {/* Filled arc */}
      <motion.circle
        cx="110" cy="110" r={R}
        fill="none"
        stroke={color}
        strokeWidth="16"
        strokeLinecap="round"
        strokeDasharray={`${ARC} ${CIRC}`}
        initial={{ strokeDashoffset: ARC }}
        animate={{ strokeDashoffset: ARC - filled }}
        transition={{ duration: 1.8, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
        transform="rotate(150 110 110)"
      />
      {/* Score text */}
      <text x="110" y="105" textAnchor="middle" fill="#0f172a" fontSize="40" fontWeight="900" fontFamily="Inter" className="tracking-tight">
        {score}
      </text>
      <text x="110" y="128" textAnchor="middle" fill="#94a3b8" fontSize="10" fontFamily="Inter" fontWeight="800" className="uppercase tracking-[0.2em]">
        Severity Index
      </text>
    </svg>
  )
}

function ProbBar({ label, value, color, isActive }) {
  const pct = Math.round(value * 100)

  return (
    <div className="mb-5 last:mb-0 group/bar">
      <div className="flex justify-between items-end mb-1.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`w-1 h-3 rounded-full transition-transform duration-500 ${isActive ? 'scale-y-150' : 'opacity-20'}`}
            style={{ background: color }}
          />
          <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
            {label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`text-xs font-black tabular-nums transition-colors duration-300 ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>
            {pct}
          </span>
          <span className="text-[9px] font-bold text-slate-300">%</span>
        </div>
      </div>
      <div className="h-1.5 bg-slate-100/50 rounded-full overflow-hidden p-[1px] relative">
        <motion.div
          className="h-full rounded-full relative z-10"
          style={{ background: isActive ? color : '#cbd5e1' }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "circOut", delay: 0.4 }}
        />
        {isActive && (
          <motion.div 
            className="absolute inset-0 z-0 opacity-20 blur-sm"
            style={{ background: color, width: `${pct}%` }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  )
}

const TIPS = {
  Low:      ['Maintain your current balance of gaming and offline responsibilities.', 'Periodic self-assessment is recommended every 90 days.', 'Continue fostering interpersonal social connections outside digital environments.'],
  Moderate: ['Establish strict parameters for daily engagement windows.', 'Audit sleep patterns to ensure zero gaming interference.', 'Substitute one digital session weekly with a physical/social proxy.'],
  High:     ['Implement hardware-level session timers or application monitoring.', 'Initiate dialogue with peer support groups or family members.', 'Enforce a "Digital Blackout" period 2 hours prior to sleep cycle.'],
  Severe:   ['Consultation with a behavioral salud professional is strongly advised.', 'Gaming Disorder is a clinically recognized condition with evidence-based treatments.', 'Explore intensive digital detoxification resources and specialized counseling.'],
}

export default function Results({ result, onReset }) {
  const { prediction, probabilities, model_info } = result
  const cfg = RISK_CONFIG[prediction] || RISK_CONFIG.Moderate
  const ORDER = ['Low', 'Moderate', 'High', 'Severe']
  const tips = TIPS[prediction] || []

  return (
    <div className="min-h-screen text-slate-800 flex flex-col items-center pb-20 selection:bg-slate-900 selection:text-white transition-colors duration-1000 overflow-x-hidden" style={{ backgroundColor: cfg.bg }}>
      {/* Structural Background Enhancements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[50%] rounded-full blur-[160px] opacity-20 transition-colors duration-1000" style={{ backgroundColor: cfg.color }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[40%] rounded-full blur-[120px] opacity-10 transition-colors duration-1000" style={{ backgroundColor: cfg.color }} />
        <div className="absolute inset-0 bg-[radial-gradient(#000000_1.5px,transparent_1.5px)] [background-size:48px_48px] opacity-[0.02]" />
      </div>

      <div className="w-full max-w-6xl px-6 sm:px-12 pt-8 sm:pt-12 relative z-10">
        {/* Navigation Header - Enhanced Layout */}
        <motion.div
          className="flex flex-col sm:sm:flex-row items-center justify-between gap-8 mb-10 sm:mb-14"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-[1.5rem] bg-slate-900 shadow-xl shadow-slate-900/10 transition-transform hover:scale-110">
              <Gamepad2 size={28} className="text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight uppercase leading-none mb-2">GamingCheck</h1>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Diagnostic Intelligence Report</span>
            </div>
          </div>
          <button
            onClick={onReset}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 transition-all text-xs font-black uppercase tracking-widest shadow-sm hover:shadow-md"
          >
            <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            Initiate New Cycle
          </button>
        </motion.div>

        {/* Primary Insight Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
          
          {/* Main Result Card - High impact on larger screens */}
          <motion.div
            className="lg:col-span-8 bg-white rounded-[3rem] p-8 sm:p-14 border border-slate-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[460px]"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl border-2 mb-6" style={{ borderColor: cfg.border, backgroundColor: `${cfg.color}08` }}>
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: cfg.color }} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: cfg.color }}>
                  Diagnostic Result
                </span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-end gap-6 sm:gap-8 mb-6">
                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-black mb-0 tracking-tighter text-slate-900 uppercase leading-[0.9]">
                  {cfg.label}
                </h2>
                {(prediction === 'Severe' || prediction === 'High') && (
                  <motion.div
                    initial={{ rotate: -10, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: 'spring', delay: 0.5 }}
                    className="p-5 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 shadow-sm"
                  >
                    <Skull size={48} className="lg:size-64" />
                  </motion.div>
                )}
              </div>
              
              <p className="text-slate-400 text-base sm:text-lg leading-relaxed font-medium max-w-2xl mb-8">
                {cfg.desc}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 pt-12 border-t border-slate-50 relative z-10">
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Engine Architecture</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{model_info?.name || 'Neural Matrix Core'}</span>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Validation confidence</span>
                <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{model_info?.accuracy}% Peer-Reviewed Accuracy</span>
              </div>
            </div>
          </motion.div>

          {/* Severity Visualization - Sidebar logic on large screens */}
          <motion.div
            className="lg:col-span-4 flex flex-col gap-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[340px]">
               <Gauge score={cfg.score} color={cfg.color} />
            </div>

            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 border border-white/20 shadow-sm">
              <h3 className="text-slate-900 font-black text-[10px] uppercase tracking-[0.3em] mb-8 opacity-30">Confidence Metrics</h3>
              {ORDER.map(level => (
                <ProbBar
                  key={level}
                  label={level}
                  value={probabilities[level] ?? 0}
                  color={RISK_CONFIG[level]?.color}
                  isActive={level === prediction}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Secondary Insights & Strategy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-10">
          <motion.div
            className="lg:col-span-12 bg-white rounded-[3rem] p-10 sm:p-16 border border-slate-100 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-slate-900 font-black text-xs uppercase tracking-[0.4em] mb-14 flex items-center gap-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: cfg.color }}>
                <CheckCircle size={18} className="stroke-[3]" />
              </div>
              Strategic Behavioral roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tips.map((tip, i) => (
                <motion.div
                  key={i}
                  className="group flex flex-col gap-6 p-8 rounded-[2rem] bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-500"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                >
                  <span className="text-4xl font-black opacity-10 transition-opacity group-hover:opacity-20" style={{ color: cfg.color }}>0{i+1}</span>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-bold">{tip}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Closing Action */}
        <motion.div 
          className="flex flex-col items-center gap-8 pt-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="h-[1px] w-32 bg-slate-200" />
          <button
            onClick={onReset}
            className="group flex flex-col items-center gap-6"
          >
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white shadow-2xl transition-all duration-700 group-hover:bg-amber-500 group-hover:scale-110">
              <RotateCcw size={24} className="group-hover:rotate-180 transition-transform duration-1000" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300 group-hover:text-slate-900 transition-colors">Terminate & Restart Analysis</span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}
