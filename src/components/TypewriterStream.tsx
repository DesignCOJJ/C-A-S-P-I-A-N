import React, { useState, useEffect } from 'react'

interface TypewriterStreamProps {
  text: string
  speed?: number
  isGenerating?: boolean
  onComplete?: () => void
  className?: string
}

export const TypewriterStream: React.FC<TypewriterStreamProps> = ({
  text,
  speed = 12,
  isGenerating = false,
  onComplete,
  className = '',
}) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    setDisplayedText('')
    if (!text) return

    let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        clearInterval(interval)
        if (onComplete) onComplete()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <div className={`font-mono text-xs leading-relaxed whitespace-pre-wrap ${className}`}>
      {displayedText}
      {(isGenerating || displayedText.length < text.length) && (
        <span className="inline-block w-2.5 h-4 bg-yellow-300 ml-1 align-middle animate-pulse border border-black shadow-[1px_1px_0px_#000]" />
      )}
    </div>
  )
}
