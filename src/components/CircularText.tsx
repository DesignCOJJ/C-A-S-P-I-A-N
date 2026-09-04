import React from 'react'

interface CircularTextProps {
  text?: string
  spinDuration?: number
  onHover?: 'speedUp' | 'slowDown' | 'pause'
  className?: string
}

export const CircularText: React.FC<CircularTextProps> = ({
  text = 'TOKEN-OPTIMIZE * ENHANCE-CLARITY * AUTO-SUMMARIZE * ',
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
}) => {
  const letters = text.split('')
  const totalLetters = letters.length
  const deg = 360 / totalLetters

  const getHoverClass = () => {
    switch (onHover) {
      case 'speedUp':
        return 'hover:[animation-duration:5s]'
      case 'slowDown':
        return 'hover:[animation-duration:40s]'
      case 'pause':
        return 'hover:[animation-play-state:paused]'
      default:
        return ''
    }
  }

  return (
    <div className={`relative flex items-center justify-center w-48 h-48 select-none ${className}`}>
      <div
        className={`absolute inset-0 flex items-center justify-center animate-[spin_var(--duration)_linear_infinite] ${getHoverClass()}`}
        style={{ '--duration': `${spinDuration}s` } as React.CSSProperties}
      >
        {letters.map((char, i) => {
          const rotate = deg * i
          return (
            <span
              key={i}
              className="absolute text-xs font-mono font-bold uppercase text-indigo-400 origin-center"
              style={{
                transform: `rotate(${rotate}deg) translateY(-80px)`,
              }}
            >
              {char}
            </span>
          )
        })}
      </div>
      <div className="z-10 flex flex-col items-center justify-center w-24 h-24 rounded-full bg-slate-900 border-2 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)]">
        <span className="text-[10px] font-mono font-bold text-slate-300 tracking-tighter uppercase">PROMPT</span>
        <span className="text-xs font-mono font-black text-indigo-400 uppercase">LAB</span>
      </div>
    </div>
  )
}
