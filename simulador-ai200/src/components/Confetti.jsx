import { useEffect, useRef } from 'react'

const COLORS = ['#0078D4', '#38BDF8', '#10B981', '#F59E0B', '#F8FAFC']

// ponytail: canvas de confeti a mano en vez de sumar una dependencia solo para esto.
export default function Confetti() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const particles = Array.from({ length: 140 }, () => ({
      x: Math.random() * width,
      y: -20 - Math.random() * height,
      size: 4 + Math.random() * 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speedY: 2 + Math.random() * 3,
      speedX: -1.5 + Math.random() * 3,
      rotation: Math.random() * 360,
      spin: -6 + Math.random() * 12,
    }))

    let frame
    let elapsed = 0
    const DURATION = 4000

    function draw(delta) {
      elapsed += delta
      ctx.clearRect(0, 0, width, height)
      particles.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX
        p.rotation += p.spin
        if (p.y > height + 20) p.y = -20

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6)
        ctx.restore()
      })
      if (elapsed < DURATION) {
        frame = requestAnimationFrame(() => draw(16))
      } else {
        ctx.clearRect(0, 0, width, height)
      }
    }

    frame = requestAnimationFrame(() => draw(16))

    const handleResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  )
}
