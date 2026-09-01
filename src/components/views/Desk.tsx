import { useState, useRef, useEffect } from 'react'
import deskView from '../../assets/desk/desk.png'
import audioSound from '../../assets/desk/audio.mp3'
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
  const [logRead, setLogRead] = useState(false)

  const objectivesContent = `CASE NOTES:
[${audioPlayed ? 'X' : ' '}] Listen to audio tape
[${logRead ? 'X' : ' '}] Inspect the torn log riddle
[${keyFound ? 'X' : ' '}] Find the project key
[${radioFound ? 'X' : ' '}] Inspect radio unit
[${radioFreqFound ? 'X' : ' '}] Find distress frequency
[${computerUnlocked ? 'X' : ' '}] Unlock terminal`

  const [list, setList] = useState<Item[]>([
    { id: '1', name: 'Log', type: 'doc', x: 420, y: 520, icon: 'src/assets/emojis/doc.png', content: '"Four letters carved into the iron hull, followed by the exact year the abyss answered back. Cornelis thought he could control the depths, for James and his Thames."\n\nWARNING: Do not reply.' },
    { id: '2', name: 'Audio', type: 'audio', x: 880, y: 620, icon: 'src/assets/emojis/cassette.png', content: '\n[AUDIO TRANSCRIPT]: Low frequency pulse detected.' },
    { id: '3', name: 'Photo', type: 'photo', x: 280, y: 350, icon: 'src/assets/emojis/photo.png', content: 'https://w0.peakpx.com/wallpaper/203/475/HD-wallpaper-video-game-subnautica.jpg' },
    { id: '4', name: 'Key', type: 'doc', x: 1100, y: 480, icon: 'src/assets/emojis/key.png', content: 'LVTHNXXXX' },
    { id: '5', name: 'Objectives', type: 'doc', x: 1320, y: 220, icon: 'src/assets/emojis/note.png', content: objectivesContent },
    { id: '6', name: 'Radio', type: 'radio', x: 1020, y: 320, icon: 'src/assets/emojis/radio.png', content: 'RADIO_UNIT' },
    { id: '7', name: 'Computer', type: 'computer', x: 720, y: 150, icon: 'src/assets/emojis/computer.png', content: 'COMPUTER_TERMINAL' }
  ])

  useEffect(() => {
    setList(prev => prev.map(i => i.id === '5' ? { ...i, content: objectivesContent } : i))
  }, [objectivesContent])

  const [modalItem, setModalItem] = useState<Item | null>(null)
  const [showRadio, setShowRadio] = useState(false)
  const [showComputer, setShowComputer] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const [size, setSize] = useState(600)
  
  const dragId = useRef<string | null>(null)
  const startPos = useRef({ x: 0, y: 0 })
  const shiftPos = useRef({ x: 0, y: 0 })
  const hasMoved = useRef(false)

  useEffect(() => {
    if (phase !== 'desk') return
    
    let t1 = setTimeout(() => setSize(150), 100)
    let t2 = setTimeout(() => setSize(400), 200)
    let t3 = setTimeout(() => setSize(180), 350)
    let t4 = setTimeout(() => setSize(300), 450)
    let t5 = setTimeout(() => setSize(220), 600)

    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.4) {
        const randomSize = Math.floor(Math.random() * 250) + 100
        setSize(randomSize)
        setTimeout(() => setSize(220), Math.random() * 120 + 50)
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

  function playAudio() {
    setAudioPlayed(true)
    setTimeout(async () => {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const response = await fetch(audioSound)
      const buffer = await response.arrayBuffer()
      const decoded = await audioContext.decodeAudioData(buffer)
      const source = audioContext.createBufferSource()
      source.buffer = decoded
      const gainNode = audioContext.createGain()
      gainNode.gain.value = 3.0
      source.connect(gainNode)
      gainNode.connect(audioContext.destination)
      source.start()
      setTimeout(() => {
        source.stop()
        audioContext.close()
      }, 4000)
    }, 2000)
  }

  function handleMouseDown(e: React.MouseEvent, item: Item) {
    e.stopPropagation()
    dragId.current = item.id
    startPos.current = { x: e.clientX, y: e.clientY }
    shiftPos.current = { x: e.clientX - item.x, y: e.clientY - item.y }
    hasMoved.current = false
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (phase !== 'desk') return
    setPosition({ x: e.clientX, y: e.clientY })

    if (!dragId.current) return
    const distance = Math.hypot(e.clientX - startPos.current.x, e.clientY - startPos.current.y)
    if (distance > 3) hasMoved.current = true
    const newX = e.clientX - shiftPos.current.x
    const newY = e.clientY - shiftPos.current.y
    setList(list.map(i => i.id === dragId.current ? { ...i, x: newX, y: newY } : i))
  }

  function handleMouseUp(item: Item) {
    if (!hasMoved.current) {
      if (item.type === 'audio') {
        playAudio()
      } else if (item.type === 'radio') {
        setShowRadio(true)
        setRadioFound(true)
      } else if (item.type === 'computer') {
        setShowComputer(true)
      } else {
        if (item.id === '1') {
          setLogRead(true)
        }
        if (item.id === '4') {
          setKeyFound(true)
        }
        setModalItem(item)

        if (item.id === '5' && audioPlayed && logRead && keyFound && radioFound && computerUnlocked && radioFreqFound) {
          setTimeout(() => {
            setModalItem(null)
            setPhase('mid')
          }, 400)
        }
      }
    }
    dragId.current = null
  }

  if (phase === 'intro') {
    return (
      <Story 
        text={`PROLOGUE\n\nI've kinda hit a dead end on the whole LVTHN thing. I don't know what I was chasing. It's been days since I've left this room.\n\nI need to piece together what they were hiding here, I can't just stop.\n\nI should probably check my objectives list... Let's get to work. (TIP: SET YOUR VOLUME TO FULL)`}
        label="START"
        next={() => setPhase('desk')} 
      />
    )
  }

  if (phase === 'mid') {
    return (
      <Story 
        text={`APOTHEOSIS\n\nI don't know what I've found. I don't know what to make of it. The Leviathan wasn't a submarine built in 1620, it was something they created. Something biological?\n\nThe anomaly is miles below the surface. I have to see if it's still down there.\n\nI know this might be stupid but this is my last message before I go down there. I love you.`}
        label="DIVE"
        next={() => setPhase('dive')} 
      />
    )
  }

  if (phase === 'dive') {
    return <Dive open={() => setPhase('desk')} />
  }

  return (
    <main
      onMouseMove={handleMouseMove}
      onMouseUp={() => { dragId.current = null }}
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
          src={deskView}
          draggable={false}
          className="w-full h-full object-cover pointer-events-none select-none brightness-25 contrast-125"
        />
      </div>

      {list.map(i => (
        <div
          key={i.id}
          onMouseDown={e => handleMouseDown(e, i)}
          onMouseUp={() => handleMouseUp(i)}
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
          background: `radial-gradient(circle ${size}px at ${position.x}px ${position.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0.95) 80%, rgba(0,0,0,0.99) 100%)`
        }}
      />

      {modalItem && <Modal item={modalItem} close={() => setModalItem(null)} />}
      {showRadio && <Radio close={() => setShowRadio(false)} freq={() => setRadioFreqFound(true)} />}
      {showComputer && <Computer close={() => setShowComputer(false)} unlock={() => setComputerUnlocked(true)} />}
    </main>
  )
}