import React from 'react'
import { Tag, Sparkles } from 'lucide-react'

interface VariablePillsProps {
  variables: string[]
  values: Record<string, string>
  onVariableClick?: (variable: string) => void
}

export const VariablePills: React.FC<VariablePillsProps> = ({
  variables,
  values,
  onVariableClick,
}) => {
  if (variables.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-slate-900 border-2 border-slate-800 my-2">
      <span className="flex items-center gap-1 text-[11px] font-mono font-bold uppercase text-slate-400 mr-1">
        <Tag size={12} className="text-yellow-400" />
        Detected Variables ({variables.length}):
      </span>
      {variables.map((varName) => {
        const hasValue = Boolean(values[varName] && values[varName].trim())

        return (
          <button
            key={varName}
            onClick={() => onVariableClick && onVariableClick(varName)}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase transition-all duration-150 border-2 border-black ${
              hasValue
                ? 'bg-yellow-300 text-slate-950 shadow-[2px_2px_0px_#000] hover:bg-yellow-400'
                : 'bg-slate-800 text-yellow-300 border-yellow-400/50 hover:border-yellow-400 hover:bg-slate-700'
            }`}
          >
            <span>[{varName}]</span>
            {hasValue ? (
              <span className="text-[10px] bg-slate-950 text-yellow-300 px-1 py-0.2 rounded-none font-sans">
                ✓ Filled
              </span>
            ) : (
              <Sparkles size={10} className="animate-pulse text-yellow-300" />
            )}
          </button>
        )
      })}
    </div>
  )
}
