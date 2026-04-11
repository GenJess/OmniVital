import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import logoMark from "@/assets/logo-mark.png";
import {
  LayoutDashboard,
  Users,
  FlaskConical,
  LogOut,
  Menu,
  X,
  Sparkles,
  ChevronLeft,
  MessageCircle,
} from "lucide-react";

interface CollectiveLayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  {
    key: "dashboard",
    label: "Dashboard",
    path: "/collective",
    icon: LayoutDashboard,
    description: "AI Advisor & Tracking",
  },
  {
    key: "community",
    label: "Community",
    path: "/collective/community",
    icon: Users,
    description: "The Collective",
  },
  {
    key: "protocol",
    label: "My Protocol",
    path: "/collective/protocol",
    icon: FlaskConical,
    description: "Manage Formulas",
  },
];

const CollectiveLayout = ({ children }: CollectiveLayoutProps) => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const firstName =
    profile?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Member";

  const currentPath = location.pathname;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar — Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logoMark} alt="OmniVital" className="w-8 h-8 rounded-lg" />
            <div>
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-foreground">
                OmniVital
              </span>
              <span className="block text-[9px] tracking-[0.15em] uppercase text-primary font-medium">
                The Collective
              </span>
            </div>
          </Link>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === "/collective"
                ? currentPath === "/collective"
                : currentPath.startsWith(item.path);
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <item.icon
                  size={18}
                  className={isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}
                />
                <div>
                  <span className="font-medium text-[13px]">{item.label}</span>
                  <span className={`block text-[10px] ${isActive ? "text-primary/70" : "text-muted-foreground/60"}`}>
                    {item.description}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/30 mb-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[11px] font-black text-accent-foreground">
              {firstName[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{firstName}</p>
              <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-4 py-2 text-[11px] font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary/50 transition-all"
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-xl border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-foreground p-1"
            >
              <Menu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoMark} alt="OmniVital" className="w-7 h-7 rounded-lg" />
              <span className="text-xs font-bold tracking-[0.15em] uppercase text-foreground">
                Collective
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-[10px] font-black text-accent-foreground">
              {firstName[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Mobile tabs */}
        <div className="flex border-t border-border">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.path === "/collective"
                ? currentPath === "/collective"
                : currentPath.startsWith(item.path);
            return (
              <Link
                key={item.key}
                to={item.path}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[9px] tracking-[0.1em] uppercase font-medium transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/60 z-50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25 }}
              className="lg:hidden fixed inset-y-0 left-0 w-72 bg-card border-r border-border z-50 flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <Link to="/" className="flex items-center gap-2">
                  <img src={logoMark} alt="OmniVital" className="w-7 h-7 rounded-lg" />
                  <span className="text-xs font-bold tracking-[0.15em] uppercase">OmniVital</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="text-foreground p-1">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.path === "/collective"
                      ? currentPath === "/collective"
                      : currentPath.startsWith(item.path);
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:text-foreground border border-transparent"
                      }`}
                    >
                      <item.icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
              <div className="p-4 border-t border-border">
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-4 py-2 text-xs text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 lg:ml-64 min-h-screen">
        <div className="pt-[104px] lg:pt-0">{children}</div>
      </main>
    </div>
  );
};

export default CollectiveLayout;
