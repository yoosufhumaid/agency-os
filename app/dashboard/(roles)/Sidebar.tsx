"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/dashboard/owner" },
  { label: "Projects", href: "/dashboard/owner/projects" },
  { label: "Tasks", href: "/dashboard/owner/tasks" },
  { label: "Messages", href: "/dashboard/owner/messages" },
  { label: "Attendance", href: "/dashboard/owner/attendance" },
  { label: "Team", href: "/dashboard/owner/team" },
];

export default function Sidebar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {navItems.map((item) => {
        const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href} className="group">
            <div className={`relative flex items-center gap-3 rounded-3xl px-4 py-3 transition ${
              active ? "bg-slate-100 text-[#1a1a2e]" : "text-slate-600 hover:bg-slate-100 hover:text-[#1a1a2e]"
            }`}>
              {active ? <span className="absolute left-0 top-0 h-full w-1 rounded-r-full bg-[#5a4ee0]" /> : null}
              <span className="relative flex-1 text-sm font-semibold">{item.label}</span>
              {item.label === "Messages" && unreadCount > 0 && (
                <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-[#7c6cfa] text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          </Link>
        );
      })}
    </nav>
  );
}