'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

function ConfirmForm() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function verify() {
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      const access_token = params.get('access_token')
      const refresh_token = params.get('refresh_token')
      const type = params.get('type')

      if (access_token && refresh_token && type === 'invite') {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        })
        if (error) {
          setError('Invalid or expired invite link. Please ask to be invited again.')
        } else {
          setReady(true)
        }
      } else {
        setError('Invalid invite link.')
      }
      setVerifying(false)
    }
    verify()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#08080f] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-white mb-2">Set your password</h1>
        <p className="text-slate-400 text-sm mb-8">Choose a password to complete your account setup.</p>

        {verifying ? (
          <p className="text-slate-400 text-sm">Verifying your invite link...</p>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : ready ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="At least 6 characters"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#7c6cfa]/50"
              />
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#7c6cfa] hover:bg-[#6a57e6] text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Setting up account...' : 'Complete Setup'}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  )
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmForm />
    </Suspense>
  )
}
