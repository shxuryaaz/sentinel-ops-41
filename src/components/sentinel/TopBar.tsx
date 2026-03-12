import { Search } from "lucide-react";

const TopBar = () => {
  return (
    <div className="h-10 bg-card border-b border-border flex items-center justify-between px-4">
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="text-[10px] text-sentinel-text-dim uppercase tracking-widest">
          Dashboard
        </span>
        <span className="text-[8px] text-sentinel-text-dim">
          ANALYSIS MODE
        </span>
        <span className="text-[8px] px-1.5 py-0.5 bg-sentinel-green/10 text-sentinel-green rounded-sm">
          MONITORING ACTIVE
        </span>
      </div>

      {/* Center: search */}
      <div className="flex items-center border border-border rounded-sm bg-secondary/30 w-80">
        <Search className="w-3 h-3 text-sentinel-text-dim ml-2.5" />
        <input
          type="text"
          placeholder="Search claims, investigations, sources..."
          className="flex-1 bg-transparent text-[10px] text-foreground px-2 py-1.5 placeholder:text-sentinel-text-dim focus:outline-none font-mono"
        />
      </div>

      {/* Right: system status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-sentinel-green" />
          <span className="text-[8px] text-sentinel-text-dim">
            ALL SYSTEMS OPERATIONAL
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
