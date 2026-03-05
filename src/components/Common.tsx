import React from "react";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";

export const LoadingSpinner = ({ label = "Loading..." }: { label?: string }) => (
  <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-brand-purple/90 backdrop-blur-md">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-20 h-20 border-4 border-white border-t-transparent rounded-full flex items-center justify-center mb-4"
    >
      <span className="text-white font-display font-bold text-3xl">C</span>
    </motion.div>
    <p className="text-white font-bold animate-pulse">{label}</p>
  </div>
);

export const WhatsAppButton = () => (
  <motion.a
    href="https://wa.me/yournumber"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="fixed bottom-24 right-6 z-40 bg-green-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center"
  >
    <MessageCircle size={28} />
  </motion.a>
);

export const ProgressBar = ({ steps, currentStep }: { steps: number, currentStep: number }) => (
  <div className="flex gap-2 w-full max-w-md mx-auto mb-8">
    {Array.from({ length: steps }).map((_, i) => (
      <div 
        key={i} 
        className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
          i < currentStep ? "bg-white" : "bg-white/20"
        }`}
      />
    ))}
  </div>
);
