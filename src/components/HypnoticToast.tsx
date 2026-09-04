import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HypnoticCanvasProps {
  width?: number
  height?: number
  fill?: string
}

export const HypnoticCanvas: React.FC<HypnoticCanvasProps> = ({
  width = 22,
  height = 22,
  fill = '#10b981',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let angle = 0

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate(angle)

      const numRings = 4
      for (let i = 1; i <= numRings; i++) {
        const r = (width / 2.2) * (i / numRings)
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, Math.PI * 1.5)
        ctx.strokeStyle = fill
        ctx.lineWidth = 1.8
        ctx.stroke()
      }

      ctx.restore()
      angle += 0.08
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animationFrameId)
  }, [width, height, fill])

  return <canvas ref={canvasRef} width={width} height={height} className="shrink-0" />
}

interface HypnoticToastProps {
  isVisible: boolean
  message?: string
}

export const HypnoticToast: React.FC<HypnoticToastProps> = ({
  isVisible,
  message = 'COPIED TO CLIPBOARD',
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ type: 'spring', damping: 18, stiffness: 350 }}
          className="fixed top-6 right-6 z-50 flex items-center gap-3 border-2 border-emerald-500 bg-slate-950 p-3 shadow-[4px_4px_0px_#10b981] font-mono select-none"
        >
          <HypnoticCanvas width={22} height={22} fill="#10b981" />
          <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wide">
            {message}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
