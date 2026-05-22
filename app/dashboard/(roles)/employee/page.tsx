import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'
import { supabaseAdmin } from '@/lib/supabaseAdmin'
import CheckInButton from './CheckInButton'

export default async function EmployeeDashboard() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/signin')

  const userId = session.user.id
  const today = new Date().toISOString().split('T')[0]

  const [profileRes, tasksRes, messagesRes, attendanceRes] = await Promise.all([
    supabase.from('profiles').select('full_name').eq('id', userId).single(),
    supabase.from('tasks').select('*').eq('assigned_to', userId).order('created_at', { ascending: false }),
    supabase.from('messages').select('id, subject, body, is_read, created_at, sender_id').eq('receiver_id', userId).order('created_at', { ascending: false }),
    supabase.from('attendance').select('*').eq('user_id', userId).eq('date', today).maybeSingle(),
  ])

  const profile = profileRes.data
  const tasks = tasksRes.data ?? []
  const messages = messagesRes.data ?? []
  const checkedInToday = !!attendanceRes.data

  const senderIds = [...new Set(messages.map((m: any) => m.sender_id).filter(Boolean))]
  const senderProfiles = senderIds.length
    ? (await supabaseAdmin.from('profiles').select('id, full_name').in('id', senderIds)).data ?? []
    : []

  const enrichedMessages = messages.map((m: any) => ({
    ...m,
    senderName: senderProfiles.find((p: any) => p.id === m.sender_id)?.full_name ?? 'Unknown',
  }))

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const unreadCount = messages.filter((m: any) => !m.is_read).length

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    todo: 'bg-slate-100 text-slate-600',
    done: 'bg-green-100 text-green-700',
    blocked: 'bg-rose-100 text-rose-700',
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a1a2e]">Welcome back, {firstName}</h1>
          <p className="text-slate-500 text-sm mt-1">Here is your overview for today.</p>
        </div>
        <CheckInButton alreadyCheckedIn={checkedInToday} />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Total Tasks</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{tasks.length}</p>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Unread Messages</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{unreadCount}</p>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Checked In</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{checkedInToday ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">My Tasks</h2>
        {tasks.length === 0 ? (
          <p className="text-slate-400 text-sm">No tasks assigned yet.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {tasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-[#1a1a2e]">{task.title}</p>
                  {task.due_date && (
                    <p className="text-xs text-slate-400 mt-0.5">Due {new Date(task.due_date).toLocaleDateString()}</p>
                  )}
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[task.status] ?? 'bg-slate-100 text-slate-600'}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">My Messages</h2>
        {enrichedMessages.length === 0 ? (
          <p className="text-slate-400 text-sm">No messages yet.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {enrichedMessages.map((msg: any) => (
              <div key={msg.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${msg.is_read ? 'bg-slate-300' : 'bg-[#7c6cfa]'}`} />
                  <div>
                    <p className="text-sm font-medium text-[#1a1a2e]">{msg.subject}</p>
                    <p className="text-xs text-slate-400">From {msg.senderName}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}