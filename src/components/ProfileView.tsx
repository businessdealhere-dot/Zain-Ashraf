import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, History, Wallet, Settings, ChevronRight, LogOut } from "lucide-react";
import { cn } from "../utils";

interface ProfileViewProps {
  userProfile: any;
  firebaseUser: any;
  orders: any[];
  onSignOut: () => void;
  onTopUp: (amount: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ userProfile, firebaseUser, orders, onSignOut, onTopUp }) => {
  const [activeProfileTab, setActiveProfileTab] = useState<string | null>(null);
  const [showTopUp, setShowTopUp] = useState(false);

  const renderProfileTabContent = (tab: string) => {
    switch (tab) {
      case "Profile Information":
        return (
          <div className="space-y-4 text-sm text-white/80 glass-card p-6">
            <div className="flex justify-between border-b border-white/10 py-3">
              <span className="opacity-60">Full Name</span>
              <span className="font-bold">{userProfile?.firstName} {userProfile?.lastName}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-3">
              <span className="opacity-60">Zip Code</span>
              <span className="font-bold">{userProfile?.zipCode}</span>
            </div>
            <div className="flex justify-between border-b border-white/10 py-3">
              <span className="opacity-60">Email</span>
              <span className="font-bold">{firebaseUser?.email}</span>
            </div>
            <div className="flex justify-between py-3">
              <span className="opacity-60">Member Status</span>
              <span className="text-brand-orange font-bold uppercase tracking-widest text-[10px]">Premium</span>
            </div>
          </div>
        );
      case "Purchase History":
        return (
          <div className="space-y-4 glass-card p-6">
            <h3 className="font-bold text-white">Recent Purchases</h3>
            {orders.length === 0 ? (
              <p className="text-white/40 text-sm italic">No purchases yet.</p>
            ) : (
              orders.map((order, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div>
                    <p className="font-bold text-sm text-white">{order.selectedPlan} Plan</p>
                    <p className="text-[10px] text-white/40">{new Date(order.timestamp).toLocaleDateString()}</p>
                  </div>
                  <span className="text-brand-orange font-bold text-xs uppercase tracking-widest">{order.status}</span>
                </div>
              ))
            )}
          </div>
        );
      case "Wallet Balance":
        return (
          <div className="p-8 glass-card border-white/20 text-white space-y-3">
            <p className="text-xs opacity-60 uppercase font-bold tracking-widest">Available Balance</p>
            <h3 className="text-4xl font-display font-bold">${(userProfile?.walletBalance || 0).toFixed(2)}</h3>
            <button 
              onClick={() => setShowTopUp(true)}
              className="w-full py-3 bg-white text-brand-purple rounded-xl text-xs font-bold mt-6 shadow-xl active:scale-95 transition-all"
            >
              Top Up Wallet
            </button>
          </div>
        );
      case "App Settings":
        return (
          <div className="space-y-4 glass-card p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Notifications</span>
              <div className="w-10 h-5 bg-white/20 rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Biometric Login</span>
              <div className="w-10 h-5 bg-white/10 rounded-full relative">
                <div className="absolute left-1 top-1 w-3 h-3 bg-white/40 rounded-full" />
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {showTopUp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-xs p-8 shadow-2xl border-white/20"
            >
              <h3 className="text-2xl font-bold mb-6 text-white">Top Up</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[10, 20, 50, 100].map(amount => (
                  <button
                    key={amount}
                    onClick={() => {
                      onTopUp(amount);
                      setShowTopUp(false);
                    }}
                    className="py-4 bg-white/10 rounded-2xl font-bold text-white hover:bg-white hover:text-brand-purple transition-all active:scale-95"
                  >
                    +${amount}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => setShowTopUp(false)}
                className="w-full py-3 text-white/60 font-bold text-sm"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <div className="flex flex-col items-center space-y-4 py-6">
        <div className="w-28 h-28 rounded-full glass-card flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-white/20">
          {userProfile?.firstName?.[0] || firebaseUser?.displayName?.[0] || "Z"}
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-display font-bold text-white">{userProfile?.firstName} {userProfile?.lastName}</h2>
          <p className="text-white/60 font-medium">{userProfile?.zipCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {[
          { label: "Profile Information", icon: User },
          { label: "Purchase History", icon: History },
          { label: "Wallet Balance", icon: Wallet },
          { label: "App Settings", icon: Settings },
        ].map((item, i) => (
          <div key={i} className="space-y-3">
            <button 
              onClick={() => setActiveProfileTab(activeProfileTab === item.label ? null : item.label)}
              className={cn(
                "w-full p-5 flex items-center justify-between rounded-[1.5rem] transition-all",
                activeProfileTab === item.label ? "bg-white text-brand-purple" : "glass-card text-white hover:bg-white/10"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  activeProfileTab === item.label ? "bg-brand-purple/10" : "bg-white/10"
                )}>
                  <item.icon size={24} />
                </div>
                <span className="font-bold text-lg">{item.label}</span>
              </div>
              <ChevronRight size={20} className={cn("opacity-40 transition-transform", activeProfileTab === item.label && "rotate-90")} />
            </button>
            <AnimatePresence>
              {activeProfileTab === item.label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {renderProfileTabContent(item.label)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <button onClick={onSignOut} className="w-full py-6 text-white/40 font-bold flex items-center justify-center gap-3 hover:text-white transition-colors">
        <LogOut size={20} />
        Sign Out
      </button>
    </div>
  );
};
