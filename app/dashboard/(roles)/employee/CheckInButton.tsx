'use client'

import { useState } from 'react'
import { checkIn } from './actions'

export default function CheckInButton({ alreadyCheckedIn }: { alreadyCheckedIn: boolean }) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(alreadyCheckedIn)

  async function handleCheckIn() {
    setLoading(true)
    const result = await checkIn()
    if (!result?.error) setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-5 py-2.5 rounded-full">
        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
        Checked in today
      </div>
    )
  }

  return (
    <button
      onClick={handleCheckIn}
      disabled={loading}
      className="bg-[#7c6cfa] hover:bg-[#6a57e6] text-white text-sm font-medium px-6 py-2.5 rounded-full transition-colors disabled:opacity-50"
    >
      {loading ? 'Checking in...' : 'Check In for Today'}
    </button>
  )
}
