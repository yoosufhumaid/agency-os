import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08080f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 lg:px-10">
        <nav className="sticky top-0 z-20 flex items-center justify-between gap-4 rounded-full border border-white/10 bg-[#090912]/95 px-5 py-4 shadow-[0_15px_40px_-24px_rgba(0,0,0,0.4)] backdrop-blur-xl">
          <div className="flex items-center gap-2 text-lg font-semibold text-white">
            <span>Agency</span>
            <span className="text-[#7c6cfa]">OS</span>
          </div>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center rounded-full bg-[#7c6cfa] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#6a57e6]"
          >
            Get started
          </Link>
        </nav>

        <section className="mt-12 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[#7c6cfa]" />
              <span>New launch — premium role-based agency workspace</span>
            </div>

            <div className="space-y-5">
              <h1 className="max-w-3xl text-5xl font-semibold leading-tight tracking-tight text-white font-syne sm:text-6xl">
                Build agency clarity for teams and clients.
                <span className="block bg-gradient-to-r from-[#7c6cfa] via-[#a88efc] to-[#7c6cfa] bg-clip-text text-transparent">
                  Connect owners, employees, and clients in one premium workspace.
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300">
                AgencyOS blends secure dashboards, task workflows, project overviews, and AI-driven summaries into a beautiful operating system for modern creative teams.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link
                href="/signin"
                className="inline-flex items-center justify-center rounded-full bg-[#7c6cfa] px-7 py-4 text-sm font-semibold text-white shadow-[0_20px_60px_-30px_rgba(124,108,250,0.8)] transition hover:bg-[#6946e7]"
              >
                Get started
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#7c6cfa]/40 hover:bg-white/10"
              >
                View demo
              </Link>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-[0_30px_80px_-45px_rgba(124,108,250,0.6)] backdrop-blur-xl">
              <p className="uppercase tracking-[0.35em] text-[#c5bbff]">Premium platform</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <span className="rounded-3xl bg-white/10 px-4 py-3">Secure ownership</span>
                <span className="rounded-3xl bg-white/10 px-4 py-3">Role-based access</span>
                <span className="rounded-3xl bg-white/10 px-4 py-3">AI conversation summaries</span>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#10101f]/90 p-6 shadow-[0_30px_80px_-30px_rgba(124,108,250,0.45)]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="rounded-3xl bg-white/5 px-4 py-2 text-sm text-slate-300">AgencyOS Board</div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs text-slate-200">
                <span className="h-2.5 w-2.5 rounded-full bg-[#7c6cfa]" />
                Live preview
              </div>
            </div>
            <div className="space-y-5 rounded-[1.75rem] bg-[#0b0b1b] p-6">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Overview</span>
                <span>Today</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#11121f] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Projects</p>
                  <p className="mt-4 text-3xl font-semibold text-white">14</p>
                  <p className="mt-2 text-sm text-slate-400">In active delivery</p>
                </div>
                <div className="rounded-3xl bg-[#11121f] p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Tasks</p>
                  <p className="mt-4 text-3xl font-semibold text-white">28</p>
                  <p className="mt-2 text-sm text-slate-400">Open or due soon</p>
                </div>
              </div>
              <div className="rounded-[1.75rem] border border-white/10 bg-[#080810] p-4">
                <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-[0.3em] text-slate-500">
                  <span>Team workload</span>
                  <span>75% capacity</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[75%] rounded-full bg-[#7c6cfa]" />
                </div>
              </div>
            </div>
            <div className="mt-6 rounded-[1.75rem] bg-[#11121f]/90 p-5">
              <div className="flex items-center justify-between text-sm text-slate-400">
                <span>Client approvals</span>
                <span className="rounded-full bg-[#7c6cfa]/10 px-3 py-1 text-xs text-[#d6cbff]">3 pending</span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-[#0d0d1b] p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Draft brief</p>
                  <p className="mt-3 text-slate-400">Sent to client</p>
                </div>
                <div className="rounded-3xl bg-[#0d0d1b] p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Review deck</p>
                  <p className="mt-3 text-slate-400">Due tomorrow</p>
                </div>
                <div className="rounded-3xl bg-[#0d0d1b] p-4 text-sm text-slate-300">
                  <p className="font-semibold text-white">Launch plan</p>
                  <p className="mt-3 text-slate-400">Next week</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/10 bg-[#0b0b17]/90 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#b9b0ff]">Why agencies choose AgencyOS</p>
              <h2 className="mt-3 text-3xl font-semibold text-white font-syne">Powerful workflow, polished experience.</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">Secure role access</span>
              <span className="rounded-full bg-white/5 px-4 py-2 text-sm text-slate-300">AI insights</span>
            </div>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { title: "Unified dashboards", description: "One home for owners, employees, and clients." },
              { title: "Project clarity", description: "Track status, timelines, and approvals in minutes." },
              { title: "Team accountability", description: "Keep each role aligned without chasing updates." },
              { title: "AI summaries", description: "Automated briefings for faster decisions." },
              { title: "Secure sharing", description: "Control what stakeholders can view and edit." },
              { title: "Modern reporting", description: "Beautiful visuals that keep clients informed." },
            ].map((feature) => (
              <div key={feature.title} className="rounded-[1.75rem] border border-white/10 bg-[#10101f]/80 p-6 hover:bg-[#14142b]/95 transition">
                <p className="text-base font-semibold text-white">{feature.title}</p>
                <p className="mt-3 text-sm leading-7 text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16 grid gap-5 xl:grid-cols-3">
          {[
            { title: "Owner", accent: "from-[#7c6cfa]/15 to-[#7c6cfa]/5", label: "Executive control", description: "Manage teams, budgets, and client delivery from a single command center." },
            { title: "Employee", accent: "from-emerald-400/15 to-emerald-200/5", label: "Task-driven workspace", description: "Work from a clean taskboard with quick status updates and context." },
            { title: "Client", accent: "from-sky-400/15 to-sky-200/5", label: "Project transparency", description: "Give stakeholders a branded portal with only the information they need." },
          ].map((role) => (
            <div key={role.title} className={`rounded-[2rem] border border-white/10 bg-[#0d0d1d] p-8 text-slate-300 shadow-sm ${role.accent}`}>
              <div className="space-y-3 rounded-[1.75rem] border border-white/5 bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{role.title}</p>
                <h3 className="text-2xl font-semibold text-white">{role.label}</h3>
                <p className="text-sm leading-7 text-slate-400">{role.description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/10 bg-[#0b0b17]/90 p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#b9b0ff]">AI summary showcase</p>
              <h2 className="mt-3 text-3xl font-semibold text-white font-syne">Smart updates for every role.</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">Realtime conversation view</div>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-[#10101f]/90 p-6">
              <div className="rounded-[1.5rem] bg-white/5 p-5">
                <p className="text-sm uppercase tracking-[0.3em] text-[#c5bbff]">AI assistant</p>
                <p className="mt-3 text-sm text-slate-300">Summarized today’s project handoff and flagged two delayed approvals.</p>
              </div>
              <div className="rounded-[1.5rem] bg-[#11121f] p-5 text-slate-300">
                <p className="text-sm font-semibold text-white">Client feedback:</p>
                <p className="mt-3 text-sm leading-7">Please move the brand launch to Thursday and align the final review with the content team.</p>
              </div>
            </div>
            <div className="space-y-4 rounded-[1.75rem] border border-white/10 bg-[#10101f]/90 p-6">
              <div className="rounded-[1.5rem] bg-[#11121f] p-5 text-slate-300">
                <p className="text-sm font-semibold text-white">AI insight:</p>
                <p className="mt-3 text-sm leading-7">Team capacity is at 78%. Recommend reassigning two tasks to avoid blocker risks.</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/5 p-5 text-slate-300">
                <p className="text-sm font-semibold text-white">Owner alert:</p>
                <p className="mt-3 text-sm leading-7">Retainer renewal is coming due. Prepare a status summary for the client review call.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: "Active projects", value: "18" },
            { label: "Daily sign-ins", value: "42" },
            { label: "Client approvals", value: "6" },
            { label: "Tasks completed", value: "124" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] border border-white/10 bg-[#0d0d1d]/90 p-6">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">{stat.label}</p>
              <p className="mt-4 text-4xl font-semibold text-white">{stat.value}</p>
            </div>
          ))}
        </section>

        <section className="mt-16 rounded-[2rem] border border-white/10 bg-[#11121f]/95 p-10 text-center">
          <p className="text-sm uppercase tracking-[0.35em] text-[#c5bbff]">Launch a calmer agency</p>
          <h2 className="mt-4 text-4xl font-semibold text-white font-syne sm:text-5xl">A premium home for every role, built for agency leaders.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-slate-300">
            Move beyond scattered tools and give your team the polished operating system they can trust every day.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center rounded-full bg-[#7c6cfa] px-7 py-4 text-sm font-semibold text-white transition hover:bg-[#6946e7]"
            >
              Start your workspace
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-7 py-4 text-sm font-semibold text-white transition hover:border-[#7c6cfa]/40 hover:bg-white/10"
            >
              Explore the dashboard
            </Link>
          </div>
        </section>

        <footer className="mt-20 border-t border-white/10 pt-8 text-sm text-slate-500">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 AgencyOS. Built for modern agencies.</p>
            <div className="flex flex-wrap gap-4 text-slate-400">
              <Link href="#" className="transition hover:text-white">Privacy</Link>
              <Link href="#" className="transition hover:text-white">Terms</Link>
              <Link href="#" className="transition hover:text-white">Contact</Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
