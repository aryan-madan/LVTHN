import { useState, useRef, useEffect } from 'react'
import image from '../../assets/desk/computer.png'
import sound from '../../assets/desk/incorrect.mp3'
import clickSound from '../../assets/desk/click.mp3'

type Props = {
  close: () => void
  unlock: () => void
}

export default function Computer({ close, unlock }: Props) {
  const [step, setStep] = useState<'boot' | 'login' | 'desktop' | 'folder' | 'locked' | 'content'>('boot')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const ref = useRef<HTMLAudioElement | null>(null)
  const clickRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (step === 'boot') {
      const timer = setTimeout(() => {
        setStep('login')
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [step])

  function playClick() {
    if (!clickRef.current) {
      clickRef.current = new Audio(clickSound)
    }
    clickRef.current.currentTime = 0
    clickRef.current.play().catch(() => {})
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    setStep('desktop')
    setError('')
  }

  function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    playClick()
    if (text.toUpperCase() === 'LVTHN1620') {
      setStep('content')
      unlock()
    } else {
      setError('ACCESS DENIED')
      playErrorSound()
    }
  }

  function playErrorSound() {
    if (!ref.current) {
      ref.current = new Audio(sound)
    }
    ref.current.currentTime = 0
    ref.current.play().catch(() => {})
  }

  return (
    <div 
      onClick={() => { playClick(); close(); }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 font-mono select-none"
    >
      <div 
        onClick={(event) => event.stopPropagation()}
        className="relative w-[95vw] max-w-[1100px] aspect-[1.3/1] flex items-center justify-center"
      >
        <img
          src={image}
          alt="Monitor"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]"
        />

        <div className="absolute inset-[13%_22%_32%_22%] bg-transparent flex flex-col items-center justify-center p-6 text-black overflow-hidden pointer-events-auto">
          
          {step === 'boot' && (
            <div className="text-black text-sm tracking-widest animate-pulse font-bold">
              booting up....
            </div>
          )}

          {step === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-3 items-center w-64">
              <div className="text-xs text-neutral-700 tracking-widest mb-1 font-bold">SYSTEM LOGIN</div>
              <div className="bg-neutral-200 border-2 border-black px-4 py-2 text-black text-xs tracking-widest text-center w-full font-bold">
                USER: Kari
              </div>
              <button 
                type="submit" 
                className="bg-black text-white font-bold px-6 py-2 text-xs hover:bg-neutral-800 transition-colors w-full tracking-wider mt-2 cursor-pointer"
              >
                LOGIN
              </button>
            </form>
          )}

          {step === 'desktop' && (
            <div className="flex flex-col items-start justify-start w-full h-full p-4 gap-6">
              <div className="text-[10px] text-neutral-600 tracking-widest font-bold">DESKTOP USER: KARI</div>
              <div className="flex gap-8">
                <div 
                  onClick={() => { playClick(); setStep('folder'); }}
                  className="flex flex-col items-center gap-1 cursor-pointer group"
                >
                  <div className="w-10 h-8 flex items-center justify-center transition-colors">
                    <span className="text-base text-black font-bold">📁</span>
                  </div>
                  <span className="text-[10px] text-black tracking-wider font-bold">LVTHN</span>
                </div>
              </div>
            </div>
          )}

          {step === 'folder' && (
            <div className="flex flex-col items-start justify-start w-full h-full p-4 gap-4">
              <div className="flex justify-between w-full border-b-2 border-black pb-2">
                <span className="text-[10px] text-black tracking-widest font-bold">DIR: /LVTHN</span>
                <button onClick={() => { playClick(); setStep('desktop'); }} className="text-[10px] text-black font-bold hover:underline cursor-pointer">BACK</button>
              </div>
              <div 
                onClick={() => { playClick(); setStep('locked'); }}
                className="flex items-center gap-2 cursor-pointer p-2 hover:bg-neutral-200/50 rounded w-full"
              >
                <span className="text-xs">📄</span>
                <span className="text-xs text-black tracking-wider font-bold">classified.txt</span>
              </div>
            </div>
          )}

          {step === 'locked' && (
            <div className="flex flex-col items-center justify-center gap-4 w-64">
              <div className="text-xs text-red-700 tracking-wider text-center font-bold">FILE IS LOCKED</div>
              <form onSubmit={handlePassword} className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="ENTER PASSWORD"
                  className="bg-white border-2 border-black px-4 py-2 text-black text-xs tracking-widest focus:outline-none text-center w-full uppercase font-bold placeholder:text-neutral-400"
                  autoFocus
                />
                {error && <div className="text-red-600 text-[10px] text-center tracking-wide font-bold">{error}</div>}
                <button 
                  type="submit" 
                  className="bg-black text-white font-bold px-6 py-2 text-xs hover:bg-neutral-800 transition-colors w-full tracking-wider mt-1 cursor-pointer"
                >
                  SUBMIT
                </button>
              </form>
              <button onClick={() => { playClick(); setStep('folder'); }} className="text-[10px] text-black font-bold hover:underline cursor-pointer">BACK</button>
            </div>
          )}

          {step === 'content' && (
            <div className="flex flex-col items-start justify-between w-full h-full p-4">
              <div className="text-xs text-black font-bold leading-relaxed tracking-wider">
                The submarine was a cover. Human subjects were subjected to agonizing biological transmutation. We did not build a machine, we created this weird amalgamation between machine and man. We forged project LVTHN from their cries.
              </div>
              <button 
                onClick={() => { playClick(); setStep('desktop'); }} 
                className="text-[10px] text-black font-bold tracking-wider hover:underline cursor-pointer"
              >
                [CLOSE FILE]
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}