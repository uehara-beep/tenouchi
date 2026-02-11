// Seasonal theme definitions for TENOUCHI

export type Season = "spring" | "summer" | "autumn" | "winter";

export interface Theme {
  bg1: string;
  bg2: string;
  accent: string;
  accent2: string;
  a1: string;
  a2: string;
  a3: string;
  label: string;
  sc: string;
}

export const SEASONS: Record<Season, Theme> = {
  spring: {
    bg1: "#241E38",
    bg2: "#2D2448",
    accent: "#F9A8D4",
    accent2: "#F472B6",
    a1: "rgba(249,168,212,0.09)",
    a2: "rgba(244,114,182,0.06)",
    a3: "rgba(251,191,36,0.05)",
    label: "春",
    sc: "230,210,255",
  },
  summer: {
    bg1: "#152838",
    bg2: "#1A3248",
    accent: "#22D3EE",
    accent2: "#06B6D4",
    a1: "rgba(34,211,238,0.09)",
    a2: "rgba(6,182,212,0.06)",
    a3: "rgba(59,130,246,0.05)",
    label: "夏",
    sc: "190,230,255",
  },
  autumn: {
    bg1: "#281E14",
    bg2: "#32261A",
    accent: "#FB923C",
    accent2: "#F97316",
    a1: "rgba(251,146,60,0.09)",
    a2: "rgba(249,115,22,0.06)",
    a3: "rgba(234,88,12,0.05)",
    label: "秋",
    sc: "255,225,190",
  },
  winter: {
    bg1: "#182035",
    bg2: "#1E2A4A",
    accent: "#93C5FD",
    accent2: "#60A5FA",
    a1: "rgba(147,197,253,0.09)",
    a2: "rgba(96,165,250,0.06)",
    a3: "rgba(139,92,246,0.05)",
    label: "冬",
    sc: "210,225,255",
  },
};

export const SECRET_THEME: Theme = {
  bg1: "#0A0A10",
  bg2: "#0E0E18",
  accent: "#FF2D78",
  accent2: "#FF7EB3",
  a1: "rgba(255,45,120,0.04)",
  a2: "rgba(0,0,0,0)",
  a3: "rgba(0,0,0,0)",
  label: "秘",
  sc: "255,100,150",
};

// Color constants
export const COLORS = {
  orange: "#FF6B00",
  secret: "#FF2D78",
  text1: "#F0F0F5",
  text2: "rgba(240,240,245,0.6)",
  text3: "rgba(240,240,245,0.35)",
};

// Priority colors
export const PRIORITY = {
  urgent: { label: "URGENT", color: "#FF3B3B" },
  today: { label: "TODAY", color: "#FFB800" },
  this_week: { label: "WEEK", color: "#00D68F" },
};

export function getSeason(month: number): Season {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

export function getJSTMonth(): number {
  const d = new Date();
  d.setHours(d.getHours() + 9 - d.getTimezoneOffset() / -60);
  return d.getMonth() + 1;
}
