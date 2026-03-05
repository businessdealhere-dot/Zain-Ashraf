import React from "react";
import { motion } from "motion/react";
import { Key, Home, Trees, Droplets, Zap } from "lucide-react";
import { cn } from "../utils";
import { WHATSAPP_NUMBER } from "../App";

export const ServicesGrid = () => {
  const services = [
    { name: "Locksmith", icon: Key, color: "bg-blue-500" },
    { name: "Roofing", icon: Home, color: "bg-orange-500" },
    { name: "Tree Cutting", icon: Trees, color: "bg-green-500" },
    { name: "Plumbing", icon: Droplets, color: "bg-cyan-500" },
    { name: "Electrician", icon: Zap, color: "bg-yellow-500" },
  ];

  const handleServiceClick = (serviceName: string) => {
    const message = encodeURIComponent(`Hello, I am interested in your ${serviceName} service. Please provide more details.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      {services.map((service, i) => (
        <motion.button
          key={i}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          className="flex flex-col items-center gap-2"
          onClick={() => handleServiceClick(service.name)}
        >
          <div className={cn("w-16 h-16 glass-card flex items-center justify-center text-white shadow-lg transition-all active:bg-white active:text-brand-purple", "border-white/10")}>
            <service.icon size={28} />
          </div>
          <span className="text-[10px] font-bold text-center uppercase tracking-tighter text-white/60">{service.name}</span>
        </motion.button>
      ))}
    </div>
  );
};
