import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Terminal, Cpu, FileCode2, ChevronDown, BookOpen } from 'lucide-react'

export interface CategoryTemplate {
  id: string
  title: string
  description: string
  category: string
  variables: string[]
  template: string
}

interface MegaMenuProps {
  onSelectTemplate: (template: CategoryTemplate) => void
}

const CATEGORIES = [
  {
    name: 'LLM Systems & Code',
    icon: Terminal,
    color: 'bg-emerald-400 text-black',
    borderColor: 'border-emerald-500',
    templates: [
      {
        id: 'code-review',
        title: 'Architectural Code Reviewer',
        description: 'Deep code analysis for performance, security, and edge cases.',
        category: 'LLM Systems & Code',
        variables: ['Language', 'Context', 'CodeSnippet'],
        template: 'Review this [Language] snippet for [Context]:\n\n```[Language]\n[CodeSnippet]\n```\nProvide: 1. Critical Bugs 2. Performance Optimizations 3. Refactored Code.',
      },
      {
        id: 'api-designer',
        title: 'REST/GraphQL API Architect',
        description: 'Design robust schema definitions and endpoints with OpenAPI specs.',
        category: 'LLM Systems & Code',
        variables: ['ServiceGoal', 'DataEntities'],
        template: 'Design an API architecture for [ServiceGoal]. Entities involved: [DataEntities]. Include schema definitions, status codes, and error payloads.',
      },
    ],
  },
  {
    name: 'Optimization & Analysis',
    icon: Cpu,
    color: 'bg-indigo-400 text-black',
    borderColor: 'border-indigo-500',
    templates: [
      {
        id: 'token-compressor',
        title: 'Strict Token Minimizer',
        description: 'Compress verbose context into dense high-information instructions.',
        category: 'Optimization & Analysis',
        variables: ['RawPrompt', 'TargetMaxTokens'],
        template: 'Compress the following prompt down to under [TargetMaxTokens] tokens while retaining 100% semantic accuracy:\n\n[RawPrompt]',
      },
      {
        id: 'root-cause',
        title: '5-Whys Root Cause Debugger',
        description: 'Systematic failure diagnosis using iterative reasoning.',
        category: 'Optimization & Analysis',
        variables: ['IncidentSummary', 'SystemLogs'],
        template: 'Analyze incident: [IncidentSummary]. Logs: [SystemLogs]. Apply 5-Whys methodology to reach true root cause and preventive measures.',
      },
    ],
  },
  {
    name: 'Creative & Strategy',
    icon: Sparkles,
    color: 'bg-yellow-300 text-black',
    borderColor: 'border-yellow-400',
    templates: [
      {
        id: 'neo-copywriter',
        title: 'Neo-Brutalist Product Launch',
        description: 'High-impact copy with punchy, stark typography tone.',
        category: 'Creative & Strategy',
        variables: ['ProductName', 'TargetAudience', 'KeyFeature'],
        template: 'Write a bold, neo-brutalist marketing headline and bulleted copy for [ProductName] aimed at [TargetAudience]. Focus heavily on [KeyFeature].',
      },
      {
        id: 'persona-simulator',
        title: 'Skeptical Senior Engineer',
        description: 'Simulate critical adversary feedback prior to production proposals.',
        category: 'Creative & Strategy',
        variables: ['ProposalTopic', 'Constraints'],
        template: 'Act as a principal software engineer who is highly skeptical of unnecessary dependencies. Critique this proposal for [ProposalTopic] given constraints: [Constraints].',
      },
    ],
  },
]

export const MegaMenu: React.FC<MegaMenuProps> = ({ onSelectTemplate }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null)

  return (
    <div className="relative font-mono z-30">
      <div className="flex flex-wrap items-center justify-center gap-3 py-2 px-4 bg-slate-950 border-b-2 border-slate-800">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon
          const isOpen = activeMenu === cat.name
          return (
            <div key={cat.name} className="relative">
              <button
                onClick={() => setActiveMenu(isOpen ? null : cat.name)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-bold uppercase transition-all duration-150 border-2 border-black ${cat.color} shadow-[3px_3px_0px_#000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_#000] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_#000]`}
              >
                <Icon size={14} className="stroke-[2.5]" />
                <span>{cat.name}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[1px]"
                      onClick={() => setActiveMenu(null)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute top-full left-0 mt-3 w-80 md:w-96 z-50 bg-slate-900 border-4 border-black p-4 shadow-[8px_8px_0px_#000]"
                    >
                      <div className="flex items-center justify-between pb-2 mb-3 border-b-2 border-slate-700">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                          <BookOpen size={14} className="text-indigo-400" />
                          {cat.name} Templates
                        </span>
                        <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 border border-slate-700 font-mono">
                          {cat.templates.length} items
                        </span>
                      </div>

                      <div className="space-y-2">
                        {cat.templates.map((tpl) => (
                          <div
                            key={tpl.id}
                            onClick={() => {
                              onSelectTemplate(tpl)
                              setActiveMenu(null)
                            }}
                            className="group cursor-pointer p-2.5 bg-slate-950 border-2 border-slate-800 hover:border-indigo-400 hover:bg-slate-900 transition-all duration-150 shadow-[2px_2px_0px_#000]"
                          >
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 flex items-center gap-1.5">
                                <FileCode2 size={13} className="text-slate-400 group-hover:text-indigo-400" />
                                {tpl.title}
                              </h4>
                              <span className="text-[10px] text-yellow-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                USE →
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                              {tpl.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {tpl.variables.map((v) => (
                                <span
                                  key={v}
                                  className="text-[9px] bg-yellow-300/10 text-yellow-300 border border-yellow-300/30 px-1 py-0.2"
                                >
                                  [{v}]
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
