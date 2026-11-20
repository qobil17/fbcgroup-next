export type ServiceCollection = "ALIF" | "HPLINE";
export type ServiceDetail =
  | "HPL"
  | "ALIKAFON"
  | "GRANITE"
  | "SERANIT"
  | "LED"
  | "DECORATIVE"
  | "EMERGENCY_LIGHT";
export type ServiceType = "DELIVERY" | "INSTALLATION" | "FULL_PROJECT";
export type ServiceArea = "INTERIOR" | "EXTERIOR";
export type OrderStatus = "PAUSE" | "PROCESS" | "FINISH" | "CANCELLED";

export interface Service {
  _id: string;
  serviceCollection: ServiceCollection;
  serviceTitle: string;
  serviceType: ServiceType;
  serviceStatus: string;
  serviceDetail?: ServiceDetail | null;
  serviceArea: ServiceArea;
  servicePrice: number;
  serviceDesc?: string | null;
  serviceImages: string[];
  serviceViews: number;
  createdAt: string;
}

export interface Order {
  _id: string;
  phone: string;
  orderStatus: OrderStatus;
  serviceCollection: ServiceCollection;
  serviceDetail: ServiceDetail;
  serviceType: ServiceType;
  serviceArea: ServiceArea;
  createdAt: string;
}

export interface AuthMember {
  _id: string;
  memberNick: string;
  memberPhone: string;
  memberType: "USER" | "ADMIN";
  memberImage?: string;
}

// Ekranda ko'rsatish uchun o'zbekcha nomlar
export const LABELS: Record<string, string> = {
  ALIF: "Alif Lighting",
  HPLINE: "HPLine",
  HPL: "HPL panel",
  ALIKAFON: "Alyukobond",
  GRANITE: "Granit",
  SERANIT: "Keramogranit",
  LED: "LED yoritish",
  DECORATIVE: "Dekorativ yoritish",
  EMERGENCY_LIGHT: "Avariya yoritgichi",
  DELIVERY: "Yetkazib berish",
  INSTALLATION: "O'rnatish",
  FULL_PROJECT: "To'liq loyiha",
  INTERIOR: "Ichki",
  EXTERIOR: "Tashqi",
  PAUSE: "Kutilmoqda",
  PROCESS: "Jarayonda",
  FINISH: "Yakunlangan",
  CANCELLED: "Bekor qilingan",
};

export const label = (key?: string | null) => (key ? LABELS[key] ?? key : "");
