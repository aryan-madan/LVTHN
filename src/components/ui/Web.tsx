import { useState } from 'react'

export default function Web() {
  const [password, setPassword] = useState('')
  const [access, setAccess] = useState<'idle' | 'pending' | 'granted' | 'denied'>('idle')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setAccess('pending')
    
    setTimeout(() => {
      if (password.toUpperCase() === 'PROJLVTHN') {
        setAccess('granted')
      } else {
        setAccess('denied')
      }
    }, 1500)
  }

  return (
    <div className="w-full h-full p-5 text-green-400 selection:bg-green-400 selection:text-black flex flex-col">

      <div className="border-b-2 border-green-800 pb-2 mb-4 text-xs text-green-700 flex justify-between">
        <span>Netscape: Project LVTHN Database</span>
        <span className="text-green-900">FILE:///SECURE/DBase/LOGIN.HTM</span>
      </div>

      <div className="flex-grow flex flex-col items-center text-center font-bold">
        <h1 className="text-xl text-green-100 tracking-widest border border-green-900 p-3 bg-green-950/30">PROJECT LVTHN</h1>
        <p className="mt-5 text-sm text-green-600">SECURE ACCESS REQUIRED</p>
        <p className="text-xs text-green-800">-- AUTHORIZED PERSONNEL ONLY --</p>

        {access === 'idle' || access === 'denied' || access === 'pending' ? (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col items-center gap-3 p-6 border-2 border-dashed border-green-800 bg-black/50">
            <label htmlFor="password" className="text-xs text-green-700">ENTER ACCESS KEY:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-black border-2 border-green-700 text-green-200 px-4 py-1 text-lg text-center tracking-widest uppercase focus:outline-none focus:border-green-400"
              maxLength={10}
              required
            />
            <button
              type="submit"
              disabled={access === 'pending'}
              className="mt-3 text-sm bg-green-900 hover:bg-green-700 text-green-100 px-8 py-1.5 disabled:opacity-50 disabled:bg-green-950"
            >
              {access === 'pending' ? 'CONNECTING...' : 'SUBMIT KEY'}
            </button>
            {access === 'denied' && (
              <p className="text-xs text-red-500 mt-2 animate-pulse">ACCESS DENIED. KEY INVALID.</p>
            )}
          </form>
        ) : null}

        {access === 'granted' ? (
          <div className="mt-10 p-6 border-2 border-green-400 bg-green-950 animate-pulse">
            <p className="text-lg text-green-100">ACCESS GRANTED</p>
            <p className="text-xs text-green-300 mt-4">DECRYPTING LOG... FILE_002B UNLOCKED.</p>
            <p className="text-sm mt-6">
              **CLASSIFIED**<br />
              Signal confirmed. The LVTHN unit is operational at Coordinates [34.1245, -118.3102]. Evacuate immediately. Do not attempt recovery.
            </p>
          </div>
        ) : null}

      </div>

      <div className="border-t-2 border-green-800 pt-2 mt-4 text-xs text-green-700 text-center">
        <span>Best viewed in Netscape Navigator 4.0 or higher.</span>
      </div>
    </div>
  )
}