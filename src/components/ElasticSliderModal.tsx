import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sliders, Check, X } from 'lucide-react'

interface ElasticSliderModalProps {
  isOpen: boolean
  onClose: () => void
  variables: string[]
  initialValues: Record<string, string>
  onInject: (values: Record<string, string>) => void
}

export const ElasticSliderModal: React.FC<ElasticSliderModalProps> = ({
  isOpen,
  onClose,
  variables,
  initialValues,
  onInject,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [values, setValues] = useState<Record<string, string>>({})

  useEffect(() => {
    if (isOpen) {
      setValues({ ...initialValues })
      setCurrentIndex(0)
    }
  }, [isOpen, initialValues])

  if (!isOpen || variables.length === 0) return null

  const currentVar = variables[currentIndex]
  const isLast = currentIndex === variables.length - 1

  const handleNext = () => {
    if (isLast) {
      onInject(values)
      onClose()
    } else {
      setCurrentIndex((prev) => Math.min(variables.length - 1, prev + 1))
    }
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg bg-slate-900 border-4 border-black p-6 shadow-[8px_8px_0px_#000] font-mono">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-700">
          <div className="flex items-center gap-2">
            <div className="p-1 bg-yellow-300 border border-black shadow-[2px_2px_0px_#000]">
              <Sliders size={18} className="text-slate-950" />
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase text-slate-100 tracking-wide">
                Elastic Variable Injector
              </h3>
              <p className="text-[10px] text-slate-400">
                Step {currentIndex + 1} of {variables.length}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="w-full bg-slate-950 border border-slate-800 h-2 mb-6">
          <div
            className="bg-indigo-400 h-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / variables.length) * 100}%` }}
          />
        </div>

        {/* Variable Slider Content */}
        <div className="min-h-[160px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentVar}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.15 }}
              className="space-y-3"
            >
              <label className="block text-xs font-bold uppercase text-yellow-300">
                Fill Variable: <span className="text-white bg-slate-800 px-1.5 py-0.5 border border-slate-700">[{currentVar}]</span>
              </label>

              <textarea
                rows={3}
                value={values[currentVar] || ''}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [currentVar]: e.target.value,
                  }))
                }
                placeholder={`Enter content or context for [${currentVar}]...`}
                className="w-full p-3 bg-slate-950 border-2 border-slate-700 text-slate-100 text-xs focus:border-indigo-400 focus:outline-none focus:ring-0 shadow-[2px_2px_0px_#000]"
                autoFocus
              />
            </motion.div>
          </AnimatePresence>

          {/* Elastic Navigation */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t-2 border-slate-800">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-bold uppercase border-2 border-black transition-all ${
                currentIndex === 0
                  ? 'bg-slate-800 text-slate-600 border-slate-700 cursor-not-allowed'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700 shadow-[2px_2px_0px_#000]'
              }`}
            >
              <ChevronLeft size={16} />
              Prev
            </button>

            <div className="flex gap-1.5">
              {variables.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-3 h-3 border border-black ${
                    idx === currentIndex
                      ? 'bg-indigo-400'
                      : values[variables[idx]]
                      ? 'bg-emerald-400'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold uppercase border-2 border-black transition-all ${
                isLast
                  ? 'bg-emerald-400 text-slate-950 shadow-[3px_3px_0px_#000] hover:bg-emerald-300'
                  : 'bg-indigo-400 text-slate-950 shadow-[3px_3px_0px_#000] hover:bg-indigo-300'
              }`}
            >
              {isLast ? (
                <>
                  <Check size={16} /> Apply All
                </>
              ) : (
                <>
                  Next <ChevronRight size={16} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
