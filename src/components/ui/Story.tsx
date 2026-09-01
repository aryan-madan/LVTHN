import { useState, useEffect } from 'react'

type Props = {
  text: string
  buttonText: string
  onNext: () => void
}

export default function Story({ text, buttonText, onNext }: Props) {
  const [displayed, setDisplayed] = useState('')
  const [isFinished, setIsFinished] = useState(false)
  
  useEffect(() => {
    let i = 0
    setDisplayed('')
    setIsFinished(false)
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
        setIsFinished(true)
      }
    }, 30)
    return () => clearInterval(timer)
  }, [text])

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center p-8 font-mono select-none">
      <div className="max-w-2xl text-center leading-loose tracking-widest text-sm mb-12 text-white whitespace-pre-wrap min-h-[16rem] flex items-center justify-center">
        {displayed}
      </div>
      <div className="h-12 flex items-center justify-center">
        {isFinished && (
          <button 
            onClick={onNext} 
            className="border border-white/30 px-8 py-2 text-white hover:bg-white hover:text-black transition-colors tracking-widest animate-pulse cursor-pointer"
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  )
}