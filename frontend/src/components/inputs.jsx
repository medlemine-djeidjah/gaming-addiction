import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25 },
}

export function SliderField({ label, description, value, min, max, step = 1, unit = '', formatFn, onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  const display = formatFn ? formatFn(value) : `${value}${unit}`

  return (
    <motion.div className="mb-10 sm:mb-14 lg:mb-16" {...fadeUp}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 px-1">
        <div className="flex flex-col gap-1.5 max-w-lg">
          <label className="text-slate-900 font-black text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.2em]">{label}</label>
          {description && (
            <p className="text-slate-400 text-[10px] sm:text-[11px] lg:text-[13px] leading-relaxed font-medium">{description}</p>
          )}
        </div>
        <div className="flex flex-col items-center md:items-end shrink-0">
          <span className="text-amber-600 font-black text-2xl sm:text-3xl lg:text-4xl tabular-nums leading-none mb-1">{display}</span>
          <div className="h-1 w-8 bg-amber-100 rounded-full" />
        </div>
      </div>
      <div className="relative h-8 flex items-center group">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-100 rounded-full appearance-none cursor-pointer accent-amber-600 slider-thumb-amber transition-all hover:h-3"
          style={{
            background: `linear-gradient(to right, #d97706 ${pct}%, #f1f5f9 ${pct}%)`,
          }}
        />
      </div>
    </motion.div>
  )
}

export function ChoiceGrid({ label, description, options, value, onChange, columns = 3 }) {
  // Adaptive grid based on number of options and screen size
  const gridClasses = options.length > 4 
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 lg:grid-cols-5" 
    : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"

  return (
    <motion.div className="mb-10 sm:mb-14 lg:mb-16" {...fadeUp}>
      <div className="mb-8 px-1">
        <label className="text-slate-900 font-black text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.2em] block mb-2">{label}</label>
        {description && (
          <p className="text-slate-400 text-[10px] sm:text-[11px] lg:text-[13px] leading-relaxed font-medium max-w-2xl">{description}</p>
        )}
      </div>
      <div className={`grid ${gridClasses} gap-4 sm:gap-6`}>
        {options.map(opt => (
          <motion.button
            key={opt.value}
            type="button"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(opt.value)}
            className={`py-6 sm:py-8 px-4 rounded-[2rem] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 ${
              value === opt.value
                ? 'border-amber-600 bg-amber-50/20 text-slate-900 shadow-lg shadow-amber-600/5'
                : 'border-slate-50 bg-white text-slate-300 hover:border-slate-200 hover:text-slate-500'
            }`}
          >
            {opt.icon && (
              <div className={`transition-all duration-300 ${value === opt.value ? 'text-amber-600 scale-125' : 'text-slate-200'}`}>
                {opt.icon}
              </div>
            )}
            <div className={`text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-center leading-tight ${value === opt.value ? 'text-slate-900' : ''}`}>
              {opt.label}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function RatingScale({ label, description, options, value, onChange }) {
  return (
    <motion.div className="mb-10 sm:mb-14 lg:mb-16" {...fadeUp}>
      <div className="mb-8 px-1">
        <label className="text-slate-900 font-black text-[10px] sm:text-xs lg:text-sm uppercase tracking-[0.2em] block mb-2">{label}</label>
        {description && (
          <p className="text-slate-400 text-[10px] sm:text-[11px] lg:text-[13px] leading-relaxed font-medium max-w-2xl">{description}</p>
        )}
      </div>
      <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6">
        {options.map(opt => (
          <motion.button
            key={opt.value}
            type="button"
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(opt.value)}
            className={`flex-1 min-w-[60px] sm:min-w-[80px] lg:min-w-[100px] py-4 rounded-2xl border-2 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all duration-300 ${
              value === opt.value
                ? 'border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/10'
                : 'border-slate-50 bg-white text-slate-300 hover:border-slate-200 hover:text-slate-500'
            }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function ToggleRow({ label, description, value, onChange }) {
  return (
    <motion.div
      className={`flex items-center justify-between p-6 sm:p-10 rounded-[2.5rem] border-2 mb-6 cursor-pointer select-none transition-all duration-300 ${
        value
          ? 'border-amber-100 bg-amber-50/20'
          : 'border-slate-50 bg-white hover:border-slate-100'
      }`}
      {...fadeUp}
      onClick={() => onChange(value === 1 ? 0 : 1)}
    >
      <div className="flex-1 pr-6 sm:pr-12">
        <div className="text-slate-900 font-black text-sm sm:text-base lg:text-lg uppercase tracking-tight leading-tight">{label}</div>
        {description && (
          <div className="text-slate-400 text-[10px] sm:text-[11px] lg:text-xs mt-2 leading-relaxed font-bold uppercase tracking-widest opacity-80">{description}</div>
        )}
      </div>
      <div
        className={`relative flex-shrink-0 w-16 sm:w-20 h-8 sm:h-10 rounded-full transition-colors duration-300 ${
          value ? 'bg-amber-600' : 'bg-slate-200'
        }`}
      >
        <motion.div
          className="absolute top-1 w-6 sm:w-8 h-6 sm:h-8 bg-white rounded-full shadow-sm"
          animate={{ x: value ? (typeof window !== 'undefined' && window.innerWidth < 640 ? 36 : 48) : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      </div>
    </motion.div>
  )
}
