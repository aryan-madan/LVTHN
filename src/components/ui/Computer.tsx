import { useState, useRef } from 'react'
import compImage from '../../assets/desk/computer.png'
import incorrectSound from '../../assets/desk/incorrect.mp3'

type Props = {
  close: () => void
  onUnlock?: () => void
}

export default function Computer({ close, onUnlock }: Props) {
  const [text, setText] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const incorrectAudio = useRef<HTMLAudioElement | null>(null)

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault()
    if (text.toUpperCase() === 'PROJLVTHN') {
      setUnlocked(true)
      if (onUnlock) onUnlock()
    } else {
      if (!incorrectAudio.current) {
        incorrectAudio.current = new Audio(incorrectSound)
      }
      incorrectAudio.current.currentTime = 0
      incorrectAudio.current.play().catch(() => {})
    }
  }

  return (
    <div 
      onClick={close}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 font-mono select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-[95vw] max-w-[1100px] aspect-[1.3/1] flex items-center justify-center"
      >
        <img
          src={compImage}
          alt="Computer Monitor"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]"
        />

        <div className="absolute inset-[13%_22%_32%_22%] bg-transparent flex flex-col items-center justify-center p-6 text-black overflow-hidden pointer-events-auto">
          
          {!unlocked ? (
            <form onSubmit={handleUnlock} className="flex flex-col gap-3 items-center">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="PASSWORD"
                className="bg-white border-2 border-black px-4 py-2 text-black text-base tracking-widest uppercase focus:outline-none text-center w-64 font-bold"
              />
              <button 
                type="submit" 
                className="bg-black text-white font-bold px-6 py-2 text-sm hover:bg-neutral-800 transition-colors w-full"
              >
                DONE
              </button>
            </form>
          ) : (
            <div className="font-bold text-center text-black text-sm leading-relaxed max-w-md">
              The submarine was a cover. Human subjects were subjected to agonizing biological transmutation. We did not build a machine, we created this weird amalgamation between machine and man. We forged project LVTHN from their cries.
            </div>
          )}

        </div>

      </div>
    </div>
  )
}