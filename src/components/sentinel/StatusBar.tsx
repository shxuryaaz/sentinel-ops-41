const STATUS_ITEMS = [
  { label: "AI Agents Online", value: "12 / 12", active: true },
  { label: "Data Feeds", value: "Connected", active: true },
  { label: "Threat Monitoring", value: "Active", active: true },
  { label: "Threat Level", value: "ELEVATED", warning: true },
];

const METRICS = [
  { label: "Active Investigations", value: "7" },
  { label: "Agent Processes", value: "34" },
  { label: "Data Streams", value: "128" },
  { label: "High Priority", value: "3", color: "sentinel-red" },
  { label: "Medium Priority", value: "2", color: "sentinel-amber" },
  { label: "Low Priority", value: "2", color: "sentinel-green" },
];

const StatusBar = () => {
  return (
    <div className="h-8 bg-card border-t border-border flex items-center px-4 justify-between">
      {/* Left: status indicators */}
      <div className="flex items-center gap-5">
        {STATUS_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                item.warning
                  ? "bg-sentinel-amber"
                  : item.active
                  ? "bg-sentinel-green"
                  : "bg-sentinel-text-dim"
              }`}
            />
            <span className="text-[8px] text-sentinel-text-dim uppercase tracking-wider">
              {item.label}
            </span>
            <span
              className={`text-[8px] font-medium ${
                item.warning ? "text-sentinel-amber" : "text-sentinel-text-mid"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* Right: metrics */}
      <div className="flex items-center gap-5">
        {METRICS.map((m) => (
          <div key={m.label} className="flex items-center gap-1.5">
            <span className="text-[8px] text-sentinel-text-dim uppercase tracking-wider">
              {m.label}:
            </span>
            <span
              className="text-[9px] font-medium"
              style={{
                color: m.color === "sentinel-red" ? "hsl(0, 70%, 50%)" :
                       m.color === "sentinel-amber" ? "hsl(40, 80%, 50%)" :
                       m.color === "sentinel-green" ? "hsl(145, 60%, 40%)" :
                       "hsl(var(--foreground))"
              }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatusBar;
