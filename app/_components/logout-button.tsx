"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function LogoutButton() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [hasError, setHasError] = useState(false);

  async function handleLogout() {
    setIsPending(true);
    setHasError(false);

    try {
      const { error } = await authClient.signOut();

      if (error) {
        setHasError(true);
        setIsPending(false);
        return;
      }

      router.push("/login");
      router.refresh();
    } catch {
      setHasError(true);
      setIsPending(false);
    }
  }

  return (
    <button
      className="text-sm font-medium text-acqua-800 transition-colors hover:text-acqua-600 disabled:cursor-wait disabled:opacity-60"
      disabled={isPending}
      onClick={handleLogout}
      type="button"
    >
      {isPending ? "Logging out..." : hasError ? "Try logging out again" : "Log out"}
    </button>
  );
}
