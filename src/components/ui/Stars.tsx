"use client";

import { COLORS } from "@/lib/themes";

interface StarsProps {
  count: number;
  size?: number;
}

export function Stars({ count, size = 13 }: StarsProps) {
  return (
    <span style={{ fontSize: size, letterSpacing: 1 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{
            color: i < count ? COLORS.orange : "rgba(255,255,255,0.1)",
          }}
        >
          ★
        </span>
      ))}
    </span>
  );
}
