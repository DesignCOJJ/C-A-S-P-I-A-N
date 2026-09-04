import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { History, ChevronDown, Clock, Copy, ArrowRight } from 'lucide-react'

export interface HistoryEntry {
  id: string
  timestamp: string
  mode: string
  inputPrompt: string
  outputPrompt: string
  savedTokens?: number
}

interface AccordionHistoryProps {
  entries: HistoryEntry[]
  onSelectEntry: (entry: HistoryEntry) => void
  onCopyText: (text: string) => void
}

export const AccordionHistory: React.FC<AccordionHistoryProps> = ({
  entries,
  onSelectEntry,
  onCopyText,
}) => {
  const [openId, setOpenId] = useState<string | null>(null)

  if (entries.length === 0) return null

  return (
    <div className="p-4 bg-slate-900 border-2 border-slate-800 font-mono shadow-[4px_4px_0px_#000]">
      <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-slate-800">
        <span className="flex items-center gap-2 text-xs font-bold uppercase text-slate-200">
          <History size={15} className="text-indigo-400" />
          Prompt History Logs ({entries.length})
        </span>
        <span className="text-[10px] text-slate-400">Spring math logs</span>
      </div>

      <div className="space-y-2">
        {entries.map((item) => {
          const isOpen = openId === item.id
          return (
            <div
              key={item.id}
              className="border-2 border-slate-800 bg-slate-950 transition-colors hover:border-slate-700"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full flex items-center justify-between p-3 text-left font-mono"
              >
                <div className="flex items-center gap-2 overflow-hidden mr-2">
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 border border-slate-700 bg-slate-900 text-yellow-300 shrink-0">
                    {item.mode}
                  </span>
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {item.inputPrompt.slice(0, 45)}...
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock size={11} />
                    {item.timestamp}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                    className="overflow-hidden border-t-2 border-slate-800 bg-slate-900/90 p-3 space-y-3"
                  >
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">
                        Input Context:
                      </span>
                      <p className="text-xs bg-slate-950 p-2 border border-slate-800 text-slate-300">
                        {item.inputPrompt}
                      </p>
                    </div>

                    <div>
                      <span className="text-[10px] text-indigo-400 uppercase font-bold block mb-1">
                        Enhanced Output:
                      </span>
                      <p className="text-xs bg-slate-950 p-2 border border-slate-800 text-indigo-200 whitespace-pre-wrap">
                        {item.outputPrompt}
                      </p>
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => onCopyText(item.outputPrompt)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold uppercase hover:bg-slate-700"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <button
                        onClick={() => onSelectEntry(item)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-500 text-slate-950 border border-black text-[11px] font-bold uppercase hover:bg-indigo-400 shadow-[2px_2px_0px_#000]"
                      >
                        Load to Editor <ArrowRight size={12} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
