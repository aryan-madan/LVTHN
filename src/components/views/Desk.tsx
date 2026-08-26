import { useState, useRef } from 'react'
import view from '../../assets/desk/desk.png'
import Modal from '../ui/Modal'

type item = {
  id: string
  name: string
  type: 'doc' | 'audio' | 'photo'
  x: number
  y: number
  emoji: string
  content: string
}

const initialItems: item[] = [
  { id: '1', name: 'Log', type: 'doc', x: 150, y: 180, emoji: '📄', content: '-150, -164\nSTATUS: LOST\nNOTE: Do not respond.' },
  { id: '2', name: 'Audio', type: 'audio', x: 700, y: 220, emoji: '📼', content: '\n[AUDIO TRANSCRIPT]: Low frequency pulse detected.' },
  { id: '3', name: 'Photo', type: 'photo', x: 450, y: 420, emoji: '🖼️', content: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80' },
  { id: '4', name: 'Key', type: 'doc', x: 250, y: 500, emoji: '🔑', content: 'PROJLVTHN' }
]

export default function Desk() {
  const [items, setItems] = useState<item[]>(initialItems)
  const [open, setOpen] = useState<item | null>(null)
  const draggingId = useRef<string | null>(null)
  const dragStartPos = useRef({ x: 0, y: 0 })
  const offset = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  function handleMouseDown(e: React.MouseEvent, item: item) {
    e.stopPropagation()
    draggingId.current = item.id
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    offset.current = { x: e.clientX - item.x, y: e.clientY - item.y }
    hasMoved.current = false
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!draggingId.current) return
    const dist = Math.hypot(e.clientX - dragStartPos.current.x, e.clientY - dragStartPos.current.y)
    if (dist > 3) hasMoved.current = true
    const newX = e.clientX - offset.current.x
    const newY = e.clientY - offset.current.y
    setItems(items.map(i => i.id === draggingId.current ? { ...i, x: newX, y: newY } : i))
  }

  function handleMouseUp(item: item) {
    if (!hasMoved.current) setOpen(item)
    draggingId.current = null
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseUp={() => { draggingId.current = null }}
      className="relative h-screen w-screen overflow-hidden bg-black select-none font-sans"
    >
      <div className="absolute inset-0 z-0">
        <img
          src={view}
          draggable={false}
          className="w-full h-full object-cover pointer-events-none select-none brightness-60"
        />
      </div>

      {items.map(i => (
        <div
          key={i.id}
          onMouseDown={e => handleMouseDown(e, i)}
          onMouseUp={() => handleMouseUp(i)}
          style={{ transform: `translate(${i.x}px, ${i.y}px)` }}
          className="absolute z-10 flex flex-col items-center cursor-grab active:cursor-grabbing p-2"
        >
          <span className="text-9xl drop-shadow-2xl pointer-events-none">
            {i.emoji}
          </span>
          <span className="text-xs text-white/80 bg-black/60 px-2 py-0.5 mt-1 pointer-events-none">
            {i.name}
          </span>
        </div>
      ))}

      {open && <Modal item={open} close={() => setOpen(null)} />}
    </main>
  )
}