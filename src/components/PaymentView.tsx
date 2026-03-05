import React from "react";
import { motion } from "motion/react";
import { Info, Wallet, CreditCard, Send, ChevronRight } from "lucide-react";
import { cn } from "../utils";
import { ProgressBar } from "./Common";
import { WHATSAPP_NUMBER } from "../App";

interface PaymentViewProps {
  selectedDevice: string | null;
  selectedPlan: any;
  setSelectedPlan: (plan: any) => void;
  plans: any[];
  onTransition: (view: any) => void;
  userProfile: any;
  onWalletPayment: (amount: number) => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({ 
  selectedDevice, 
  selectedPlan, 
  setSelectedPlan, 
  plans, 
  onTransition,
  userProfile,
  onWalletPayment
}) => {
  const canPayWithWallet = userProfile?.walletBalance >= (selectedPlan?.price || 0);

  const handleWhatsAppRedirect = (method: string) => {
    if (!selectedPlan || !selectedDevice) return;
    const message = encodeURIComponent(
      `Hello, I would like to pay for the ${selectedPlan.name} plan ($${selectedPlan.price}) for my ${selectedDevice} using ${method}.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${message}`, "_blank");
  };

  const handleCustomPackage = () => {
    const message = encodeURIComponent(
      `Hello, I am interested in a Custom Package for my ${selectedDevice}. Please provide more details.`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER.replace(/\+/g, "")}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-8 min-h-[80vh]">
      <ProgressBar steps={3} currentStep={3} />
      
      <div className="space-y-2 text-white">
        <h2 className="text-3xl font-display font-bold">Choose a Plan</h2>
        <p className="opacity-60">Selected Device: {selectedDevice}</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {plans.map((plan) => (
          <button
            key={plan.id}
            onClick={() => {
              setSelectedPlan(plan);
              if (plan.id === "custom") {
                handleCustomPackage();
              }
            }}
            className={cn(
              "p-8 rounded-[2rem] border-2 flex items-center justify-between transition-all",
              selectedPlan?.id === plan.id 
                ? "bg-white border-white shadow-2xl scale-[0.98]" 
                : "glass-card border-transparent hover:border-white/20"
            )}
          >
            <div>
              <h4 className={cn("text-xl font-bold", selectedPlan?.id === plan.id ? "text-slate-900" : "text-white")}>{plan.name}</h4>
              <p className={cn("text-sm", selectedPlan?.id === plan.id ? "text-slate-500" : "text-white/60")}>
                {plan.id === "custom" ? "Contact us for pricing" : "Full access included"}
              </p>
            </div>
            <div className={cn("text-2xl font-bold", selectedPlan?.id === plan.id ? "text-brand-purple" : "text-white")}>
              {plan.id === "custom" ? <Send size={24} /> : `$${plan.price}`}
            </div>
          </button>
        ))}
      </div>

      {selectedPlan && selectedPlan.id !== "custom" && (
        <div className="space-y-8 pt-4">
          {/* Wallet Payment Option */}
          <div className={cn(
            "p-8 rounded-[2rem] border-2 transition-all",
            canPayWithWallet ? "bg-white/10 border-white/20" : "bg-black/20 border-transparent opacity-50"
          )}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4 text-white">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Wallet size={24} />
                </div>
                <div>
                  <p className="text-xs opacity-60 uppercase font-bold tracking-widest">Wallet Balance</p>
                  <p className="text-xl font-bold">${(userProfile?.walletBalance || 0).toFixed(2)}</p>
                </div>
              </div>
              {canPayWithWallet && (
                <button 
                  onClick={() => onWalletPayment(selectedPlan.price)}
                  className="px-6 py-3 bg-white text-brand-purple rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-all"
                >
                  Pay Now
                </button>
              )}
            </div>
            {!canPayWithWallet && (
              <p className="text-xs text-white/60 italic">Insufficient balance. Please top up or use Remitly.</p>
            )}
          </div>

          {/* New Payment Methods */}
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-white ml-2">Payment Methods</h4>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleWhatsAppRedirect("PayPal")}
                className="glass-card p-6 flex items-center justify-between hover:bg-white/10 transition-all border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <CreditCard size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">PayPal</p>
                    <p className="text-xs text-white/60">Secure payment via WhatsApp</p>
                  </div>
                </div>
                <ChevronRight className="text-white/40" />
              </button>

              <button
                onClick={() => handleWhatsAppRedirect("Discount for WhatsApp")}
                className="glass-card p-6 flex items-center justify-between hover:bg-white/10 transition-all border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center text-green-400">
                    <Send size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-white text-lg">Discount for WhatsApp</p>
                    <p className="text-xs text-white/60">Get special deals via WhatsApp</p>
                  </div>
                </div>
                <ChevronRight className="text-white/40" />
              </button>
            </div>
          </div>

          <div className="glass-card p-8 space-y-6">
            <h4 className="text-xl font-bold flex items-center gap-3 text-white">
              <CreditCard size={24} className="text-white" />
              Remitly Instructions
            </h4>
            <div className="space-y-4">
              {[
                "Open Remitly App/Website",
                "Send to: Pakistan",
                "Delivery: Bank Deposit (Bank Alfalah)",
                `Amount: $${selectedPlan.price}`
              ].map((step, i) => (
                <div key={i} className="flex gap-3 text-sm text-white/80">
                  <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-bold shrink-0">{i+1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
            <button 
              onClick={() => onTransition("success")}
              className="w-full btn-primary"
            >
              I Have Paid via Remitly
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
