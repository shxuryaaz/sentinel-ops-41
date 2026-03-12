import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BootSequence from "@/components/sentinel/BootSequence";
import Sidebar from "@/components/sentinel/Sidebar";
import TopBar from "@/components/sentinel/TopBar";
import GlobeVisualization from "@/components/sentinel/GlobeVisualization";
import AnalysisConsole from "@/components/sentinel/AnalysisConsole";
import StatusBar from "@/components/sentinel/StatusBar";

const Index = () => {
  const [booted, setBooted] = useState(false);

  const handleBootComplete = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <AnimatePresence mode="wait">
        {!booted ? (
          <motion.div key="boot" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <BootSequence onComplete={handleBootComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="h-full flex flex-col"
          >
            <TopBar />
            <div className="flex flex-1 min-h-0">
              <Sidebar />
              <div className="flex-1 min-w-0">
                <GlobeVisualization />
              </div>
              <AnalysisConsole />
            </div>
            <StatusBar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
