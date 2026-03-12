import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AGENT_LOGS = [
  { agent: "Claim Extraction Agent", status: "completed", time: "00:01.2s" },
  { agent: "Evidence Retrieval Agent", status: "searching sources", time: "00:03.8s" },
  { agent: "Source Credibility Agent", status: "analyzing domain", time: "00:05.1s" },
  { agent: "Contradiction Agent", status: "validating claim", time: "00:07.4s" },
  { agent: "Propagation Tracker", status: "mapping spread", time: "00:09.2s" },
  { agent: "Verdict Agent", status: "generating report", time: "00:11.6s" },
];

const EVIDENCE_SOURCES = [
  { name: "NASA Official Statement", credibility: "HIGH", summary: "No announcement regarding 'six days of darkness' has been made." },
  { name: "WHO Guideline DB", credibility: "HIGH", summary: "No scientific evidence supports this claim." },
  { name: "Reuters Fact Check", credibility: "HIGH", summary: "Claim debunked in multiple previous instances since 2014." },
  { name: "Social Media Analysis", credibility: "MEDIUM", summary: "Originated from satirical post, later shared without context." },
];

const AnalysisConsole = () => {
  const [visibleLogs, setVisibleLogs] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLogs((prev) => {
        if (prev >= AGENT_LOGS.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-80 h-full bg-card border-l border-border flex flex-col overflow-auto">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <p className="sentinel-text-label">Investigation Console</p>
      </div>

      {/* Active Claim */}
      <div className="p-3 border-b border-border">
        <p className="text-[9px] uppercase tracking-wider text-sentinel-cyan mb-1.5">
          ■ Active Claim
        </p>
        <p className="text-[11px] text-foreground leading-relaxed">
          "NASA confirmed Earth will experience six days of darkness."
        </p>
      </div>

      {/* Metrics */}
      <div className="p-3 border-b border-border space-y-3">
        <MetricBar label="Truth Score" value={18} max={100} color="sentinel-red" />
        <MetricBar label="Virality Risk" value={87} max={100} color="sentinel-amber" textOverride="HIGH" />
        <MetricBar label="Confidence" value={94} max={100} color="sentinel-green" textOverride="94%" />
      </div>

      {/* Evidence */}
      <div className="p-3 border-b border-border flex-shrink-0">
        <p className="sentinel-text-label mb-2">■ Evidence Sources</p>
        <div className="space-y-2">
          {EVIDENCE_SOURCES.map((src) => (
            <div key={src.name} className="p-2 border border-border rounded-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-foreground">{src.name}</span>
                <span
                  className={`text-[8px] uppercase tracking-wider px-1.5 py-0.5 rounded-sm ${
                    src.credibility === "HIGH"
                      ? "text-sentinel-green bg-sentinel-green/10"
                      : "text-sentinel-amber bg-sentinel-amber/10"
                  }`}
                >
                  {src.credibility}
                </span>
              </div>
              <p className="text-[9px] text-sentinel-text-dim leading-relaxed">
                {src.summary}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Activity */}
      <div className="p-3 flex-1">
        <p className="sentinel-text-label mb-2">■ Agent Activity</p>
        <div className="space-y-1.5 font-mono">
          <AnimatePresence>
            {AGENT_LOGS.slice(0, visibleLogs).map((log, i) => (
              <motion.div
                key={log.agent}
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-start gap-2 text-[9px]"
              >
                <span
                  className={`mt-0.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                    log.status === "completed"
                      ? "bg-sentinel-green"
                      : "bg-sentinel-cyan animate-pulse-slow"
                  }`}
                />
                <div className="flex-1">
                  <span className="text-sentinel-text-mid">{log.agent}</span>
                  <span className="text-sentinel-text-dim ml-1">
                    — {log.status}
                  </span>
                </div>
                <span className="text-sentinel-text-dim">{log.time}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {visibleLogs < AGENT_LOGS.length && (
            <div className="flex items-center gap-1 text-[9px] text-sentinel-text-dim">
              <span className="animate-blink">▋</span>
              Processing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function MetricBar({
  label,
  value,
  max,
  color,
  textOverride,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  textOverride?: string;
}) {
  const pct = (value / max) * 100;
  const segments = 20;
  const filled = Math.floor((pct / 100) * segments);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-sentinel-text-mid">{label}</span>
        <span className="text-[10px] font-medium text-foreground">
          {textOverride || `${value} / ${max}`}
        </span>
      </div>
      <div className="flex gap-[1px]">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 ${
              i < filled ? `bg-${color}` : "bg-sentinel-panel-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default AnalysisConsole;
