import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabaseServer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import MarkAttendanceForm from "./MarkAttendanceForm";

export default async function AttendancePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/signin");

  const today = new Date().toISOString().slice(0, 10);
  const sevenDaysAgoDate = new Date();
  sevenDaysAgoDate.setDate(sevenDaysAgoDate.getDate() - 6);
  const sevenDaysAgo = sevenDaysAgoDate.toISOString().slice(0, 10);

  const [{ data: todayRecords }, { data: employees }, { data: weekRecords }] = await Promise.all([
    supabase.from("attendance").select("id, date, checked_in_at, status, user_id").eq("date", today).order("checked_in_at", { ascending: true }),
    supabaseAdmin.from("profiles").select("id, full_name").eq("role", "employee"),
    supabase.from("attendance").select("id, date, status, user_id").gte("date", sevenDaysAgo).order("date", { ascending: false }),
  ]);

  const employeesList = employees ?? [];
  const todayList = todayRecords ?? [];
  const weekList = weekRecords ?? [];

  const userIds = [...new Set(todayList.map((r: any) => r.user_id).filter(Boolean))];
  const { data: userProfiles } = await supabaseAdmin.from("profiles").select("id, full_name").in("id", userIds);

  const enrichedTodayList = todayList.map((r: any) => ({
    ...r,
    employee: userProfiles?.find((p: any) => p.id === r.user_id) ?? null,
  }));

  const totalEmployees = employeesList.length;
  const presentToday = enrichedTodayList.filter((r: any) => r.status === "present").length;
  const lateToday = enrichedTodayList.filter((r: any) => r.status === "late").length;
  const presentIds = new Set(enrichedTodayList.map((r: any) => r.user_id).filter(Boolean));
  const absentToday = employeesList.filter((e: any) => !presentIds.has(e.id)).length;

  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toISOString().slice(0, 10));
  }

  const weekly = dates.map((date) => {
    const records = weekList.filter((r: any) => r.date === date);
    const present = records.filter((r: any) => r.status === "present").length;
    const late = records.filter((r: any) => r.status === "late").length;
    const uniqueUsers = new Set(records.map((r: any) => r.user_id));
    const absent = totalEmployees - uniqueUsers.size;
    return { date, present, late, absent };
  });

  return (
    <main className="min-h-screen bg-[#f8f7ff] text-[#1a1a2e] p-6">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-[#1a1a2e]">Attendance</h1>
          <div className="text-sm text-slate-500">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</div>
        </header>

        <section className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Employees</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{totalEmployees}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Present Today</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{presentToday}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Late Today</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{lateToday}</p>
          </div>
          <div className="bg-white border border-black/5 rounded-2xl p-6 shadow-sm">
            <p className="text-sm text-slate-500">Absent Today</p>
            <p className="mt-2 text-2xl font-semibold text-[#1a1a2e]">{absentToday}</p>
          </div>
        </section>

        <section className="mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Today's Attendance</h2>
            {enrichedTodayList.length === 0 ? (
              <div className="text-slate-500">No attendance records for today</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-left">
                  <thead>
                    <tr className="text-slate-500 text-sm">
                      <th className="px-4 py-3">Employee Name</th>
                      <th className="px-4 py-3">Check-in Time</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrichedTodayList.map((r: any) => (
                      <tr key={r.id} className="border-t border-black/5 bg-white text-slate-700">
                        <td className="px-4 py-4">{r.employee?.full_name ?? "Unknown"}</td>
                        <td className="px-4 py-4">{r.checked_in_at ?? "Not checked in"}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                            r.status === "present" ? "bg-emerald-100 text-emerald-700" : r.status === "late" ? "bg-yellow-100 text-yellow-700" : "bg-rose-100 text-rose-700"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        <section className="mb-6">
          <div className="bg-white border border-black/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">This Week</h2>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-left">
                <thead>
                  <tr className="text-slate-500 text-sm">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Present</th>
                    <th className="px-4 py-3">Late</th>
                    <th className="px-4 py-3">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {weekly.map((d) => (
                    <tr key={d.date} className="border-t border-black/5 bg-white text-slate-700">
                      <td className="px-4 py-4">{new Date(d.date).toLocaleDateString()}</td>
                      <td className="px-4 py-4">{d.present}</td>
                      <td className="px-4 py-4">{d.late}</td>
                      <td className="px-4 py-4">{d.absent}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section>
          <div className="bg-white border border-black/5 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-[#1a1a2e] mb-4">Mark Attendance</h2>
            <MarkAttendanceForm employees={employeesList} today={today} />
          </div>
        </section>
      </div>
    </main>
  );
}