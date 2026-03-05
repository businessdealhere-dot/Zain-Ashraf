import React, { useState, useEffect, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, 
  ShoppingBag, 
  User,
  AlertCircle
} from "lucide-react";
import { auth, db } from "./firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from "firebase/auth";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  doc, 
  setDoc, 
  getDoc,
  getDocFromServer,
  updateDoc,
  increment,
  serverTimestamp
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

// --- Lazy Loaded Components ---
const AuthView = lazy(() => import("./components/AuthView").then(m => ({ default: m.AuthView })));
const OnboardingView = lazy(() => import("./components/OnboardingView").then(m => ({ default: m.OnboardingView })));
const HomeView = lazy(() => import("./components/HomeView").then(m => ({ default: m.HomeView })));
const IPTVView = lazy(() => import("./components/IPTVView").then(m => ({ default: m.IPTVView })));
const PaymentView = lazy(() => import("./components/PaymentView").then(m => ({ default: m.PaymentView })));
const SuccessView = lazy(() => import("./components/SuccessView").then(m => ({ default: m.SuccessView })));
const OrdersView = lazy(() => import("./components/OrdersView").then(m => ({ default: m.OrdersView })));
const ProfileView = lazy(() => import("./components/ProfileView").then(m => ({ default: m.ProfileView })));

import { LoadingSpinner, WhatsAppButton, ProgressBar } from "./components/Common";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { handleFirestoreError, OperationType } from "./services/errorService";
import { cn } from "./utils";

// --- Types & Constants ---
export type DeviceType = "Firestick" | "Android" | "iOS";
export type View = "auth" | "onboarding" | "home" | "iptv" | "services" | "payment" | "success" | "profile" | "orders";

export interface Plan {
  id: string;
  name: string;
  price: number;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  zipCode: string;
  walletBalance: number;
  uid: string;
  email: string | null;
}

const PLANS: Plan[] = [
  { id: "1m", name: "1 Month", price: 15 },
  { id: "3m", name: "3 Months", price: 35 },
  { id: "12m", name: "12 Months", price: 80 },
  { id: "custom", name: "Custom Package", price: 0 },
];

export const WHATSAPP_NUMBER = "+1234567890"; // Replace with your actual number

