import React, { useState } from "react";
import { motion } from "motion/react";
import { User, MapPin, ChevronRight } from "lucide-react";
import { ProgressBar } from "./Common";

interface OnboardingViewProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onSubmit, initialData = {} as any }) => {
  const [formData, setFormData] = useState({
    firstName: (initialData as any).firstName || "",
    lastName: (initialData as any).lastName || "",
    zipCode: (initialData as any).zipCode || "",
  });

  const isComplete = formData.firstName && formData.lastName && formData.zipCode;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isComplete) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-8 min-h-[80vh]">
      <ProgressBar steps={3} currentStep={1} />
      
      <div className="space-y-2 text-white text-center">
        <h2 className="text-3xl font-display font-bold">Create Profile</h2>
        <p className="opacity-60">Tell us a bit about yourself.</p>
      </div>

      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">First Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                required
                type="text"
                placeholder="John"
                className="glass-input pl-12 w-full"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Last Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                required
                type="text"
                placeholder="Doe"
                className="glass-input pl-12 w-full"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Zip Code</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
              <input
                required
                type="text"
                placeholder="10001"
                className="glass-input pl-12 w-full"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isComplete}
            className="w-full btn-primary disabled:opacity-30 disabled:cursor-not-allowed mt-4"
          >
            Continue <ChevronRight size={20} className="ml-2 inline" />
          </button>
        </form>
      </div>
    </div>
  );
};
