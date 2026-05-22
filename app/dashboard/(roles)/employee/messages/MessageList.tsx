"use client";

import React, { useState } from "react";
import { markAsRead } from "./actions";

type Message = any;

export default function MessageList({ messages }: { messages: Message[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [local, setLocal] = useState(messages);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const markRead = async (id: string) => {
    await markAsRead(id);
    setLocal((prev: any) => prev.map((m: any) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  return (
    <div className="space-y-3">
      {local.length === 0 ? (
        <div className="bg-white border border-black/5 rounded-2xl p-6 text-slate-500">No messages yet</div>
      ) : (
        local.map((msg: any) => (
          <div key={msg.id} className="bg-white border border-black/5 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {!msg.is_read ? <span className="block h-2.5 w-2.5 rounded-full bg-[#7c6cfa]" /> : <span style={{ width: 10 }} />}
                </div>
                <div>
                  <div className={`${!msg.is_read ? "font-semibold text-[#1a1a2e]" : "text-[#1a1a2e]"}`}>{msg.subject}</div>
                  <div className="text-sm text-slate-500">From: {msg.sender?.full_name ?? "Unknown"} • Project: {msg.project?.name ?? "—"}</div>
                  <div className="mt-2 text-sm text-slate-500">{msg.body.slice(0, 100)}{msg.body.length > 100 ? "..." : ""}</div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-sm text-slate-500">{new Date(msg.created_at).toLocaleString()}</div>
                <div className="flex items-center gap-2">
                  {!msg.is_read ? (
                    <button onClick={() => markRead(msg.id)} className="bg-[#7c6cfa] hover:bg-[#6a57e6] rounded-full px-3 py-1 text-sm font-semibold text-white">Mark as read</button>
                  ) : null}
                  <button onClick={() => toggle(msg.id)} className="text-sm text-[#7c6cfa]">{openId === msg.id ? "Collapse" : "Open"}</button>
                </div>
              </div>
            </div>

            {openId === msg.id ? <div className="mt-4 text-sm text-slate-500">{msg.body}</div> : null}
          </div>
        ))
      )}
    </div>
  );
}
