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
    <motion.div className="mb-6" {...fadeUp}>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-white font-semibold text-sm">{label}</label>
        <span className="text-orange-400 font-bold text-xl tabular-nums">{display}</span>
      </div>
      {description && (
        <p className="text-neutral-500 text-xs mb-3 leading-relaxed">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{
          background: `linear-gradient(to right, #f97316 ${pct}%, #1c1208 ${pct}%)`,
        }}
      />
      <div className="flex justify-between text-xs text-neutral-600 mt-1">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </motion.div>
  )
}

export function ChoiceGrid({ label, description, options, value, onChange, columns = 3 }) {
  return (
    <motion.div className="mb-6" {...fadeUp}>
      <label className="text-white font-semibold text-sm block mb-1">{label}</label>
      {description && (
        <p className="text-neutral-500 text-xs mb-3 leading-relaxed">{description}</p>
      )}
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {options.map(opt => (
          <motion.button
            key={opt.value}
            type="button"
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(opt.value)}
            className={`py-3 px-2 rounded-xl border text-center transition-all duration-200 ${
              value === opt.value
                ? 'border-orange-500 bg-orange-500/15 text-white shadow-[0_0_20px_rgba(249,115,22,0.25)]'
                : 'border-white/8 bg-white/5 text-neutral-400 hover:border-orange-400/30 hover:text-neutral-200 hover:bg-white/8'
            }`}
          >
            {opt.icon && (
              <div className="mb-1.5 flex justify-center">{opt.icon}</div>
            )}
            <div className="text-xs font-medium leading-snug">{opt.label}</div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}

export function RatingScale({ label, description, options, value, onChange }) {
  return (
    <motion.div className="mb-6" {...fadeUp}>
      <label className="text-white font-semibold text-sm block mb-1">{label}</label>
      {description && (
        <p className="text-neutral-500 text-xs mb-3 leading-relaxed">{description}</p>
      )}
      <div className="flex gap-1.5">
        {options.map(opt => (
          <motion.button
            key={opt.value}
            type="button"
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 px-1 rounded-lg border text-center text-xs font-medium transition-all duration-200 ${
              value === opt.value
                ? 'border-orange-500 bg-gradient-to-b from-orange-500/25 to-orange-600/10 text-white shadow-[0_0_12px_rgba(249,115,22,0.2)]'
                : 'border-white/8 bg-white/5 text-neutral-500 hover:border-orange-400/25 hover:text-neutral-300'
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
      className={`flex items-center justify-between p-4 rounded-xl border mb-3 cursor-pointer select-none transition-all duration-200 ${
        value
          ? 'border-orange-500/40 bg-orange-500/10'
          : 'border-white/8 bg-white/5 hover:border-orange-400/20 hover:bg-white/8'
      }`}
      {...fadeUp}
      onClick={() => onChange(value === 1 ? 0 : 1)}
    >
      <div className="flex-1 pr-4">
        <div className="text-white font-semibold text-sm">{label}</div>
        {description && (
          <div className="text-neutral-500 text-xs mt-0.5 leading-relaxed">{description}</div>
        )}
      </div>
      <div
        className={`relative flex-shrink-0 w-12 h-6 rounded-full transition-colors duration-300 ${
          value ? 'bg-orange-500' : 'bg-neutral-700'
        }`}
      >
        <motion.div
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md"
          animate={{ x: value ? 26 : 4 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </div>
    </motion.div>
  )
}
