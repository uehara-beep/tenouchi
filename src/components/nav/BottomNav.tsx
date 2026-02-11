"use client";

import { ReactNode } from "react";
import { Icons } from "@/components/ui/Icons";
import { Theme, COLORS } from "@/lib/themes";

export type PageId =
  | "timeline"
  | "money"
  | "family"
  | "discover"
  | "people"
  | "notes";

interface NavItem {
  id: PageId;
  icon: (c: string, s?: number) => ReactNode;
}

const navItems: NavItem[] = [
  { id: "timeline", icon: Icons.feed },
  { id: "money", icon: Icons.money },
  { id: "family", icon: Icons.home },
  { id: "discover", icon: Icons.discover },
  { id: "people", icon: Icons.people },
  { id: "notes", icon: Icons.memo },
];

interface BottomNavProps {
  page: PageId;
  setPage: (page: PageId) => void;
  isSecret: boolean;
  theme: Theme;
}

export function BottomNav({ page, setPage, isSecret, theme }: BottomNavProps) {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 14,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        gap: 3,
        padding: "6px 10px",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
        backdropFilter: "blur(30px)",
        borderRadius: 32,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
        zIndex: 100,
      }}
    >
      {navItems.map((item) => {
        const active = page === item.id;
        const isSecretItem = item.id === "people" || item.id === "money";
        const color = active
          ? isSecret && isSecretItem
            ? COLORS.secret
            : theme.accent
          : COLORS.text3;

        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            style={{
              width: active ? 52 : 42,
              height: 42,
              borderRadius: 22,
              border: "none",
              cursor: "pointer",
              background: active ? `${color}12` : "transparent",
              boxShadow: active ? `0 0 16px ${color}15` : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
              position: "relative",
            }}
          >
            <div style={{ color, transition: "color 0.3s" }}>
              {item.icon(color)}
            </div>
            {active && (
              <div
                style={{
                  position: "absolute",
                  bottom: 2,
                  width: 12,
                  height: 2,
                  borderRadius: 1,
                  background: color,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
