import { useState } from "react";
import {
  LayoutDashboard,
  AlertTriangle,
  Search,
  Globe,
  Bot,
  Database,
  Plus,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: AlertTriangle, label: "Threat Feed" },
  { icon: Search, label: "Investigations" },
  { icon: Globe, label: "Propagation Map" },
  { icon: Bot, label: "Agent Activity" },
  { icon: Database, label: "Data Sources" },
];

const INVESTIGATIONS = [
  {
    name: "Operation Darkwave",
    claim: "NASA confirms six days of darkness",
    status: "active" as const,
  },
  {
    name: "Vector Analysis #47",
    claim: "5G towers causing health issues",
    status: "active" as const,
  },
  {
    name: "Signal Trace #12",
    claim: "Election fraud evidence leaked",
    status: "pending" as const,
  },
];

const Sidebar = () => {
  const [activeNav, setActiveNav] = useState("Dashboard");

  return (
    <div className="w-60 h-full bg-card border-r border-border flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary flex items-center justify-center rounded-sm">
            <span className="text-primary-foreground text-xs font-bold">S</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-primary tracking-widest">
              SENTINEL
            </p>
            <p className="text-[9px] text-sentinel-text-dim">
              Intelligence Network
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveNav(item.label)}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm text-xs transition-colors ${
              activeNav === item.label
                ? "bg-secondary text-primary"
                : "text-sentinel-text-mid hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            <item.icon className="w-3.5 h-3.5" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Launch Investigation */}
      <div className="px-3 mt-2">
        <button className="w-full flex items-center gap-2 px-2.5 py-2 border border-border rounded-sm text-xs text-sentinel-cyan hover:bg-secondary/30 transition-colors">
          <Plus className="w-3.5 h-3.5" />
          Launch Investigation
        </button>
      </div>

      {/* Active Investigations */}
      <div className="px-3 mt-6 flex-1 overflow-auto">
        <p className="sentinel-text-label mb-3">Active Investigations</p>
        <div className="space-y-2">
          {INVESTIGATIONS.map((inv) => (
            <div
              key={inv.name}
              className="p-2.5 border border-border rounded-sm hover:bg-secondary/30 cursor-pointer transition-colors group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-foreground">
                  {inv.name}
                </span>
                <ChevronRight className="w-3 h-3 text-sentinel-text-dim group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-[9px] text-sentinel-text-dim leading-relaxed line-clamp-2">
                {inv.claim}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    inv.status === "active"
                      ? "bg-sentinel-green"
                      : "bg-sentinel-amber"
                  }`}
                />
                <span className="text-[8px] uppercase tracking-wider text-sentinel-text-dim">
                  {inv.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="p-3 border-t border-border">
        <p className="text-[8px] text-sentinel-text-dim">
          SENTINEL v2.1 // CLASSIFIED
        </p>
      </div>
    </div>
  );
};

export default Sidebar;
