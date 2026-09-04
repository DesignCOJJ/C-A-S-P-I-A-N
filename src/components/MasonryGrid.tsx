import React from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Copy } from 'lucide-react'

export interface SummaryPoint {
  id: string
  title: string
  content: string
  tag?: string
}

interface MasonryGridProps {
  data: SummaryPoint[]
  columnCount?: number
  gap?: number
  onCopyPoint?: (text: string) => void
  className?: string
}

export const MasonryGrid: React.FC<MasonryGridProps> = ({
  data,
  columnCount = 3,
  gap = 16,
  onCopyPoint,
  className = '',
}) => {
  // Distribute data into column buckets
  const columns: SummaryPoint[][] = Array.from({ length: columnCount }, () => [])
  data.forEach((item, index) => {
    columns[index % columnCount].push(item)
  })

  return (
    <div
      className={`w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 font-mono ${className}`}
      style={{ gap: `${gap}px` }}
    >
      {columns.map((col, colIdx) => (
        <div key={colIdx} className="flex flex-col gap-4">
          {col.map((point) => (
            <motion.div
              key={point.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 * parseInt(point.id) }}
              className="group relative border-2 border-slate-700 bg-slate-900 p-4 shadow-[3px_3px_0px_#000] hover:border-indigo-400 hover:shadow-[5px_5px_0px_#6366f1] transition-all"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                <span className="text-[10px] font-bold text-yellow-300 uppercase tracking-widest bg-yellow-400/10 px-1.5 py-0.5 border border-yellow-400/30">
                  {point.tag || `KEY POINT #${point.id}`}
                </span>
                {onCopyPoint && (
                  <button
                    onClick={() => onCopyPoint(`${point.title}: ${point.content}`)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 transition-all"
                    title="Copy this key point"
                  >
                    <Copy size={12} />
                  </button>
                )}
              </div>

              <h4 className="text-xs font-bold text-slate-100 mb-1 flex items-center gap-1.5">
                <Sparkles size={12} className="text-indigo-400 shrink-0" />
                {point.title}
              </h4>

              <p className="text-[11px] text-slate-300 leading-relaxed">
                {point.content}
              </p>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  )
}
