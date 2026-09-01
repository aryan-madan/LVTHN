import { useState, useEffect } from 'react'

type Props = {
  text: string
  label: string
  next: () => void
}

export default function Story({ text, label, next }: Props) {
  const [show, setShow] = useState('')
  const [done, setDone] = useState(false)
  
  useEffect(() => {
    let i = 0
    setShow('')
    setDone(false)
    const tmr = setInterval(() => {
      if (i < text.length) {
        setShow((p) => p + text.charAt(i))
        i++
      } else {
        clearInterval(tmr)
        setDone(true)
      }
    }, 30)
    return () => clearInterval(tmr)
  }, [text])

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 font-mono select-none">
      <div className="max-w-2xl text-center leading-loose tracking-widest text-sm mb-12 text-white whitespace-pre-wrap min-h-[16rem] flex items-center justify-center">
        {show}
      </div>
      <div className="h-12 flex items-center justify-center">
        {done && (
          <button 
            onClick={next} 
            className="border border-white/30 px-8 py-2 text-white hover:bg-white hover:text-black transition-colors tracking-widest animate-pulse cursor-pointer"
          >
            {label}
          </button>
        )}
      </div>
    </div>
  )
}