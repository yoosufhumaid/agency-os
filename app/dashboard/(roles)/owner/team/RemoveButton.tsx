"use client";

import { useTransition } from "react";
import { removeTeamMember } from "./actions";

export default function RemoveButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("userId", userId);
      await removeTeamMember(formData);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="bg-[#7c6cfa] hover:bg-[#6a57e6] disabled:opacity-50 rounded-full px-5 py-2 text-sm font-semibold text-white"
    >
      {isPending ? "Removing..." : "Remove"}
    </button>
  );
}