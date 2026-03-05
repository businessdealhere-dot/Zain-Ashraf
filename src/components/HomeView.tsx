import React, { Suspense, lazy } from "react";
import { motion } from "motion/react";
import { ChevronRight, Tv, Star } from "lucide-react";

const ServicesGrid = lazy(() => import("./ServicesGrid").then(m => ({ default: m.ServicesGrid })));

interface HomeViewProps {
  userProfile: any;
  firebaseUser: any;
  onTransition: (view: any) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ userProfile, firebaseUser, onTransition }) => {
  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-white">Hello, {userProfile?.firstName || "Zain"}!</h2>
          <p className="text-white/60">What are you looking for today?</p>
        </div>
        <div className="w-14 h-14 rounded-full glass-card flex items-center justify-center text-white font-bold text-xl">
          {userProfile?.firstName?.[0] || firebaseUser?.displayName?.[0] || "Z"}
        </div>
      </div>

      {/* IPTV Funnel Entry */}
      <motion.button
        onClick={() => onTransition("iptv")}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full p-8 glass-card text-left relative overflow-hidden group active:bg-white active:text-brand-purple"
      >
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Star size={16} className="text-brand-orange fill-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Most Popular</span>
          </div>
          <h3 className="text-3xl font-bold mb-2 text-white group-active:text-brand-purple">Premium IPTV</h3>
          <p className="text-white/60 text-sm mb-6 group-active:text-brand-purple/60">10,000+ Channels & VOD in 4K</p>
          <div className="inline-flex items-center gap-2 bg-white/20 px-6 py-3 rounded-full text-sm backdrop-blur-sm font-bold text-white group-active:bg-brand-purple/10 group-active:text-brand-purple">
            Get Started <ChevronRight size={16} />
          </div>
        </div>
        <Tv className="absolute -right-6 -bottom-6 w-40 h-40 opacity-10 group-hover:scale-110 transition-transform text-white" />
      </motion.button>

      {/* Home Services Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-white">Home Services</h3>
          <span className="text-xs text-white/60 font-bold uppercase tracking-widest">View All</span>
        </div>
        <Suspense fallback={<div className="h-40 flex items-center justify-center text-white/20">Loading Services...</div>}>
          <ServicesGrid />
        </Suspense>
      </div>

      {/* Featured Offer */}
      <div className="glass-card p-8 border-white/5">
        <h4 className="font-bold text-xl mb-3 text-white">Refer a Friend</h4>
        <p className="text-sm text-white/60 mb-6 leading-relaxed">Get $10 in your wallet for every friend who signs up for a 12-month plan.</p>
        <button className="text-white font-bold text-sm flex items-center gap-2 bg-white/10 px-6 py-3 rounded-xl hover:bg-white/20 transition-all">
          Learn More <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};
