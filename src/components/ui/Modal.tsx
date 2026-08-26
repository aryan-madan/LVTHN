type props = {
  item: {
    name: string
    type: 'doc' | 'audio' | 'photo'
    content: string
  }
  close: () => void
}

export default function Modal({ item, close }: props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm font-sans">
      {item.type === 'doc' && (
        <div className="relative w-full max-w-lg bg-[#f4ebd0] text-zinc-900 p-8 shadow-2xl -rotate-1 border border-[#d2c4ae]">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-400 pb-2">
            <span className="text-sm font-semibold tracking-wide text-zinc-800">file</span>
            <button onClick={close} className="text-xs font-bold text-zinc-600 hover:text-black cursor-pointer">CLOSE</button>
          </div>
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-800">
            {item.content}
          </div>
        </div>
      )}

      {item.type === 'audio' && (
        <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-700 p-6 text-zinc-200 shadow-2xl">
          <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
            <span className="text-xs font-medium tracking-wide text-zinc-300">file</span>
            <button onClick={close} className="text-xs text-zinc-400 hover:text-white cursor-pointer">CLOSE</button>
          </div>
          <div className="bg-black border border-zinc-800 p-4 text-center my-4">
            <div className="text-3xl mb-2">📼</div>
            <div className="text-xs text-zinc-500">PLAYING AUDIO...</div>
          </div>
          <div className="text-xs leading-relaxed text-zinc-400">
            {item.content}
          </div>
        </div>
      )}

      {item.type === 'photo' && (
        <div className="relative w-full max-w-lg bg-[#f0ebd8] p-4 pb-10 shadow-2xl rotate-1 border border-zinc-400">
          <div className="flex justify-between items-center mb-3 border-b border-zinc-300 pb-2">
            <span className="text-xs font-semibold text-zinc-700">file</span>
            <button onClick={close} className="text-xs text-zinc-700 hover:text-black cursor-pointer">CLOSE</button>
          </div>
          <img src={item.content} alt="evidence" className="w-full h-auto filter grayscale contrast-125 border border-zinc-400" />
        </div>
      )}
    </div>
  )
}