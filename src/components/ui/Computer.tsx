import { useState, useRef, useEffect } from 'react'
import image from '/assets/desk/computer.png'
import sound from '/assets/desk/incorrect.mp3'
import clickSound from '/assets/desk/click.mp3'

type Props = {
  close: () => void
  unlock: () => void
}

export default function Computer({ close, unlock }: Props) {
  const [step, setStep] = useState<'boot' | 'login' | 'desktop' | 'folder' | 'locked' | 'content' | 'browser' | 'result'>('boot')
  const [error, setError] = useState('')
  const [text, setText] = useState('')
  const [selectedHistory, setSelectedHistory] = useState('')
  const ref = useRef<HTMLAudioElement | null>(null)
  const clickRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (step === 'boot') {
      const timer = setTimeout(() => {
        setStep('login')
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [step])

  function playClick() {
    if (!clickRef.current) {
      clickRef.current = new Audio(clickSound)
    }
    clickRef.current.currentTime = 0
    clickRef.current.play().catch(() => { })
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
    ref.current.play().catch(() => { })
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

        <div className="absolute inset-[13%_22%_32%_22%] bg-transparent flex flex-col items-center justify-center p-6 mt-6 text-black overflow-hidden pointer-events-auto">

          {step === 'boot' && (
            <div className="text-neutral-800 text-xs tracking-widest animate-pulse">
              booting...
            </div>
          )}

          {step === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-3 items-center w-56">
              <div className="text-[11px] text-neutral-600 tracking-wider">KARI_USER</div>
              <button
                type="submit"
                className="bg-neutral-900 text-white px-4 py-1.5 text-xs hover:bg-neutral-700 transition-colors w-full tracking-wider cursor-pointer"
              >
                LOG IN
              </button>
            </form>
          )}

          {step === 'desktop' && (
            <div className="flex flex-col items-center justify-center w-full h-full p-4 gap-6">
              <div className="flex gap-8 items-center">
                <div
                  onClick={() => { playClick(); setStep('folder'); }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-2xl select-none group-hover:scale-105 transition-transform">📁</span>
                  <span className="text-[11px] text-neutral-900 tracking-widest">LVTHN</span>
                </div>

                <div
                  onClick={() => { playClick(); setStep('browser'); }}
                  className="flex flex-col items-center gap-1.5 cursor-pointer group"
                >
                  <span className="text-2xl select-none group-hover:scale-105 transition-transform">🌐</span>
                  <span className="text-[11px] text-neutral-900 tracking-widest">ZOOGLE</span>
                </div>
              </div>
            </div>
          )}

          {step === 'folder' && (
            <div className="flex flex-col items-start justify-start w-full h-full p-4 gap-4">
              <div className="flex justify-between w-full border-b border-neutral-400 pb-2">
                <span className="text-[11px] text-neutral-800 tracking-wider">LVTHN</span>
                <button onClick={() => { playClick(); setStep('desktop'); }} className="text-[11px] text-neutral-600 hover:text-black cursor-pointer">BACK</button>
              </div>
              <div
                onClick={() => { playClick(); setStep('locked'); }}
                className="flex items-center gap-2 cursor-pointer py-1 px-2 hover:bg-neutral-300/40 w-full"
              >
                <span className="text-xs">📄</span>
                <span className="text-[11px] text-neutral-900 tracking-wider">classified.txt</span>
              </div>
            </div>
          )}

          {step === 'browser' && (
            <div className="flex flex-col items-start justify-between w-full h-full p-3">
              <div className="flex justify-between items-center w-full border-b border-neutral-400 pb-1.5 px-1">
                <span className="text-[11px] font-bold text-neutral-900 tracking-wider">ZOOGLE</span>
                <button onClick={() => { playClick(); setStep('desktop'); }} className="text-[10px] text-neutral-600 hover:text-black cursor-pointer">CLOSE</button>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 w-full my-auto">
                <div className="text-2xl font-bold tracking-widest text-neutral-900">
                  ZOOGLE
                </div>
                <div className="flex flex-col gap-1 w-64">
                  <div className="text-[10px] text-neutral-500 pb-1">SELECT FROM HISTORY:</div>
                  <div
                    onClick={() => { playClick(); setSelectedHistory('cornelis'); setStep('result'); }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer py-1 px-1 bg-white/40 border border-neutral-300 text-center"
                  >
                    cornelis thames
                  </div>
                  <div
                    onClick={() => { playClick(); setSelectedHistory('lvthn'); setStep('result'); }}
                    className="text-[11px] text-blue-600 hover:underline cursor-pointer py-1 px-1 bg-white/40 border border-neutral-300 text-center"
                  >
                    project lvthn what ?
                  </div>
                </div>
              </div>
              <div className="w-full text-right">
                <button onClick={() => { playClick(); setStep('desktop'); }} className="text-[10px] text-neutral-600 hover:text-black cursor-pointer">DESKTOP</button>
              </div>
            </div>
          )}

          {step === 'result' && (
            <div className="flex flex-col items-start justify-between w-full h-full p-3">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex justify-between items-center w-full border-b border-neutral-400 pb-1.5 px-1">
                  <span className="text-[11px] font-bold text-neutral-900 tracking-wider">ZOOGLE RESULTS</span>
                  <button onClick={() => { playClick(); setStep('browser'); }} className="text-[10px] text-neutral-600 hover:text-black cursor-pointer">BACK</button>
                </div>
                <div className="text-[10px] text-neutral-500 border border-neutral-400 px-2 py-1 bg-white/40">
                  https://www.zoogle.arch/results?q={selectedHistory}
                </div>
                <div className="text-xs text-neutral-900 leading-relaxed tracking-wider p-2">
                  {selectedHistory === 'cornelis' ? (
                    <span>The first working submarine was built in 1620 by Cornelis Drebbel, a Dutch inventor working for the British Royal Navy.</span>
                  ) : (
                    <span>Project LVTHN files detail deep-sea architectural experiments conducted beneath the riverbed, combining heavy steel hulls with biological specimens.</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between w-full pt-1 px-1">
                <button onClick={() => { playClick(); setStep('browser'); }} className="text-[10px] text-neutral-600 hover:text-black tracking-wider cursor-pointer">HOME</button>
                <button onClick={() => { playClick(); setStep('desktop'); }} className="text-[10px] text-neutral-600 hover:text-black tracking-wider cursor-pointer">DESKTOP</button>
              </div>
            </div>
          )}

          {step === 'locked' && (
            <div className="flex flex-col items-center justify-center gap-3 w-60">
              <div className="text-[11px] text-neutral-700 tracking-wider">SECURE FILE</div>
              <form onSubmit={handlePassword} className="flex flex-col gap-2 w-full">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="PASSWORD"
                  className="bg-white border border-neutral-400 px-3 py-1.5 text-black text-xs tracking-widest focus:outline-none text-center w-full uppercase placeholder:text-neutral-400"
                  autoFocus
                />
                {error && <div className="text-red-600 text-[10px] text-center tracking-wide">{error}</div>}
                <button
                  type="submit"
                  className="bg-neutral-900 text-white px-4 py-1.5 text-xs hover:bg-neutral-700 transition-colors w-full tracking-wider cursor-pointer"
                >
                  SUBMIT
                </button>
              </form>
              <button onClick={() => { playClick(); setStep('folder'); }} className="text-[10px] text-neutral-600 hover:text-black cursor-pointer mt-1">BACK</button>
            </div>
          )}

          {step === 'content' && (
            <div className="flex flex-col items-start justify-between w-full h-full p-2">
              <div className="text-xs text-neutral-900 leading-relaxed tracking-wider">
                The submarine was a cover. Human subjects were subjected to agonizing biological transmutation. We did not build a machine, we created this weird amalgamation between machine and man. We forged project LVTHN from their cries.
              </div>
              <button
                onClick={() => { playClick(); setStep('desktop'); }}
                className="text-[10px] text-neutral-600 hover:text-black tracking-wider cursor-pointer"
              >
                [CLOSE]
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  )
}