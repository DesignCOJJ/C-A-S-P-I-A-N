import React from 'react'

interface MarqueeBannerProps {
  items?: string[]
  speed?: number
  className?: string
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({
  items = [
    'BETA LIVE • PROMPT-BY-YOU.IO',
    'TOKEN OPTIMIZER ACTIVE',
    'HYBRID NEO-BRUTALIST ARCHITECTURE',
    'SYSTEM PROMPT CLARITY ENHANCER',
    'ELASTIC VARIABLE INJECTION V2',
  ],
  className = '',
}) => {
  const content = items.join('   ✦   ')

  return (
    <div
      className={`relative w-full overflow-hidden whitespace-nowrap bg-indigo-400 border-y-2 border-black font-mono font-bold text-slate-950 py-1.5 text-xs uppercase tracking-wider shadow-[0px_2px_0px_#000] z-20 ${className}`}
    >
      <div className="inline-block animate-[marquee_25s_linear_infinite]">
        <span className="mx-4">{content}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{content}</span>
        <span className="mx-4">✦</span>
        <span className="mx-4">{content}</span>
        <span className="mx-4">✦</span>
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  )
}
