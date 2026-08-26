import { useState, useEffect, useRef } from 'react'
import Meter from '../components/ui/Meter'

type props = {
  open: () => void
}

export default function Dive({ open }: props) {
  const [depth, setDepth] = useState(0)
  const [oxygen, setOxygen] = useState(100)
  const wrap = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      setDepth(d => {
        const next = Math.max(0, Math.min(5000, d + e.deltaY * 0.5))
        return next
      })
    }

    window.addEventListener('wheel', handleWheel)
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setOxygen(o => {
        if (depth > 1000) {
          const next = o - 0.4
          if (next <= 0) open()
          return next
        } else {
          return Math.min(100, o + 0.8)
        }
      })
    }, 50)
    return () => clearInterval(timer)
  }, [depth, open])

  return (
    <div ref={wrap} className="fixed inset-0 overflow-hidden bg-black select-none">
      <Meter depth={depth} oxygen={oxygen} />
      <div
        className="absolute inset-0 flex items-center justify-center transition-transform duration-75"
        style={{ transform: `translateY(${-depth * 0.2}px)` }}
      >
        <div className="text-center space-y-2 opacity-40">
          <div className="text-xs tracking-widest text-cyan-500">SECTOR ALPHA</div>
          <div className="text-4xl font-bold tracking-tighter">LVTHN</div>
        </div>
      </div>
    </div>
  )
}