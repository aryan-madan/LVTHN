import { useEffect, useRef } from 'react'
import Desk from './components/views/Desk'
import clickSound from '/assets/global/clicking.mp3'
import heartSound from '/assets/global/heartbeat.mp3'

export default function App() {
  const clickRef = useRef<HTMLAudioElement | null>(null)
  const heartRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    clickRef.current = new Audio(clickSound)
    clickRef.current.loop = true
    clickRef.current.volume = 0.15

    heartRef.current = new Audio(heartSound)
    heartRef.current.loop = true
    heartRef.current.volume = 0.2

    const start = () => {
      clickRef.current?.play().catch(() => {})
      heartRef.current?.play().catch(() => {})
      window.removeEventListener('click', start)
      window.removeEventListener('keydown', start)
    }

    window.addEventListener('click', start)
    window.addEventListener('keydown', start)

    return () => {
      clickRef.current?.pause()
      heartRef.current?.pause()
      window.removeEventListener('click', start)
      window.removeEventListener('keydown', start)
    }
  }, [])

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <Desk />
    </main>
  )
}