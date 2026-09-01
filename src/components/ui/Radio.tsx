import { useState, useRef, useEffect } from 'react'
import click from '../../assets/desk/click.mp3'
import geiger from '../../assets/desk/geiger.mp3'
import staticAudio from '../../assets/desk/static.mp3'

type Props = {
  close: () => void
  freq: () => void
}

export default function Radio({ close, freq }: Props) {
  const [target] = useState<number>(() => +(90.0 + Math.random() * 15.0).toFixed(1))
  const [current, setCurrent] = useState<number>(88.0)
  const [msg, setMsg] = useState(false)

  const cRef = useRef<HTMLAudioElement | null>(null)
  const gRef = useRef<HTMLAudioElement | null>(null)
  const sRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    cRef.current = new Audio(click)
    gRef.current = new Audio(geiger)
    if (gRef.current) gRef.current.loop = true

    sRef.current = new Audio(staticAudio)
    if (sRef.current) {
      sRef.current.loop = true
      sRef.current.play().catch(() => {})
    }

    return () => {
      if (sRef.current) sRef.current.pause()
      if (gRef.current) gRef.current.pause()
    }
  }, [])

  function slide(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value)
    setCurrent(val)

    if (cRef.current) {
      cRef.current.currentTime = 0
      cRef.current.play().catch(() => {})
    }

    if (Math.abs(val - target) < 0.2) {
      setMsg(true)
      freq()
      if (sRef.current) sRef.current.pause()
      if (gRef.current) {
        gRef.current.play().catch(() => {})
      }
    } else {
      setMsg(false)
      if (gRef.current) {
        gRef.current.pause()
        gRef.current.currentTime = 0
      }
      if (sRef.current) {
        sRef.current.play().catch(() => {})
      }
    }
  }

  function handleClose() {
    if (gRef.current) gRef.current.pause()
    if (sRef.current) sRef.current.pause()
    close()
  }

  return (
    <div 
      onClick={handleClose} 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-mono select-none"
    >
      <style>{`
        @font-face {
          font-family: 'MiniSystem';
          src: url('src/assets/fonts/minisystem.otf') format('opentype');
        }
        .display-font {
          font-family: 'MiniSystem', monospace;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 6s linear infinite;
        }
      `}</style>

      <div 
        onClick={e => e.stopPropagation()}
        className="relative w-[420px] bg-neutral-900 border border-neutral-700 rounded-md overflow-hidden shadow-2xl flex flex-col"
      >

        <div className="p-5 flex flex-col gap-4 bg-neutral-900">
          <div className="bg-black border border-neutral-800 rounded p-4 flex flex-col gap-2">
            <div className="text-xs text-neutral-500 flex justify-between">
              <span>FREQUENCY</span>
              <span className="text-cyan-400 text-2xl font-bold display-font">{current.toFixed(1)} MHz</span>
            </div>

            <div className="h-10 bg-neutral-950 border border-neutral-800 rounded flex items-center px-3 overflow-hidden">
              {msg ? (
                <span className="text-red-400 text-lg font-bold display-font tracking-wider animate-marquee">PLEASE FIND ME, I'M NOT DEAD, LVTHN IS ALIVE</span>
              ) : (
                <span className="text-neutral-600 text-xs tracking-wider">NO SIGNAL</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 bg-neutral-950 border border-neutral-800 rounded p-4">
            <div className="flex justify-between text-[11px] text-neutral-400">
              <span>88 MHz</span>
              <span>108 MHz</span>
            </div>
            <input
              type="range"
              min="88.0"
              max="108.0"
              step="0.1"
              value={current}
              onChange={slide}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>

      </div>
    </div>
  )
}