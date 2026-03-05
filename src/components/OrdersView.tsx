import React from "react";
import { motion } from "motion/react";
import { ShoppingBag } from "lucide-react";

interface OrdersViewProps {
  orders: any[];
  onTransition: (view: any) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onTransition }) => {
  return (
    <div className="space-y-8">
      <div className="space-y-2 text-white">
        <h2 className="text-3xl font-display font-bold">Your Orders</h2>
        <p className="opacity-60">Track your activation status.</p>
      </div>

      {orders.length === 0 ? (
        <div className="py-20 text-center space-y-6 glass-card">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto text-white/40">
            <ShoppingBag size={40} />
          </div>
          <p className="text-white/60 font-medium">No orders found yet.</p>
          <button onClick={() => onTransition("home")} className="btn-primary px-8">Start Shopping</button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <div key={i} className="p-8 glass-card space-y-4 border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">{order.deviceType}</span>
                <span className="px-4 py-1.5 bg-brand-orange/20 text-brand-orange rounded-full text-[10px] font-bold uppercase tracking-widest border border-brand-orange/20">
                  {order.status}
                </span>
              </div>
              <h4 className="font-bold text-2xl text-white">{order.selectedPlan} Plan</h4>
              <div className="flex items-center justify-between text-sm text-white/60">
                <span className="font-medium">{new Date(order.timestamp).toLocaleDateString()}</span>
                <span className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest uppercase">ZIP: {order.zipCode}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