function App() {
  const [firebaseUser, loading] = useAuthState(auth);
  const [view, setView] = useState<View>("auth");
  const [isDark, setIsDark] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Connection Test
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
        }
      }
    }
    testConnection();
  }, []);

  useEffect(() => {
    if (firebaseUser) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserProfile(docSnap.data() as UserProfile);
            setView("home");
          } else {
            setView("onboarding");
          }
          setIsAuthReady(true);
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      };
      fetchProfile();
    } else if (!loading) {
      setView("auth");
      setIsAuthReady(true);
    }
  }, [firebaseUser, loading]);

  // Real-time Orders
  useEffect(() => {
    if (!firebaseUser || !isAuthReady) return;

    const q = query(
      collection(db, "orders"),
      where("uid", "==", firebaseUser.uid),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, "orders");
    });

    return () => unsubscribe();
  }, [firebaseUser, isAuthReady]);

  // Real-time Profile (for wallet balance)
  useEffect(() => {
    if (!firebaseUser || !isAuthReady) return;

    const unsubscribe = onSnapshot(doc(db, "users", firebaseUser.uid), (snapshot) => {
      if (snapshot.exists()) {
        setUserProfile(snapshot.data() as UserProfile);
      }
    });

    return () => unsubscribe();
  }, [firebaseUser, isAuthReady]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const saveOrder = async () => {
    if (!firebaseUser || !selectedPlan || !selectedDevice || !userProfile) return;
    
    const newOrder = {
      clientName: `${userProfile.firstName} ${userProfile.lastName}`,
      email: firebaseUser.email,
      zipCode: userProfile.zipCode,
      selectedPlan: selectedPlan.name,
      deviceType: selectedDevice,
      timestamp: serverTimestamp(),
      status: "Verifying",
      uid: firebaseUser.uid
    };
    
    try {
      await addDoc(collection(db, "orders"), newOrder);
      console.log("Order saved successfully");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "orders");
      alert("Connection slow, retrying...");
    }
  };

  const handleTransition = (nextView: View) => {
    if (nextView === "success") {
      saveOrder();
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setView("success");
      }, 3000);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setView(nextView);
      setIsLoading(false);
    }, 800);
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleOnboarding = async (data: any) => {
    if (!firebaseUser) return;

    const profileData: UserProfile = {
      ...data,
      walletBalance: 0,
      uid: firebaseUser.uid,
      email: firebaseUser.email
    };

    try {
      await setDoc(doc(db, "users", firebaseUser.uid), profileData);
      setUserProfile(profileData);
      handleTransition("home");
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
      alert("Connection slow, retrying...");
    }
  };

  const handleTopUp = async (amount: number) => {
    if (!firebaseUser) return;
    try {
      const userRef = doc(db, "users", firebaseUser.uid);
      await updateDoc(userRef, {
        walletBalance: increment(amount)
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setView("auth");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen flex flex-col premium-gradient">
      <AnimatePresence>
        {isLoading && <LoadingSpinner />}
        {isVerifying && <LoadingSpinner label="Payment Confirmed!" />}
      </AnimatePresence>

      {/* Sticky Header */}
      {view !== "auth" && (
        <header className="sticky top-0 z-30 w-full bg-black/10 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="font-display font-bold text-2xl text-white">
              ConnectFlow<span className="text-white/50"> Pro</span>
            </h1>
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1 max-w-md mx-auto w-full p-6 pb-32">
        <Suspense fallback={<LoadingSpinner />}>
          <AnimatePresence mode="wait">
            {view === "auth" && (
              <motion.div
                key="auth"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <AuthView onLogin={handleGoogleLogin} />
              </motion.div>
            )}
            {view === "onboarding" && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <OnboardingView onSubmit={handleOnboarding} />
              </motion.div>
            )}
            {view === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <HomeView userProfile={userProfile} firebaseUser={firebaseUser} onTransition={handleTransition} />
              </motion.div>
            )}
            {view === "iptv" && (
              <motion.div
                key="iptv"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <IPTVView 
                  selectedDevice={selectedDevice} 
                  setSelectedDevice={setSelectedDevice} 
                  onTransition={handleTransition} 
                  onBack={() => setView("home")} 
                />
              </motion.div>
            )}
            {view === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <PaymentView 
                  selectedDevice={selectedDevice} 
                  selectedPlan={selectedPlan} 
                  setSelectedPlan={setSelectedPlan} 
                  plans={PLANS} 
                  onTransition={handleTransition} 
                  userProfile={userProfile}
                  onWalletPayment={async (amount) => {
                    if (!firebaseUser) return;
                    try {
                      const userRef = doc(db, "users", firebaseUser.uid);
                      await updateDoc(userRef, {
                        walletBalance: increment(-amount)
                      });
                      handleTransition("success");
                    } catch (err) {
                      handleFirestoreError(err, OperationType.UPDATE, `users/${firebaseUser.uid}`);
                      alert("Connection slow, retrying...");
                    }
                  }}
                />
              </motion.div>
            )}
            {view === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <SuccessView selectedDevice={selectedDevice} onTransition={handleTransition} />
              </motion.div>
            )}
            {view === "orders" && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <OrdersView orders={orders} onTransition={handleTransition} />
              </motion.div>
            )}
            {view === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ProfileView 
                  userProfile={userProfile} 
                  firebaseUser={firebaseUser} 
                  orders={orders} 
                  onSignOut={handleSignOut} 
                  onTopUp={handleTopUp}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Bottom Navigation */}
      {view !== "auth" && (
        <nav className="fixed bottom-0 left-0 right-0 bg-black/20 backdrop-blur-2xl border-t border-white/10 px-6 py-4 pb-8 z-30">
          <div className="max-w-md mx-auto flex items-center justify-around">
            {[
              { id: "home", label: "Home", icon: Home },
              { id: "orders", label: "Orders", icon: ShoppingBag },
              { id: "profile", label: "Mine", icon: User },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setView(item.id as View)}
                className={cn(
                  "flex flex-col items-center gap-1 transition-all",
                  view === item.id ? "text-white" : "text-white/40"
                )}
              >
                <item.icon size={24} />
                <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
                {view === item.id && (
                  <motion.div layoutId="nav-indicator" className="w-1.5 h-1.5 bg-white rounded-full mt-1" />
                )}
              </button>
            ))}
          </div>
        </nav>
      )}
      <WhatsAppButton />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}
