export type DeviceType = "Firestick" | "Android" | "iOS";

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export const PLANS: Plan[] = [
  { id: "1m", name: "1 Month", price: 15, duration: "1 Month" },
  { id: "3m", name: "3 Months", price: 35, duration: "3 Months" },
  { id: "12m", name: "12 Months", price: 80, duration: "12 Months" },
];

export interface HomeService {
  id: string;
  name: string;
  icon: string;
}

export const HOME_SERVICES: HomeService[] = [
  { id: "locksmith", name: "Locksmith", icon: "Key" },
  { id: "roofing", name: "Roofing", icon: "Home" },
  { id: "tree", name: "Tree Cutting", icon: "Trees" },
  { id: "plumbing", name: "Plumbing", icon: "Droplets" },
  { id: "electrician", name: "Electrician", icon: "Zap" },
];
