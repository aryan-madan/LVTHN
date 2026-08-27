import { useState, useEffect, useRef } from 'react'
import clickSound from '../../assets/desk/click.mp3'
import geigerSound from '../../assets/desk/geiger.mp3'
import staticSound from '../../assets/desk/static.mp3'

type Props = {
  close: () => void
}

export default function Radio({ close }: Props) {
  const [targetFreq, setTargetFreq] = useState<number>(104.2)
  const [currentFreq, setCurrentFreq] = useState<number>(88.0)
  const [message, setMessage] = useState(false)

  const clickAudio = useRef<HTMLAudioElement | null>(null)
  const geigerAudio = useRef<HTMLAudioElement | null>(null)
  const staticAudio = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const randomFreq = +(90.0 + Math.random() * 15.0).toFixed(1)
    setTargetFreq(randomFreq)
    clickAudio.current = new Audio(clickSound)
    geigerAudio.current = new Audio(geigerSound)
    if (geigerAudio.current) geigerAudio.current.loop = true

    staticAudio.current = new Audio(staticSound)
    if (staticAudio.current) {
      staticAudio.current.loop = true
      staticAudio.current.play().catch(() => { })
    }

    return () => {
      if (staticAudio.current) staticAudio.current.pause()
      if (geigerAudio.current) geigerAudio.current.pause()
    }
  }, [])

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const newFreq = parseFloat(e.target.value)
    setCurrentFreq(newFreq)

    if (clickAudio.current) {
      clickAudio.current.currentTime = 0
      clickAudio.current.play().catch(() => { })
    }

    if (Math.abs(newFreq - targetFreq) < 0.2) {
      setMessage(true)
      if (staticAudio.current) staticAudio.current.pause()
      if (geigerAudio.current) {
        geigerAudio.current.play().catch(() => { })
      }
    } else {
      setMessage(false)
      if (geigerAudio.current) {
        geigerAudio.current.pause()
        geigerAudio.current.currentTime = 0
      }
      if (staticAudio.current) {
        staticAudio.current.play().catch(() => { })
      }
    }
  }

  function handleClose() {
    if (geigerAudio.current) geigerAudio.current.pause()
    if (staticAudio.current) staticAudio.current.pause()
    close()
  }

  return (
    <div onClick={e => { if (e.target === e.currentTarget) handleClose() }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 font-mono select-none">
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

      <div className="w-[420px] bg-neutral-900 border border-neutral-700 rounded-md overflow-hidden shadow-2xl flex flex-col">

        <div className="flex justify-between items-center bg-neutral-950 px-4 py-2 border-b border-neutral-800 text-xs text-neutral-400">
          <span>RF919</span>
          <button onClick={handleClose} className="hover:text-white px-1">✕</button>
        </div>

        <div className="p-5 flex flex-col gap-4 bg-neutral-900">
          <div className="bg-black border border-neutral-800 rounded p-4 flex flex-col gap-2">
            <div className="text-xs text-neutral-500 flex justify-between">
              <span>FREQUENCY</span>
              <span className="text-cyan-400 text-2xl font-bold display-font">{currentFreq.toFixed(1)} MHz</span>
            </div>

            <div className="h-10 bg-neutral-950 border border-neutral-800 rounded flex items-center px-3 overflow-hidden">
              {message ? (
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
              value={currentFreq}
              onChange={handleSlider}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>
        </div>

      </div>
    </div>
  )
}