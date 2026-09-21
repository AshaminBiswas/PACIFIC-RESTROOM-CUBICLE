import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router";
import { supabase, isSupabaseConfigured } from "../../../lib/supabase";
// @ts-ignore
import logo from "../../../image/logo/logo.webp";
import {
  LayoutDashboard,
  Package,
  FileText,
  Lightbulb,
  ImageIcon,
  LogOut,
  Menu,
  ChevronRight,
  MonitorPlay,
  Layers,
  LayoutTemplate,
  MessageSquare,
  Star,
  HelpCircle,
  Users,
  FileDown,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
const WARNING_BEFORE = 60 * 1000; // show warning 1 min before logout

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(60);

  const logoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // ── Auth check ──────────────────────────────────────────
  useEffect(() => {
    async function check() {
      if (!isSupabaseConfigured()) {
        navigate("/admin");
        return;
      }
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/admin");
      } else {
        setUser(data.session.user);
      }
      setChecking(false);
    }
    check();
  }, [navigate]);

  // ── Logout handler ──────────────────────────────────────
  const handleLogout = useCallback(async () => {
    // Clear all timers
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setShowTimeoutWarning(false);

    await supabase.auth.signOut();
    navigate("/admin");
  }, [navigate]);

  // ── Reset inactivity timer ──────────────────────────────
  const resetInactivityTimer = useCallback(() => {
    lastActivityRef.current = Date.now();
    setShowTimeoutWarning(false);

    // Clear existing timers
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Set warning timer (fires 1 min before logout)
    warningTimerRef.current = setTimeout(() => {
      setShowTimeoutWarning(true);
      setSecondsLeft(60);

      // Start countdown
      countdownRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (countdownRef.current) clearInterval(countdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT - WARNING_BEFORE);

    // Set logout timer (fires at 10 min)
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  // ── Attach activity listeners ───────────────────────────
  useEffect(() => {
    if (!user) return;

    const activityEvents = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];

    const onActivity = () => {
      resetInactivityTimer();
    };

    // Start the timer
    resetInactivityTimer();

    // Listen for user activity
    activityEvents.forEach((event) => {
      document.addEventListener(event, onActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach((event) => {
        document.removeEventListener(event, onActivity);
      });
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [user, resetInactivityTimer]);

  const navItems = [
    { name: "Overview", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Services", path: "/admin/dashboard/products", icon: Package },
    { name: "Blogs", path: "/admin/dashboard/blogs", icon: FileText },
    { name: "Solutions", path: "/admin/dashboard/solutions", icon: Lightbulb },
    { name: "Gallery", path: "/admin/dashboard/gallery", icon: ImageIcon },
    { name: "Hero Images", path: "/admin/dashboard/hero", icon: MonitorPlay },
    { name: "Core Services", path: "/admin/dashboard/core-services", icon: Layers },
    { name: "Page Banners", path: "/admin/dashboard/page-banners", icon: LayoutTemplate },
    { name: "Catalogs", path: "/admin/dashboard/catalogs", icon: FileDown },
    { name: "Contact Queries", path: "/admin/dashboard/contact-queries", icon: MessageSquare },
    { name: "Feedback", path: "/admin/dashboard/feedback", icon: Star },
    { name: "FAQ", path: "/admin/dashboard/faq", icon: HelpCircle },
    { name: "Visitor Leads", path: "/admin/dashboard/leads", icon: Users },
  ];

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="animate-pulse text-white text-lg">Loading…</div>
      </div>
    );
  }

  const isActive = (path: string) => {
    if (path === "/admin/dashboard") return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#0a0a1a] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#030213] border-r border-white/5 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo — no redirect, stays in admin */}
        <div className="p-6 border-b border-white/5">
          <div className="block">
            <img
              src={logo}
              alt="Pacific Products & Solutions"
              className="h-16 w-auto object-contain mb-1 rounded-full bg-white/5 p-2"
            />
            <p className="text-[10px] tracking-wider text-gray-500">
              ADMIN PANEL
            </p>
          </div>
        </div>

        {/* Nav — independently scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin" style={{ scrollbarWidth: "thin", scrollbarColor: "#ffffff15 transparent" }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(item.path)
                  ? "bg-[#7FB706]/15 text-[#7FB706]"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
              {isActive(item.path) && (
                <ChevronRight className="w-4 h-4 ml-auto" />
              )}
            </Link>
          ))}
        </nav>

        {/* User / Logout */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 bg-[#7FB706] rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0">
              <p className="text-sm text-white truncate">
                {user?.email || "Admin"}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-full transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar — Redesigned */}
        <header className="bg-[#030213]/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu */}
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title + breadcrumb */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-0.5">
                <span>Admin</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-gray-300">
                  {navItems.find((i) => isActive(i.path))?.name || "Dashboard"}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {navItems.find((i) => isActive(i.path))?.name || "Dashboard"}
              </h2>
            </div>

            {/* View Site button */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-400 hover:text-[#B5F823] bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 hover:border-[#7FB706]/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Site
            </Link>

            {/* User avatar */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7FB706] to-[#B5F823] rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#7FB706]/20">
                {user?.email?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="hidden md:block min-w-0">
                <p className="text-xs text-white font-medium truncate max-w-[120px]">
                  {user?.email || "Admin"}
                </p>
                <p className="text-[10px] text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 p-3 sm:p-5 lg:p-6">
          <div className="bg-[#0d0d20]/50 rounded-2xl border border-white/[0.03] min-h-full p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="px-4 sm:px-6 py-3 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] text-gray-600">
            <span>© {new Date().getFullYear()} Pacific Products & Solutions</span>
            <span>Admin Panel v2.0</span>
          </div>
        </footer>
      </div>

      {/* Inactivity Warning Toast */}
      {showTimeoutWarning && (
        <div className="fixed bottom-6 right-6 z-[100] animate-[slideUp_0.3s_ease-out]">
          <div className="bg-[#1a1a2e] border border-yellow-500/30 rounded-2xl p-5 shadow-2xl shadow-black/40 max-w-sm">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-500/15 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white mb-1">Session Expiring</h4>
                <p className="text-xs text-gray-400 mb-3">
                  You'll be logged out in <span className="text-yellow-400 font-bold">{secondsLeft}s</span> due to inactivity.
                </p>
                <button
                  onClick={resetInactivityTimer}
                  className="px-4 py-2 text-xs font-semibold bg-[#7FB706] hover:bg-[#6fa005] text-white rounded-lg transition-colors w-full"
                >
                  Stay Logged In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
