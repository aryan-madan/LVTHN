type props = {
  depth: number
  oxygen: number
}

export default function Meter({ depth, oxygen }: props) {
  return (
    <div className="pointer-events-none fixed top-6 right-6 z-50 flex flex-col gap-2 font-mono text-xs text-cyan-400">
      <div className="bg-black/80 border border-cyan-900/50 p-3 backdrop-blur">
        <div>DEPTH: {Math.floor(depth)}M</div>
        <div className="mt-2 h-2 w-32 bg-zinc-900 overflow-hidden border border-cyan-900/50">
          <div
            className="h-full bg-cyan-400 transition-all duration-75"
            style={{ width: `${Math.max(0, Math.min(100, oxygen))}%` }}
          />
        </div>
        <div className="mt-1 text-[10px] text-cyan-600">OXYGEN RESERVE</div>
      </div>
    </div>
  )
}