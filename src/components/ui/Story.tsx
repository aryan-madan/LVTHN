import { useState, useRef, useEffect } from 'react'

type Props = {
  text: string
  label: string
  next: () => void
}

export default function Story({ text, label, next }: Props) {
  const [show, setShow] = useState('')
  const [done, setDone] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    indexRef.current = 0
    setShow('')
    setDone(false)

    const timer = setInterval(() => {
      if (indexRef.current < text.length) {
        const currentChar = text.charAt(indexRef.current)
        setShow(prev => prev + currentChar)
        indexRef.current += 1
      } else {
        setDone(true)
        clearInterval(timer)
      }
    }, 25)

    return () => clearInterval(timer)
  }, [text])

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-8 font-mono select-none">
      <div className="max-w-2xl w-full flex flex-col gap-8">
        <div className="text-cyan-100 text-sm md:text-base leading-relaxed tracking-wider whitespace-pre-wrap min-h-[220px] drop-shadow-[0_0_10px_rgba(34,211,238,0.3)]">
          {show}
          {!done && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse" />}
        </div>

        <div className={`transition-opacity duration-500 ${done ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <button
            onClick={next}
            className="bg-white text-black font-bold px-8 py-3 text-xs tracking-widest hover:bg-neutral-200 transition-colors cursor-pointer rounded shadow-[0_0_20px_rgba(255,255,255,0.4)]"
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  )
}