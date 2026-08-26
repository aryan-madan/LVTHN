import paperBg from '../../assets/desk/paper.png'
import cassetteBg from '../../assets/desk/cassette.png'

type props = {
  item: {
    name: string
    type: 'doc' | 'audio' | 'photo'
    content: string
  }
  close: () => void
}

export default function Modal({ item, close }: props) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      close()
    }
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 font-sans cursor-pointer"
    >
      {item.type === 'doc' && (
        <div
          style={{ backgroundImage: `url(${paperBg})` }}
          className="relative w-full max-w-lg text-zinc-900 p-10 pl-16 shadow-2xl -rotate-1 bg-cover bg-center cursor-default"
        >
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-zinc-900 pt-4">
            {item.content}
          </div>
        </div>
      )}

      {item.type === 'audio' && (
        <div
          style={{ backgroundImage: `url(${cassetteBg})` }}
          className="relative w-full max-w-2xl aspect-[1.6/1] p-12 pl-20 text-zinc-900 shadow-2xl bg-cover bg-center cursor-default flex flex-col justify-between"
        >
          <div className="mt-2 px-6 pl-10 py-1 overflow-y-auto max-h-[45%] font-mono text-xs leading-relaxed text-zinc-900 selection:bg-black selection:text-white pointer-events-auto">
            {item.content}
          </div>
        </div>
      )}

      {item.type === 'photo' && (
        <div className="relative w-auto max-w-[90vw] max-h-[90vh] p-1 shadow-2xl rotate-1 bg-black cursor-default border border-zinc-600">
          <img
            src={item.content}
            alt="evidence"
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain block border border-zinc-700"
          />
        </div>
      )}
    </div>
  )
}