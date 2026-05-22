import Link from 'next/link'
import { createClient } from '@/lib/supabaseServer'

export default async function ClientLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', session?.user?.id ?? '')
    .single()

  const name = profile?.full_name ?? 'Client'

  return (
    <div className="min-h-screen bg-[#f8f7ff] flex">
      <aside className="w-56 bg-white border-r border-black/5 flex flex-col py-8 px-4 fixed h-full">
        <div className="mb-8 px-2">
          <p className="text-lg font-bold text-[#1a1a2e]">AgencyOS</p>
          <p className="text-xs text-slate-400 mt-0.5">Client portal</p>
        </div>
        <nav className="flex flex-col gap-1">
          <Link href="/dashboard/client" className="text-sm text-slate-600 hover:text-[#1a1a2e] hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
            My Projects
          </Link>
        </nav>
        <div className="mt-auto px-2">
          <p className="text-xs text-slate-400">Signed in as</p>
          <p className="text-sm font-medium text-[#1a1a2e] truncate">{name}</p>
        </div>
      </aside>
      <main className="ml-56 flex-1">
        {children}
      </main>
    </div>
  )
}
