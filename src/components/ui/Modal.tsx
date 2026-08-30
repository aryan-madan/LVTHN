import { useState, useEffect } from 'react'
import paperBg from '../../assets/desk/paper.png'
import cassetteBg from '../../assets/desk/cassette.png'

type Props = {
  item: {
    name: string
    type: string
    content: string
  }
  close: () => void
}

export default function Modal({ item, close }: Props) {
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [size] = useState(250)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  const photoSource = item.type === 'photo' 
    ? 'https://w0.peakpx.com/wallpaper/203/475/HD-wallpaper-video-game-subnautica.jpg' 
    : item.content

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 font-mono cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-black z-0 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">
        {item.type === 'doc' && (
          <div
            style={{ backgroundImage: `url(${paperBg})` }}
            className="relative w-full max-w-lg text-zinc-900 p-10 pl-16 shadow-2xl -rotate-1 bg-cover bg-center cursor-default pointer-events-auto"
          >
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-900 pt-4 font-mono">
              {item.content}
            </div>
          </div>
        )}

        {item.type === 'audio' && (
          <div
            style={{ backgroundImage: `url(${cassetteBg})` }}
            className="relative w-full max-w-2xl aspect-[1.6/1] p-12 pl-20 text-zinc-900 shadow-2xl bg-cover bg-center cursor-default flex flex-col justify-between pointer-events-auto"
          >
            <div className="mt-2 px-6 pl-10 py-1 overflow-y-auto max-h-[45%] text-xs leading-relaxed text-zinc-900 selection:bg-black selection:text-white pointer-events-auto font-mono">
              {item.content}
            </div>
          </div>
        )}

        {item.type === 'photo' && (
          <div className="relative w-auto max-w-[90vw] max-h-[90vh] p-1 shadow-2xl rotate-1 bg-black cursor-default border border-zinc-600 pointer-events-auto">
            <img
              src={photoSource}
              alt="evidence"
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain block border border-zinc-700"
            />
          </div>
        )}
      </div>

      <div
        className="absolute inset-0 z-35 pointer-events-none transition-all duration-75"
        style={{
          background: `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 75%, rgba(0,0,0,0.98) 100%)`
        }}
      />
    </div>
  )
}