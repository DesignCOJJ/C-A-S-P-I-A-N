import React, { useRef, useState, useEffect } from 'react'

interface TextPressureProps {
  text: string
  flex?: boolean
  alpha?: boolean
  stroke?: boolean
  width?: boolean
  weight?: boolean
  italic?: boolean
  textColor?: string
  strokeColor?: string
  minFontSize?: number
  className?: string
}

export const TextPressure: React.FC<TextPressureProps> = ({
  text,
  textColor = '#f1f5f9',
  strokeColor = '#ff0000',
  stroke = false,
  minFontSize = 36,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 })
  const [chars, setChars] = useState<string[]>([])

  useEffect(() => {
    const splitChars = text.split('')
    setChars(splitChars)
    charRefs.current = charRefs.current.slice(0, splitChars.length)
  }, [text])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative flex items-center justify-center overflow-hidden py-2 select-none cursor-crosshair ${className}`}
      style={{ fontSize: `${minFontSize}px` }}
    >
      <div className="flex items-center justify-center tracking-tighter uppercase font-black">
        {chars.map((char, index) => {
          let dist = 1000
          let deltaX = 0

          if (containerRef.current && mousePos.x !== -1000) {
            const charEl = charRefs.current[index]
            if (charEl) {
              const charRect = charEl.getBoundingClientRect()
              const containerRect = containerRef.current.getBoundingClientRect()
              const charX = charRect.left - containerRect.left + charRect.width / 2
              const charY = charRect.top - containerRect.top + charRect.height / 2
              deltaX = mousePos.x - charX
              const deltaY = mousePos.y - charY
              dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
            }
          }

          const maxDist = 180
          const effect = Math.max(0, 1 - dist / maxDist)

          const scaleY = 1 + effect * 0.4 - Math.abs(deltaX) * 0.001
          const scaleX = 1 + effect * 0.25
          const skewX = (deltaX / 10) * effect
          const fontWeight = Math.min(900, Math.max(400, Math.floor(400 + effect * 500)))

          return (
            <span
              key={index}
              ref={(el) => {
                charRefs.current[index] = el
              }}
              className="inline-block transition-transform duration-75 ease-out"
              style={{
                color: textColor,
                WebkitTextStroke: stroke ? `1px ${strokeColor}` : undefined,
                fontWeight,
                transform: `scale(${scaleX}, ${scaleY}) skewX(${skewX}deg)`,
                marginRight: char === ' ' ? '0.4em' : '0.02em',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          )
        })}
      </div>
    </div>
  )
}
