"use client";

import { Theme } from "@/lib/themes";

interface AuroraProps {
  theme: Theme;
}

export function Aurora({ theme }: AuroraProps) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "60%",
          height: "50%",
          background: `radial-gradient(ellipse, ${theme.a1}, transparent 70%)`,
          animation: "am1 12s ease-in-out infinite",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "-15%",
          width: "50%",
          height: "60%",
          background: `radial-gradient(ellipse, ${theme.a2}, transparent 70%)`,
          animation: "am2 15s ease-in-out infinite",
          filter: "blur(80px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "20%",
          width: "50%",
          height: "40%",
          background: `radial-gradient(ellipse, ${theme.a3}, transparent 70%)`,
          animation: "am3 18s ease-in-out infinite",
          filter: "blur(70px)",
        }}
      />
    </div>
  );
}
