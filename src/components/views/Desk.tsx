import { useState, useRef, useEffect } from 'react'
import view from '../../assets/desk/desk.png'
import sound from '../../assets/desk/audio.mp3'
import Modal from '../ui/Modal'
import Radio from '../ui/Radio'
import Computer from '../ui/Computer'
import Dive from './Dive'
import Story from '../ui/Story'

type Item = {
  id: string
  name: string
  type: string
  x: number
  y: number
  icon: string
  content: string
}

export default function Desk() {
  const [phase, setPhase] = useState<'intro' | 'desk' | 'mid' | 'dive'>('intro')
  
  const [audioPlayed, setAudioPlayed] = useState(false)
  const [keyFound, setKeyFound] = useState(false)
  const [radioFound, setRadioFound] = useState(false)
  const [computerUnlocked, setComputerUnlocked] = useState(false)
  const [radioFreqFound, setRadioFreqFound] = useState(false)

  const getObjectivesContent = () => {
    return `CASE NOTES:
[${audioPlayed ? 'X' : ' '}] Listen to audio tape
[${keyFound ? 'X' : ' '}] Find the project key
[${radioFound ? 'X' : ' '}] Inspect radio unit
[${radioFreqFound ? 'X' : ' '}] Find distress frequency
[${computerUnlocked ? 'X' : ' '}] Unlock terminal`
  }

  const [list, set] = useState<Item[]>([
    { id: '1', name: 'Log', type: 'doc', x: 150, y: 180, icon: 'src/assets/emojis/doc.png', content: 'RADIO STATUS: LOST, \nNOTE: Do not respond.' },
    { id: '2', name: 'Audio', type: 'audio', x: 700, y: 220, icon: 'src/assets/emojis/cassette.png', content: '\n[AUDIO TRANSCRIPT]: Low frequency pulse detected.' },
    { id: '3', name: 'Photo', type: 'photo', x: 450, y: 420, icon: 'src/assets/emojis/photo.png', content: 'https://w0.peakpx.com/wallpaper/203/475/HD-wallpaper-video-game-subnautica.jpg' },
    { id: '4', name: 'Key', type: 'doc', x: 250, y: 500, icon: 'src/assets/emojis/key.png', content: 'PROJLVTHN' },
    { id: '5', name: 'Objectives', type: 'doc', x: 850, y: 150, icon: 'src/assets/emojis/note.png', content: '' },
    { id: '6', name: 'Radio', type: 'radio', x: 550, y: 180, icon: 'src/assets/emojis/radio.png', content: 'RADIO_UNIT' },
    { id: '7', name: 'Computer', type: 'computer', x: 350, y: 150, icon: 'src/assets/emojis/computer.png', content: 'COMPUTER_TERMINAL' }
  ])

  useEffect(() => {
    set(prev => prev.map(i => i.id === '5' ? { ...i, content: getObjectivesContent() } : i))
  }, [audioPlayed, keyFound, radioFound, computerUnlocked, radioFreqFound])

  const [modal, mod] = useState<Item | null>(null)
  const [show, vis] = useState(false)
  const [showComp, visComp] = useState(false)
  const [pos, setpos] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [size, setsz] = useState(600)
  
  const drag = useRef<string | null>(null)
  const start = useRef({ x: 0, y: 0 })
  const shift = useRef({ x: 0, y: 0 })
  const moved = useRef(false)

  useEffect(() => {
    if (phase !== 'desk') return
    
    let t1 = setTimeout(() => setsz(150), 100)
    let t2 = setTimeout(() => setsz(400), 200)
    let t3 = setTimeout(() => setsz(180), 350)
    let t4 = setTimeout(() => setsz(300), 450)
    let t5 = setTimeout(() => setsz(220), 600)

    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randomSize = Math.floor(Math.random() * 250) + 100
        setsz(randomSize)
        setTimeout(() => setsz(220), Math.random() * 120 + 50)
      }
    }, 300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
      clearInterval(flickerInterval)
    }
  }, [phase])

  function play() {
    setAudioPlayed(true)
    setTimeout(async () => {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      const res = await fetch(sound)
      const buf = await res.arrayBuffer()
      const dec = await ctx.decodeAudioData(buf)
      const src = ctx.createBufferSource()
      src.buffer = dec
      const gain = ctx.createGain()
      gain.gain.value = 3.0
      src.connect(gain)
      gain.connect(ctx.destination)
      src.start()
      setTimeout(() => {
        src.stop()
        ctx.close()
      }, 4000)
    }, 2000)
  }

  function down(e: React.MouseEvent, item: Item) {
    e.stopPropagation()
    drag.current = item.id
    start.current = { x: e.clientX, y: e.clientY }
    shift.current = { x: e.clientX - item.x, y: e.clientY - item.y }
    moved.current = false
  }

  function move(e: React.MouseEvent) {
    if (phase !== 'desk') return
    setpos({ x: e.clientX, y: e.clientY })

    if (!drag.current) return
    const dist = Math.hypot(e.clientX - start.current.x, e.clientY - start.current.y)
    if (dist > 3) moved.current = true
    const newX = e.clientX - shift.current.x
    const newY = e.clientY - shift.current.y
    set(list.map(i => i.id === drag.current ? { ...i, x: newX, y: newY } : i))
  }

  function up(item: Item) {
    if (!moved.current) {
      if (item.type === 'audio') {
        play()
      } else if (item.type === 'radio') {
        vis(true)
        setRadioFound(true)
      } else if (item.type === 'computer') {
        visComp(true)
      } else {
        if (item.id === '4') {
          setKeyFound(true)
        }
        mod(item)

        if (item.id === '5' && audioPlayed && keyFound && radioFound && computerUnlocked && radioFreqFound) {
          setTimeout(() => {
            mod(null)
            setPhase('mid')
          }, 400)
        }
      }
    }
    drag.current = null
  }

  if (phase === 'intro') {
    return (
      <Story 
        text={`PPROLOGUE\n\nI've kinda hit a dead end on the whole LVTHN thing. I don't know what I was chasing. It's been days since I've left this room.\n\nI need to piece together what they were hiding here, I can't just stop.\n\nI should probably check my objectives list... Let's get to work. (TIP: SET YOUR VOLUME TO FULL)`}
        buttonText="START"
        onNext={() => setPhase('desk')} 
      />
    )
  }

  if (phase === 'mid') {
    return (
      <Story 
        text={`AAPOTHEOSIS\n\nI don't know what I've found. I don't know what to make of it. The Leviathan wasn't a submarine built in 1620, it was something they created. Something biological?\n\nThe anomaly is miles below the surface. I have to see if it's still down there.\n\nI know this might be stupid but this is my last message before I go down there. I love you.`}
        buttonText="DIVE"
        onNext={() => setPhase('dive')} 
      />
    )
  }

  if (phase === 'dive') {
    return <Dive open={() => setPhase('desk')} />
  }

  return (
    <main
      onMouseMove={move}
      onMouseUp={() => { drag.current = null }}
      className="relative h-screen w-screen overflow-hidden bg-black select-none font-sans cursor-crosshair"
    >
      <style>{`
        @font-face {
          font-family: 'RockyBilly';
          src: url('src/assets/fonts/rockybilly.ttf') format('truetype');
        }
        .handwritten {
          font-family: 'RockyBilly', sans-serif;
        }
      `}</style>

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
          <span className="text-sm text-white/90 bg-black/85 border border-white/10 px-2.5 py-0.5 mt-1 pointer-events-none shadow-lg handwritten tracking-wide">
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

      {modal && <Modal item={modal} close={() => mod(null)} />}
      {show && <Radio close={() => vis(false)} onFreqFound={() => setRadioFreqFound(true)} />}
      {showComp && <Computer close={() => visComp(false)} onUnlock={() => setComputerUnlocked(true)} />}
    </main>
  )
}