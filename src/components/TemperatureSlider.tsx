import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Thermometer, Zap, Shield, Flame } from 'lucide-react'

interface TemperatureSliderProps {
  value: number
  onChange: (val: number) => void
}

export const TemperatureSlider: React.FC<TemperatureSliderProps> = ({ value, onChange }) => {
  const [isDragging, setIsDragging] = useState(false)

  const getLabel = (val: number) => {
    if (val < 0.3) return { text: 'Precise / Code', color: 'text-cyan-400', icon: Shield }
    if (val < 0.7) return { text: 'Balanced / Writing', color: 'text-indigo-400', icon: Zap }
    return { text: 'Creative / Brainstorm', color: 'text-rose-400', icon: Flame }
  }

  const currentLabel = getLabel(value)
  const LabelIcon = currentLabel.icon

  return (
    <div className="flex flex-col gap-2 p-3 bg-slate-900 border-2 border-slate-800 font-mono">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1.5 text-slate-300">
          <Thermometer size={14} className="text-yellow-400" />
          Creativity / Temperature
        </span>
        <span className={`flex items-center gap-1 font-bold ${currentLabel.color}`}>
          <LabelIcon size={13} />
          {value.toFixed(2)} — {currentLabel.text}
        </span>
      </div>

      {/* Blocky Track & Spring Morphing Thumb */}
      <div className="relative w-full h-8 flex items-center bg-slate-950 border-2 border-slate-800 p-1">
        {/* Track gradient fill */}
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-rose-500 opacity-80"
          style={{ width: `${value * 100}%` }}
        />

        {/* Morphing Thumb */}
        <motion.div
          className="absolute top-0 bottom-0 w-6 bg-yellow-300 border-2 border-black shadow-[2px_2px_0px_#000] cursor-grab active:cursor-grabbing flex items-center justify-center"
          style={{ left: `calc(${value * 100}% - ${value * 24}px)` }}
          animate={{
            scale: isDragging ? 1.15 : 1,
            borderRadius: isDragging ? '8px' : '0px',
            rotate: isDragging ? (value > 0.5 ? 4 : -4) : 0,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          <div className="w-1 h-3 bg-black/80" />
        </motion.div>

        {/* Range Input Overlay */}
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={value}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      <div className="flex justify-between text-[10px] text-slate-400 font-mono uppercase">
        <span>0.0 (Deterministic)</span>
        <span>0.5 (Balanced)</span>
        <span>1.0 (Exploratory)</span>
      </div>
    </div>
  )
}
