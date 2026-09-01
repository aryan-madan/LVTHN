import { useState, useRef } from 'react'

type Props = {
  open: () => void
}

const blocks = [
  { text: "I shouldn't have gone down there. I abandoned you.", align: 'text-right ml-auto mr-16' },
  { text: "I got so obsessed with the Leviathan that I forgot about you. I'm sorry.", align: 'text-left ml-24 mr-auto' },
  { text: "I'm almost 5000 meters deep now, I hate myself for this.", align: 'text-center mx-auto' },
  { text: "My hull is cracking so loud, the sonar isn't working either.", align: 'text-left ml-8 mr-auto' },
  { text: "Maybe this creature, whatever it is, doesn't exist? I didn't believe enough.", align: 'text-right ml-auto mr-24' },
  { text: "That's all it is right, belief?", align: 'text-left ml-32 mr-auto' },
  { text: "I was never much of a believer.", align: 'text-right ml-auto mr-12' },
  { text: "I wish I did believe.", align: 'text-center mx-auto' },
  { text: "It doesn't matter now.", align: 'text-left ml-16 mr-auto' },
  { text: "Ah well, I don't know who's reading this.", align: 'text-right ml-auto mr-20' },
  { text: "Farewell friend.", align: 'text-center mx-auto' }
]

export default function Dive({ open: _open }: Props) {
  const [done, setDone] = useState(false)
  const [pct, setPct] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const played = useRef(false)

  function check(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    const top = el.scrollTop
    const max = el.scrollHeight - el.clientHeight
    const val = max > 0 ? top / max : 0
    setPct(val)

    if (top + el.clientHeight >= el.scrollHeight - 10) {
      if (!done) {
        setDone(true)
        if (!played.current) {
          played.current = true
          new Audio('src/assets/dive/death.mp3').play().catch(() => {})
        }
      }
    }
  }

  function finish() {
    const audio = new Audio('src/assets/dive/death.mp3')
    audio.play().catch(() => {})
    audio.onended = () => {
      window.close()
    }
    setTimeout(() => {
      window.close()
    }, 1500)
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center font-mono select-none overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-b from-cyan-500 via-blue-900 to-black pointer-events-none transition-opacity duration-300"
        style={{ opacity: Math.max(0.05, 1 - pct * 1.1) }}
      />
      <div 
        ref={ref}
        onScroll={check}
        className="w-full max-w-4xl h-full overflow-y-scroll px-12 py-[30vh] space-y-64 no-scrollbar scroll-smooth relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {blocks.map((b, i) => (
          <div 
            key={i} 
            className={`text-sm tracking-widest leading-relaxed text-cyan-100 max-w-md drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] ${b.align}`}
          >
            {b.text}
          </div>
        ))}

        {done && (
          <div className="pt-24 pb-32 text-center space-y-6">
            <button
              onClick={finish}
              className="bg-white text-black font-bold px-8 py-3 text-xs tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer rounded shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              FIN
            </button>
          </div>
        )}
      </div>
    </div>
  )
}