import { useState, useRef, useEffect } from 'react'

type Props = {
    text: string
    label: string
    next: () => void
}

export default function Story({ text, label, next }: Props) {
    const [show, setShow] = useState('')
    const [done, setDone] = useState(false)
    const indexRef = useRef(0)

    useEffect(() => {
        indexRef.current = 0
        setShow('')
        setDone(false)

        const timer = setInterval(() => {
            if (indexRef.current < text.length) {
                setShow(text.slice(0, indexRef.current + 1))
                indexRef.current += 1
            } else {
                setDone(true)
                clearInterval(timer)
            }
        }, 20)

        return () => clearInterval(timer)
    }, [text])

    return (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between p-12 md:p-24 select-none" style={{ fontFamily: '"Geist Mono", monospace' }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:ital,wght@0,100..900;1,100..900&display=swap');
      `}</style>

            <div className="max-w-xl w-full mx-auto flex flex-col justify-center flex-grow">
                <div className="text-zinc-300 text-sm md:text-base leading-loose whitespace-pre-wrap font-normal">
                    {show}
                    {!done && <span className="inline-block w-1.5 h-3.5 bg-zinc-400 ml-1 translate-y-0.5 animate-pulse" />}
                </div>
            </div>

            <div className="max-w-xl w-full mx-auto flex justify-start">
                <div className={`transition-all duration-700 ${done ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                    <button
                        onClick={next}
                        className="text-zinc-400 hover:text-white text-xs tracking-[0.3em] uppercase transition-colors cursor-pointer bg-transparent border-none p-0 font-normal"
                    >
                        [{label}]
                    </button>
                </div>
            </div>
        </div>
    )
}