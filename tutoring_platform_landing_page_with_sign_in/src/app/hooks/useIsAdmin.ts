import { useMemo } from "react";

export function useIsAdmin(user: any | null) {
  // Read from .env (Vite requires VITE_)
  const adminEmailsRaw = import.meta.env.VITE_ADMIN_EMAILS || "";
  const adminEmails = useMemo(
    () =>
      adminEmailsRaw
        .split(",")
        .map((s: string) => s.trim().toLowerCase())
        .filter(Boolean),
    [adminEmailsRaw]
  );

  const email = (user?.email ?? "").toLowerCase();
  const isAdmin = !!email && adminEmails.includes(email);

  return { isAdmin };
}
