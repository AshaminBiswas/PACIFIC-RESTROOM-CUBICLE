import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

/**
 * ProtectedRoute — wraps admin routes that require an active Supabase session.
 *
 * Why this is needed:
 *   AdminDashboard.tsx already redirects to /admin when there is no session,
 *   but the redirect happens *after* the component mounts and the async check
 *   completes. During that window, and if someone knows an admin URL, React
 *   Router renders the child component before the check returns. This wrapper
 *   performs the session check *before* the child renders, showing a neutral
 *   loading state instead of flashing protected UI.
 *
 * Usage (see routes.tsx):
 *   Wrap any admin route element with <ProtectedRoute /> and use <Outlet />
 *   as the child placeholder.
 */
export default function ProtectedRoute() {
  const [status, setStatus] = useState<"checking" | "authenticated" | "unauthenticated">("checking");

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("unauthenticated");
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      setStatus(data.session ? "authenticated" : "unauthenticated");
    });

    // Keep the guard reactive to sign-out/sign-in events from other tabs.
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setStatus(session ? "authenticated" : "unauthenticated");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (status === "checking") {
    return (
      <div className="min-h-screen bg-[#030213] flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Checking session…</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin" replace />;
  }

  // Authenticated — render the child admin route.
  return <Outlet />;
}
