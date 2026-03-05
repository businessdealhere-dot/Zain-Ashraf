import React from "react";
import { motion } from "motion/react";
import { ChevronRight, Tv, Smartphone, Apple } from "lucide-react";
import { cn } from "../utils";
import { ProgressBar } from "./Common";

interface IPTVViewProps {
  selectedDevice: string | null;
  setSelectedDevice: (device: any) => void;
  onTransition: (view: any) => void;
  onBack: () => void;
}

export const IPTVView: React.FC<IPTVViewProps> = ({ selectedDevice, setSelectedDevice, onTransition, onBack }) => {
  return (
    <div className="space-y-8 min-h-[80vh]">
      <ProgressBar steps={3} currentStep={2} />
      
      <button onClick={onBack} className="text-white font-medium flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl">
        <ChevronRight className="rotate-180" size={16} /> Back
      </button>
      
      <div className="space-y-2 text-white">
        <h2 className="text-3xl font-display font-bold">Select Your Device</h2>
        <p className="opacity-60">Choose the device you want to use.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { id: "Firestick", icon: Tv, label: "Amazon Firestick" },
          { id: "Android", icon: Smartphone, label: "Android Device" },
          { id: "iOS", icon: Apple, label: "iOS / Apple TV" },
        ].map((device) => (
          <motion.button
            key={device.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setSelectedDevice(device.id);
              setTimeout(() => onTransition("payment"), 300);
            }}
            className={cn(
              "p-8 rounded-[2rem] border-2 flex items-center gap-6 transition-all duration-300 text-left",
              selectedDevice === device.id 
                ? "bg-white border-white shadow-2xl scale-[0.98]" 
                : "glass-card border-transparent hover:border-white/20"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors",
              selectedDevice === device.id ? "bg-brand-purple/10 text-brand-purple" : "bg-white/20 text-white"
            )}>
              <device.icon size={28} />
            </div>
            <div>
              <h4 className={cn("text-xl font-bold", selectedDevice === device.id ? "text-slate-900" : "text-white")}>{device.label}</h4>
              <p className={cn("text-sm", selectedDevice === device.id ? "text-slate-500" : "text-white/60")}>Setup guide included</p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
