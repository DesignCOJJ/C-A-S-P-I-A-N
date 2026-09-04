import React from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingDown } from 'lucide-react'

interface TokenDiffChartProps {
  originalTokens: number
  optimizedTokens: number
  className?: string
}

export const TokenDiffChart: React.FC<TokenDiffChartProps> = ({
  originalTokens,
  optimizedTokens,
  className = '',
}) => {
  const diff = originalTokens - optimizedTokens
  const percentage = originalTokens > 0 ? Math.round((diff / originalTokens) * 100) : 0
  const maxVal = Math.max(originalTokens, optimizedTokens, 1)

  const origWidth = `${Math.min(100, Math.max(8, (originalTokens / maxVal) * 100))}%`
  const optWidth = `${Math.min(100, Math.max(8, (optimizedTokens / maxVal) * 100))}%`

  return (
    <div
      className={`p-4 bg-slate-950 border-2 border-slate-800 font-mono shadow-[4px_4px_0px_#000] ${className}`}
    >
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-indigo-500 border border-black shadow-[2px_2px_0px_#000]">
            <Zap size={14} className="text-black" />
          </div>
          <span className="text-xs font-bold uppercase text-slate-200">
            Token Diff Comparison
          </span>
        </div>

        {diff > 0 && (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2 py-0.5">
            <TrendingDown size={14} />
            {percentage}% SAVED ({diff} TOKENS)
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Original Tokens */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>ORIGINAL INPUT</span>
            <span className="font-bold text-rose-400">{originalTokens} tokens</span>
          </div>
          <div className="w-full h-5 bg-slate-900 border border-slate-800 p-0.5 relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: origWidth }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-rose-500/80 border border-rose-400 shadow-[1px_1px_0px_#000]"
            />
          </div>
        </div>

        {/* Optimized Tokens */}
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>OPTIMIZED PROMPT</span>
            <span className="font-bold text-emerald-400">{optimizedTokens} tokens</span>
          </div>
          <div className="w-full h-5 bg-slate-900 border border-slate-800 p-0.5 relative">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: optWidth }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-emerald-400 border border-emerald-300 shadow-[1px_1px_0px_#000]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
