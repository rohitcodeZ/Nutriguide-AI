import { Link, useLocation } from "wouter";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard, Utensils, ChefHat, Scan, MapPin, LogOut,
  User, ShieldCheck, Sparkles, X, Activity
} from "lucide-react";

const navItems = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { path: "/recommendations", icon: Sparkles, label: "AI Diet Plans" },
  { path: "/recipes", icon: ChefHat, label: "Recipes" },
  { path: "/food-analyzer", icon: Scan, label: "Food Analyzer" },
  { path: "/suggestions", icon: MapPin, label: "Suggestions" },
  { path: "/profile", icon: User, label: "My Profile" },
];

export default function Sidebar({ open, onClose }) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64
        glass flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg neon-btn flex items-center justify-center">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="orbitron text-sm font-bold text-primary neon-glow">NutriGuide</span>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Assistant</div>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-4 py-4 border-b border-border">
          <div className="glass-card rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-primary font-bold text-sm">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            {user?.role === "admin" && (
              <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
            )}
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location === path;
            return (
              <Link key={path} href={path} onClick={onClose}>
                <div className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                  ${active
                    ? "neon-btn bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }
                `}>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${active ? "text-primary" : ""}`} />
                  <span className="text-sm">{label}</span>
                  {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
                </div>
              </Link>
            );
          })}

          {user?.role === "admin" && (
            <Link href="/admin" onClick={onClose}>
              <div className={`
                flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                ${location === "/admin"
                  ? "neon-btn bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }
              `}>
                <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">Admin</span>
              </div>
            </Link>
          )}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
