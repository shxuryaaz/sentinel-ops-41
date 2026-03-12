import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_STEPS = [
  "Initializing AI agents",
  "Connecting to global data feeds",
  "Loading misinformation models",
  "Calibrating threat detection algorithms",
  "Activating propagation network scanners",
  "Establishing secure communication channels",
  "Activating threat detection network",
  "System ready",
];

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence = ({ onComplete }: BootSequenceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= BOOT_STEPS.length - 1) {
          clearInterval(stepInterval);
          setTimeout(onComplete, 800);
          return prev;
        }
        setCompletedSteps((cs) => [...cs, BOOT_STEPS[prev]]);
        return prev + 1;
      });
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  const barSegments = 40;
  const filledSegments = Math.floor((progress / 100) * barSegments);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="w-full max-w-lg px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Title */}
          <div className="space-y-2">
            <p className="sentinel-text-label">The Correct Way To Monitor</p>
            <h1 className="text-3xl font-bold text-primary tracking-wider">
              SENTINEL
            </h1>
          </div>

          {/* Current step */}
          <div className="space-y-3">
            <p className="text-sm text-sentinel-text-mid">
              {BOOT_STEPS[currentStep]}
            </p>

            {/* Progress */}
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-primary">
                {progress}%
              </span>
              <span className="text-xs text-sentinel-text-dim">
                ↗ {Math.floor(progress * 0.13)}% since last checked
              </span>
            </div>

            {/* Segmented progress bar */}
            <div className="flex gap-[2px]">
              {Array.from({ length: barSegments }).map((_, i) => (
                <div
                  key={i}
                  className={`h-4 flex-1 transition-colors duration-100 ${
                    i < filledSegments
                      ? "bg-primary"
                      : "bg-sentinel-panel-border"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Completed steps log */}
          <div className="space-y-1 max-h-32 overflow-hidden">
            <AnimatePresence>
              {completedSteps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 0.4 }}
                  className="text-xs text-sentinel-text-dim font-mono"
                >
                  <span className="text-sentinel-green mr-2">✓</span>
                  {step}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BootSequence;
