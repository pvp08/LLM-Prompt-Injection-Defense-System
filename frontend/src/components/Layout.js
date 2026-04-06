import { Outlet, NavLink } from "react-router-dom";
import { Terminal, BarChart3, ScrollText, Shield, LogOut } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { path: "/", icon: Terminal, label: "Attack Playground" },
  { path: "/dashboard", icon: BarChart3, label: "Dashboard" },
  { path: "/logs", icon: ScrollText, label: "Security Logs" },
];

export default function Layout({ user, onLogout }) {
  return (
    <div className="flex h-screen bg-[#050505]" data-testid="app-layout">
      <aside className="w-16 border-r border-[#333] flex flex-col items-center py-6 bg-[#0A0A0A]">
        <div className="mb-8" data-testid="app-logo">
          <Shield className="w-8 h-8 text-[#00FF99]" />
        </div>
        <nav className="flex flex-col gap-4 flex-1">
          <TooltipProvider delayDuration={0}>
            {navItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink to={item.path} end={item.path === "/"}>
                    {({ isActive }) => (
                      <div
                        className={`p-3 rounded-sm transition-all duration-200 ${
                          isActive
                            ? "bg-[#00FF99]/10 text-[#00FF99] shadow-[0_0_10px_rgba(0,255,153,0.2)]"
                            : "text-[#888] hover:text-[#E0E0E0] hover:bg-[#121212]"
                        }`}
                        data-testid={`nav-${item.label.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        <item.icon className="w-5 h-5" />
                      </div>
                    )}
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="bg-[#121212] border-[#333] text-[#E0E0E0] font-mono text-xs"
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        <div className="flex flex-col gap-3 items-center">
          <div
            className="w-8 h-8 rounded-sm bg-[#121212] border border-[#333] flex items-center justify-center text-xs font-mono text-[#00FF99]"
            data-testid="user-avatar"
          >
            {user.username?.charAt(0)?.toUpperCase()}
          </div>
          <button
            onClick={onLogout}
            className="p-2 text-[#888] hover:text-[#FF3333] transition-colors duration-200"
            data-testid="logout-btn"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
