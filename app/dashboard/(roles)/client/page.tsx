import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabaseServer'

export default async function ClientDashboard() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/signin')

  const userId = session.user.id

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('client_id', userId)
    .order('created_at', { ascending: false })

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const allProjects = projects ?? []

  const statusColors: Record<string, string> = {
    active: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    on_hold: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-600',
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">Welcome, {firstName}</h1>
        <p className="text-slate-500 text-sm mt-1">Here is the current status of your projects.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Total Projects</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">{allProjects.length}</p>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">
            {allProjects.filter(p => p.status === 'active').length}
          </p>
        </div>
        <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-5">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-3xl font-bold text-[#1a1a2e] mt-1">
            {allProjects.filter(p => p.status === 'completed').length}
          </p>
        </div>
      </div>

      {/* Projects list */}
      <div className="bg-white border border-black/5 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">My Projects</h2>
        {allProjects.length === 0 ? (
          <p className="text-slate-400 text-sm">No projects assigned yet.</p>
        ) : (
          <div className="divide-y divide-black/5">
            {allProjects.map((project: any) => (
              <div key={project.id} className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#1a1a2e]">{project.name}</p>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[project.status] ?? 'bg-slate-100 text-slate-600'}`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-[#7c6cfa] h-2 rounded-full transition-all"
                    style={{ width: `${project.progress ?? 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-slate-400">{project.progress ?? 0}% complete</p>
                  {project.deadline && (
                    <p className="text-xs text-slate-400">Due {new Date(project.deadline).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
