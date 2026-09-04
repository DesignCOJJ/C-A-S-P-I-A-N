import { useState, useEffect } from 'react'
import {
  Sparkles,
  Copy,
  Sliders,
  FileCode,
  Terminal,
  Cpu,
  Play,
  Share2,
} from 'lucide-react'
import confetti from 'canvas-confetti'

import { TextPressure } from './components/TextPressure'
import { MarqueeBanner } from './components/MarqueeBanner'
import { MegaMenu, type CategoryTemplate } from './components/MegaMenu'
import { CircularText } from './components/CircularText'
import { VariablePills } from './components/VariablePills'
import { DropZone } from './components/DropZone'
import { TemperatureSlider } from './components/TemperatureSlider'
import { ElasticSliderModal } from './components/ElasticSliderModal'
import { SplashCursor } from './components/SplashCursor'
import { MasonryGrid, type SummaryPoint } from './components/MasonryGrid'
import { TokenDiffChart } from './components/TokenDiffChart'
import { TypewriterStream } from './components/TypewriterStream'
import { HypnoticToast } from './components/HypnoticToast'
import { AccordionHistory, type HistoryEntry } from './components/AccordionHistory'

type Mode = 'enhance' | 'optimize' | 'summarize'

export function App() {
  const [promptText, setPromptText] = useState<string>(
    'Write a python script to parse logs and find error codes. Explain how to run it.'
  )
  const [variableValues, setVariableValues] = useState<Record<string, string>>({})
  const [detectedVars, setDetectedVars] = useState<string[]>([])
  const [temperature, setTemperature] = useState<number>(0.4)
  const [activeMode, setActiveMode] = useState<Mode>('enhance')

  // Generation & State Management
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [outputResult, setOutputResult] = useState<string>('')
  const [summaryPoints, setSummaryPoints] = useState<SummaryPoint[]>([])
  const [originalTokens, setOriginalTokens] = useState<number>(0)
  const [optimizedTokens, setOptimizedTokens] = useState<number>(0)

  // Interactive Modals & Tooltips
  const [isVariableModalOpen, setIsVariableModalOpen] = useState<boolean>(false)
  const [showToast, setShowToast] = useState<boolean>(false)
  const [toastMessage, setToastMessage] = useState<string>('COPIED TO CLIPBOARD')

  // History Log
  const [history, setHistory] = useState<HistoryEntry[]>([])

  // Parse [Variable] tags whenever promptText changes
  useEffect(() => {
    const matches = Array.from(promptText.matchAll(/\[(.*?)\]/g))
      .map((m) => m[1].trim())
      .filter((v) => v.length > 0)

    const uniqueVars = Array.from(new Set(matches))
    setDetectedVars(uniqueVars)
  }, [promptText])

  const triggerToast = (msg = 'COPIED TO CLIPBOARD') => {
    setToastMessage(msg)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    triggerToast('COPIED TO CLIPBOARD')
  }

  // Handle template selection from MegaMenu
  const handleSelectTemplate = (tpl: CategoryTemplate) => {
    setPromptText(tpl.template)
    setVariableValues({})
    setOutputResult('')
    setSummaryPoints([])
    triggerToast(`LOADED: ${tpl.title.toUpperCase()}`)
  }

  // Handle context file drop
  const handleFileContent = (content: string, filename: string) => {
    setPromptText((prev) => `${prev}\n\n--- FILE CONTEXT: ${filename} ---\n${content}`)
    triggerToast(`ATTACHED: ${filename.toUpperCase()}`)
  }

  // Calculate approximate token count (roughly 3.8 chars per token)
  const countTokens = (str: string) => {
    if (!str) return 0
    return Math.max(1, Math.round(str.trim().length / 3.8))
  }

  // Process / Enhance / Optimize / Summarize engine execution
  const handleRunProcessing = () => {
    if (!promptText.trim()) return

    setIsGenerating(true)
    setOutputResult('')
    setSummaryPoints([])

    // Interpolate variable values into prompt string
    let finalInput = promptText
    detectedVars.forEach((v) => {
      if (variableValues[v]) {
        finalInput = finalInput.replaceAll(`[${v}]`, variableValues[v])
      }
    })

    const inputTokenCount = countTokens(finalInput)
    setOriginalTokens(inputTokenCount)

    setTimeout(() => {
      let generatedText = ''
      let estTokens = 0

      if (activeMode === 'enhance') {
        generatedText = `[SYSTEM INSTRUCTION: HIGH CLARITY & EXACTNESS]\n\nRole: Senior Systems Architect & Prompt Engineer\nTemperature Constraint: ${temperature.toFixed(
          2
        )}\n\nObjective:\n${finalInput}\n\nExecution Strategy:\n1. Break down steps methodically.\n2. Include edge case handling and error verification.\n3. Output formatted Markdown with explicit code snippets where applicable.\n4. Validate output before responding.`
        estTokens = countTokens(generatedText)
      } else if (activeMode === 'optimize') {
        generatedText = `ACT AS SENIOR DEV. EXECUTE:\n${finalInput
          .replace(/\b(please|kindly|could you|would you mind|i want you to)\b/gi, '')
          .replace(/\s+/g, ' ')}\n\nRULES: Dense concise output. Zero fluff. Code only.`
        estTokens = Math.max(10, Math.round(inputTokenCount * 0.45))
      } else if (activeMode === 'summarize') {
        const points: SummaryPoint[] = [
          {
            id: '1',
            title: 'Core System Objective',
            tag: 'PURPOSE',
            content: `Primary focus: ${finalInput.slice(0, 70)}...`,
          },
          {
            id: '2',
            title: 'Key Operational Constraints',
            tag: 'CONSTRAINTS',
            content: `Configured temperature: ${temperature.toFixed(
              2
            )}. Requires deterministic error handling and validation logic.`,
          },
          {
            id: '3',
            title: 'Variable Injection State',
            tag: 'VARIABLES',
            content:
              detectedVars.length > 0
                ? `Injecting ${detectedVars.length} parameters: ${detectedVars
                    .map((v) => `[${v}]`)
                    .join(', ')}.`
                : 'No dynamic template variables detected. Static prompt context.',
          },
          {
            id: '4',
            title: 'Token Economy Impact',
            tag: 'EFFICIENCY',
            content: `Estimated token reduction: ~${Math.round(
              inputTokenCount * 0.35
            )} tokens saved compared to un-structured system prompts.`,
          },
          {
            id: '5',
            title: 'Execution Directives',
            tag: 'DIRECTIVE',
            content:
              'Stream responses using block cursor terminal output with fail-safe fallback options.',
          },
        ]
        setSummaryPoints(points)
        generatedText = points.map((p) => `• ${p.title}: ${p.content}`).join('\n\n')
        estTokens = countTokens(generatedText)
      }

      setOptimizedTokens(estTokens)
      setOutputResult(generatedText)
      setIsGenerating(false)

      // Add to history log
      const newEntry: HistoryEntry = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        mode: activeMode.toUpperCase(),
        inputPrompt: finalInput,
        outputPrompt: generatedText,
        savedTokens: Math.max(0, inputTokenCount - estTokens),
      }

      setHistory((prev) => [newEntry, ...prev.slice(0, 9)])

      // Trigger confetti celebration on optimization completion
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#6366f1', '#10b981', '#facc15'],
      })
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono relative selection:bg-indigo-500 selection:text-black">
      {/* SVG Noise Overlay */}
      <div className="noise-overlay" />

      {/* WebGL Splash Cursor Simulation during Active Generation */}
      <SplashCursor isActive={isGenerating} />

      {/* Copied Toast Overlay */}
      <HypnoticToast isVisible={showToast} message={toastMessage} />

      {/* Header & Logo with TextPressure */}
      <header className="border-b-2 border-slate-800 bg-slate-950 pb-4 shadow-[0px_4px_0px_#000] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 pt-3 flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="w-full md:w-auto">
            <TextPressure
              text="prompt-by-you.io"
              textColor="#f8fafc"
              strokeColor="#6366f1"
              minFontSize={28}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 border border-emerald-500/50 px-2 py-1 shadow-[2px_2px_0px_#000]">
              SYSTEM READY • V2.4
            </span>
            <button
              onClick={() => handleCopy(promptText)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-yellow-300 text-slate-950 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400 active:translate-x-[1px] active:translate-y-[1px]"
            >
              <Share2 size={13} /> SHARE
            </button>
          </div>
        </div>
      </header>

      {/* Marquee Banner */}
      <MarqueeBanner />

      {/* Mega Menu Dropdowns */}
      <MegaMenu onSelectTemplate={handleSelectTemplate} />

      {/* Main Studio Area */}
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Top Hero / Intro Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-900 border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
          <div className="md:col-span-2 space-y-2">
            <div className="inline-block bg-indigo-400 text-slate-950 font-bold text-xs uppercase px-2 py-0.5 border border-black shadow-[2px_2px_0px_#000]">
              HYBRID NEO-BRUTALIST ARCHITECTURE
            </div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white">
              Surgically Engineered Prompts for LLM Efficiency
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combine harsh, structural brutalist interface controls with fluid WebGL physics,
              elastic variable injection, and automated token compression.
            </p>
          </div>

          <div className="flex justify-center md:justify-end">
            <CircularText
              text="TOKEN-OPTIMIZE * ENHANCE-CLARITY * AUTO-SUMMARIZE * "
              spinDuration={18}
              onHover="speedUp"
            />
          </div>
        </div>

        {/* Studio Workspace - Editor & Output */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel: Editor & Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border-4 border-black p-5 shadow-[6px_6px_0px_#000]">
              {/* Mode Selectors */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-800">
                <span className="text-xs font-bold uppercase text-slate-300 flex items-center gap-1.5">
                  <Terminal size={15} className="text-indigo-400" />
                  Editor Mode
                </span>
                <div className="flex gap-1">
                  {(['enhance', 'optimize', 'summarize'] as Mode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveMode(mode)}
                      className={`px-2.5 py-1 text-[11px] font-bold uppercase border-2 border-black transition-all ${
                        activeMode === mode
                          ? 'bg-indigo-400 text-slate-950 shadow-[2px_2px_0px_#000]'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected Variable Pills & Elastic Modal Trigger */}
              {detectedVars.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <VariablePills
                      variables={detectedVars}
                      values={variableValues}
                      onVariableClick={() => setIsVariableModalOpen(true)}
                    />
                  </div>
                  <button
                    onClick={() => setIsVariableModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-1.5 bg-yellow-300 text-slate-950 font-bold text-xs uppercase border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-yellow-400"
                  >
                    <Sliders size={14} /> Open Elastic Variable Injector ({detectedVars.length})
                  </button>
                </div>
              )}

              {/* Prompt Input Textarea */}
              <div className="relative">
                <textarea
                  rows={8}
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  placeholder="Enter your system prompt or user query here. Use [VariableName] for dynamic inputs..."
                  className="w-full p-4 bg-slate-950 border-2 border-slate-700 text-slate-100 text-xs focus:border-indigo-400 focus:outline-none focus:ring-0 shadow-[3px_3px_0px_#000] font-mono leading-relaxed"
                />
                <span className="absolute bottom-3 right-3 text-[10px] text-slate-500 bg-slate-900 px-1.5 py-0.5 border border-slate-800 font-mono">
                  ~{countTokens(promptText)} tokens
                </span>
              </div>

              {/* Context Drag & Drop File Upload */}
              <div className="mt-4">
                <DropZone onFileContent={handleFileContent} />
              </div>

              {/* Temperature & Creativity Slider */}
              <div className="mt-4">
                <TemperatureSlider value={temperature} onChange={setTemperature} />
              </div>

              {/* Execute Button */}
              <div className="mt-5">
                <button
                  onClick={handleRunProcessing}
                  disabled={isGenerating}
                  className={`w-full py-3 px-6 flex items-center justify-center gap-2 text-sm font-bold uppercase border-4 border-black transition-all ${
                    isGenerating
                      ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-wait'
                      : 'bg-emerald-400 text-slate-950 shadow-[6px_6px_0px_#000] hover:bg-emerald-300 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000]'
                  }`}
                >
                  {isGenerating ? (
                    <>
                      <Sparkles size={18} className="animate-spin text-yellow-400" />
                      COMPUTING & OPTIMIZING...
                    </>
                  ) : (
                    <>
                      <Play size={18} fill="currentColor" />
                      RUN {activeMode.toUpperCase()} MODE
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel: Output & Visualizations */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border-4 border-black p-5 shadow-[6px_6px_0px_#000] min-h-[500px] flex flex-col justify-between">
              <div>
                {/* Header Output Controls */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b-2 border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="p-1 bg-indigo-500 border border-black shadow-[2px_2px_0px_#000]">
                      <Cpu size={14} className="text-black" />
                    </span>
                    <span className="text-xs font-bold uppercase text-slate-200">
                      Optimized Output Stream ({activeMode})
                    </span>
                  </div>

                  {outputResult && (
                    <button
                      onClick={() => handleCopy(outputResult)}
                      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-slate-800 text-emerald-400 border border-emerald-500/50 hover:bg-slate-700"
                    >
                      <Copy size={12} /> COPY OUTPUT
                    </button>
                  )}
                </div>

                {/* Token Diff Chart */}
                {originalTokens > 0 && optimizedTokens > 0 && (
                  <div className="mb-4">
                    <TokenDiffChart
                      originalTokens={originalTokens}
                      optimizedTokens={optimizedTokens}
                    />
                  </div>
                )}

                {/* Skeleton Pulse Loaders during Generation */}
                {isGenerating && (
                  <div className="space-y-3 py-4">
                    <div className="animate-pulse bg-slate-800 border-2 border-slate-700 h-8 w-3/4 shadow-[2px_2px_0px_#000]" />
                    <div className="animate-pulse bg-slate-800 border-2 border-slate-700 h-20 w-full shadow-[2px_2px_0px_#000]" />
                    <div className="animate-pulse bg-slate-800 border-2 border-slate-700 h-14 w-5/6 shadow-[2px_2px_0px_#000]" />
                  </div>
                )}

                {/* Masonry Grid View for Summarize Mode */}
                {!isGenerating && activeMode === 'summarize' && summaryPoints.length > 0 && (
                  <div className="mt-3">
                    <MasonryGrid
                      data={summaryPoints}
                      columnCount={2}
                      gap={12}
                      onCopyPoint={(text) => handleCopy(text)}
                    />
                  </div>
                )}

                {/* Typewriter Stream View for Enhance / Optimize Modes */}
                {!isGenerating && activeMode !== 'summarize' && outputResult && (
                  <div className="p-4 bg-slate-950 border-2 border-slate-800 shadow-[3px_3px_0px_#000] text-indigo-200">
                    <TypewriterStream
                      text={outputResult}
                      isGenerating={isGenerating}
                      speed={10}
                    />
                  </div>
                )}

                {/* Empty State Showcase */}
                {!isGenerating && !outputResult && summaryPoints.length === 0 && (
                  <div className="flex flex-col items-center justify-center p-12 text-center text-slate-500 space-y-3 border-2 border-dashed border-slate-800 bg-slate-950/50">
                    <FileCode size={36} className="text-slate-600" />
                    <p className="text-xs font-bold uppercase text-slate-400">
                      No output generated yet
                    </p>
                    <p className="text-[11px] text-slate-500 max-w-xs">
                      Enter or load a prompt template on the left, tweak parameters, and hit RUN MODE.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              {outputResult && !isGenerating && (
                <div className="pt-4 border-t-2 border-slate-800 flex justify-between items-center mt-4">
                  <span className="text-[10px] text-slate-400 uppercase">
                    Status: <span className="text-emerald-400 font-bold">READY TO COPY</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCopy(outputResult)}
                      className="px-3 py-1.5 text-xs font-bold uppercase bg-emerald-400 text-slate-950 border-2 border-black shadow-[3px_3px_0px_#000] hover:bg-emerald-300"
                    >
                      COPY PROMPT
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* History Log Section */}
        {history.length > 0 && (
          <div className="mt-8">
            <AccordionHistory
              entries={history}
              onSelectEntry={(entry) => {
                setPromptText(entry.inputPrompt)
                setOutputResult(entry.outputPrompt)
                triggerToast('LOADED HISTORY ENTRY')
              }}
              onCopyText={(text) => handleCopy(text)}
            />
          </div>
        )}
      </main>

      {/* Elastic Variable Injection Wizard Modal */}
      <ElasticSliderModal
        isOpen={isVariableModalOpen}
        onClose={() => setIsVariableModalOpen(false)}
        variables={detectedVars}
        initialValues={variableValues}
        onInject={(newValues) => {
          setVariableValues(newValues)
          triggerToast('VARIABLES INJECTED')
        }}
      />
    </div>
  )
}

export default App
