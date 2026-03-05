import React from "react";
import { motion } from "motion/react";
import { CheckCircle2, Smartphone } from "lucide-react";

interface SuccessViewProps {
  selectedDevice: string | null;
  onTransition: (view: any) => void;
}

export const SuccessView: React.FC<SuccessViewProps> = ({ selectedDevice, onTransition }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-12">
      <div className="w-28 h-28 glass-card border-white/20 text-white rounded-full flex items-center justify-center shadow-2xl">
        <CheckCircle2 size={56} className="text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-4xl font-display font-bold text-white">Payment Confirmed!</h2>
        <p className="text-white/60 font-medium">Your activation is complete.</p>
      </div>
      
      <div className="p-8 glass-card w-full space-y-6 text-left border-white/10">
        <h4 className="font-bold text-lg flex items-center gap-3 text-white">
          <Smartphone size={24} className="text-white" />
          Installation Guide for {selectedDevice}
        </h4>
        <div className="text-sm text-white/70 space-y-4 leading-relaxed">
          {selectedDevice === "Android" && (
            <p>1. Download <b>IPTV Smarters Pro</b> from Play Store.<br/>2. Open app and enter credentials sent to you.</p>
          )}
          {selectedDevice === "Firestick" && (
            <p>1. Install <b>Downloader</b> app.<br/>2. Enter code <b>78522</b> to download player.<br/>3. Login with your details.</p>
          )}
          {selectedDevice === "iOS" && (
            <p>1. Download <b>GSE Smart IPTV</b> from App Store.<br/>2. Add remote playlist using the link provided.</p>
          )}
        </div>
      </div>

      <div className="p-8 glass-card w-full border-white/5">
        <p className="text-sm text-white/60 leading-relaxed">
          Your credentials are being sent to your WhatsApp/Email. Expect details in <span className="text-white font-bold">2-5 minutes</span>.
        </p>
      </div>

      <button onClick={() => onTransition("home")} className="w-full py-5 glass-card border-white/20 text-white rounded-2xl font-bold hover:bg-white/10 transition-all">
        Return Home
      </button>
    </div>
  );
};
