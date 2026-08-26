import { useEffect, useRef, useState } from 'react'

const drain = 0.4
const fill = 0.6

export default function useDive() {
    const [depth, setDepth] = useState(0)
    const [oxygen, setOxygen] = useState(100)
    const last = useRef(0)

    useEffect(() => {
        function scroll() {
            const y = window.scrollY
            const delta = y - last.current
            last.current = y
            if (delta > 0) {
                setDepth(d => Math.max(0, d + delta * 0.5))
                setOxygen(o => Math.max(0, o - delta * drain))
            } else if (delta < 0) {
                setDepth(d => Math.max(0, d + delta * 0.5))
                setOxygen(o => Math.min(100, o - delta * fill))
            }
        }
        window.addEventListener('scroll', scroll)
        return () => window.removeEventListener('scroll', scroll)
    }, [])

    return { depth, oxygen }
}