import React, { useEffect, useRef } from 'react'

interface SplashCursorProps {
  isActive: boolean
}

export const SplashCursor: React.FC<SplashCursorProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!isActive) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    // Fluid particles
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      color: string
      life: number
      maxLife: number
    }

    const particles: Particle[] = []
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#38bdf8', '#facc15']

    const createSplash = (x: number, y: number, count = 8) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4 + 1
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: Math.random() * 12 + 4,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 0,
          maxLife: Math.random() * 40 + 30,
        })
      }
    }

    let mouseX = width / 2
    let mouseY = height / 2

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      createSplash(mouseX, mouseY, 3)
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Autonomous ambient splashes while generating
    const interval = setInterval(() => {
      const rx = mouseX + (Math.random() - 0.5) * 100
      const ry = mouseY + (Math.random() - 0.5) * 100
      createSplash(rx, ry, 4)
    }, 150)

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.25)'
      ctx.fillRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vx *= 0.96
        p.vy *= 0.96
        p.life++

        const progress = p.life / p.maxLife
        const opacity = 1 - progress

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * (1 - progress * 0.5), 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = opacity
        ctx.fill()
        ctx.shadowColor = p.color
        ctx.shadowBlur = 10

        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }

      ctx.globalAlpha = 1.0
      ctx.shadowBlur = 0
      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      clearInterval(interval)
      cancelAnimationFrame(animationFrameId)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
    />
  )
}
