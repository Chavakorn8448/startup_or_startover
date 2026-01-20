import { useEffect, useMemo, useState } from "react";
// If your project already has a supabase client import, use that later.
// import { supabase } from "@/utils/supabase/client";

type AdminMode = "mock" | "supabase";

/**
 * Code-only friendly RBAC:
 * - mock mode: admin if email is in VITE_ADMIN_EMAILS
 * - supabase mode: (later) fetch role from profiles table
 */
export function useIsAdmin(user: any | null) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const adminMode: AdminMode = (import.meta as any).env?.VITE_ADMIN_MODE || "mock";
  const adminEmailsRaw = (import.meta as any).env?.VITE_ADMIN_EMAILS || "";
  const adminEmails = useMemo(
    () =>
      adminEmailsRaw
        .split(",")
        .map((s: string) => s.trim().toLowerCase())
        .filter(Boolean),
    [adminEmailsRaw]
  );

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);

      if (!user?.email) {
        if (!cancelled) {
          setIsAdmin(false);
          setLoading(false);
        }
        return;
      }

      // ✅ MOCK MODE (works now, no dashboard needed)
      if (adminMode === "mock") {
        const email = String(user.email).toLowerCase();
        const ok = adminEmails.includes(email);
        if (!cancelled) {
          setIsAdmin(ok);
          setLoading(false);
        }
        return;
      }

      // ✅ SUPABASE MODE (enable later when you have access)
      // Pseudocode (we’ll activate later):
      // const { data, error } = await supabase
      //   .from("profiles")
      //   .select("role")
      //   .eq("id", user.id)
      //   .single();
      // const ok = !error && data?.role === "admin";

      // For now, keep safe default:
      if (!cancelled) {
        setIsAdmin(false);
        setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [user, adminMode, adminEmails]);

  return { isAdmin, isAdminLoading: loading };
}
