import { useState, useRef, useEffect } from 'react'
import view from '../../assets/desk/desk.png'
import Modal from '../ui/Modal'

type Item = {
  id: string
  name: string
  type: string
  x: number
  y: number
  icon: string
  content: string
}

const data: Item[] = [
  { id: '1', name: 'Log', type: 'doc', x: 150, y: 180, icon: 'src/assets/emojis/doc.png', content: '-150, -164\nSTATUS: LOST\nNOTE: Do not respond.' },
  { id: '2', name: 'Audio', type: 'audio', x: 700, y: 220, icon: 'src/assets/emojis/cassette.png', content: '\n[AUDIO TRANSCRIPT]: Low frequency pulse detected.' },
  { id: '3', name: 'Photo', type: 'photo', x: 450, y: 420, icon: 'src/assets/emojis/photo.png', content: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Key', type: 'doc', x: 250, y: 500, icon: 'src/assets/emojis/key.png', content: 'PROJLVTHN' },
  { id: '5', name: 'Objectives', type: 'doc', x: 850, y: 150, icon: 'src/assets/emojis/note.png', content: 'OBJECTIVES:\n[ ] Listen to audio pulse\n[ ] Find the project key\n[ ] Check coordinates on log' }
]

export default function Desk() {
  const [list, setList] = useState<Item[]>(data)
  const [modal, setModal] = useState<Item | null>(null)
  const [pos, setPos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [size, setSize] = useState(600)
  
  const drag = useRef<string | null>(null)
  const start = useRef({ x: 0, y: 0 })
  const shift = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  useEffect(() => {
    let t1 = setTimeout(() => setSize(150), 100)
    let t2 = setTimeout(() => setSize(400), 200)
    let t3 = setTimeout(() => setSize(180), 350)
    let t4 = setTimeout(() => setSize(300), 450)
    let t5 = setTimeout(() => setSize(220), 600)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  function play() {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(600, ctx.currentTime)
    gain.gain.setValueAtTime(0.1, ctx.currentTime)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()

    const pattern = [100, 100, 100, 300, 300, 300, 100, 100, 100]
    let time = ctx.currentTime

    pattern.forEach((dur, idx) => {
      if (idx % 2 === 0) {
        gain.gain.setValueAtTime(0.1, time)
      } else {
        gain.gain.setValueAtTime(0, time)
      }
      time += dur / 1000
    })

    setTimeout(() => {
      osc.stop()
      ctx.close()
    }, (time - ctx.currentTime) * 1000)
  }

  function down(e: React.MouseEvent, item: Item) {
    e.stopPropagation()
    drag.current = item.id
    start.current = { x: e.clientX, y: e.clientY }
    shift.current = { x: e.clientX - item.x, y: e.clientY - item.y }
    moved.current = false
  }

  function move(e: React.MouseEvent) {
    setPos({ x: e.clientX, y: e.clientY })

    if (!drag.current) return
    const dist = Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y)
    if (dist > 3) moved.current = true
    const newX = e.clientX - shift.current.x
    const newY = e.clientY - shift.current.y
    setList(list.map(i => i.id === drag.current ? { ...i, x: newX, y: newY } : i))
  }

  function up(item: Item) {
    if (!moved.current) {
      if (item.type === 'audio') {
        play()
      } else {
        setModal(item)
      }
    }
    drag.current = null
  }

  return (
    <main
      onMouseMove={move}
      onMouseUp={() => { drag.current = null }}
      className="relative h-screen w-screen overflow-hidden bg-black select-none font-sans cursor-crosshair"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={view}
          draggable={false}
          className="w-full h-full object-cover pointer-events-none select-none brightness-25 contrast-125"
        />
      </div>

      {list.map(i => (
        <div
          key={i.id}
          onMouseDown={e => down(e, i)}
          onMouseUp={() => up(i)}
          style={{ transform: `translate(${i.x}px, ${i.y}px)` }}
          className="absolute z-10 flex flex-col items-center cursor-grab active:cursor-grabbing p-2"
        >
          <img
            src={i.icon}
            alt={i.name}
            draggable={false}
            className="w-24 h-24 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.9)] pointer-events-none"
          />
          <span className="text-xs text-white/80 bg-black/85 border border-white/10 px-2 py-0.5 mt-1 pointer-events-none shadow-lg">
            {i.name}
          </span>
        </div>
      ))}

      <div
        className="absolute inset-0 z-20 pointer-events-none transition-all duration-75"
        style={{
          background: `radial-gradient(circle ${size}px at ${pos.x}px ${pos.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 80%, rgba(0,0,0,0.99) 100%)`
        }}
      />

      <div 
        className="absolute inset-0 z-30 pointer-events-none opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 4px), repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 4px)`,
          backgroundSize: '4px 4px'
        }}
      />

      {modal && <Modal item={modal} close={() => setModal(null)} />}
    </main>
  )
}