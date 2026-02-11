"use client";

import { useState, useRef } from "react";
import { Icons } from "@/components/ui/Icons";
import { Theme, SEASONS, COLORS } from "@/lib/themes";
import { useJST } from "@/hooks/useJST";
import { Season } from "@/lib/themes";

interface HeaderProps {
  theme: Theme;
  season: Season;
  isSecret: boolean;
  profileName?: string;
  onLongPress: () => void;
}

export function Header({
  theme,
  season,
  isSecret,
  profileName,
  onLongPress,
}: HeaderProps) {
  const { formatted } = useJST();
  const [longPressStart, setLongPressStart] = useState<number | null>(null);

  const handleMouseDown = () => setLongPressStart(Date.now());
  const handleMouseUp = () => {
    if (longPressStart && Date.now() - longPressStart > 800) {
      onLongPress();
    }
    setLongPressStart(null);
  };

  return (
    <>
      <div
        style={{
          padding: "12px 20px 8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "sticky",
          top: 0,
          zIndex: 100,
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
          backdropFilter: "blur(24px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {/* Logo */}
        <div
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setLongPressStart(null)}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: 8,
              fontFamily: "'Orbitron', sans-serif",
              background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent2})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            TENOUCHI
          </div>
          <div
            style={{
              fontSize: 7,
              color: `${theme.accent}50`,
              letterSpacing: 4,
              marginTop: 1,
            }}
          >
            手の内 • {SEASONS[season].label}
          </div>
        </div>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {isSecret && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                padding: "3px 8px",
                borderRadius: 4,
                background: `${COLORS.secret}0A`,
                border: `1px solid ${COLORS.secret}20`,
              }}
            >
              {Icons.lock(COLORS.secret, 10)}
              <span
                style={{
                  fontSize: 7,
                  color: COLORS.secret,
                  fontWeight: 700,
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                SECRET
              </span>
            </div>
          )}
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                justifyContent: "flex-end",
              }}
            >
              {Icons.weather(theme.accent, 14)}
              <span
                style={{
                  fontSize: 13,
                  color: COLORS.text1,
                  fontFamily: "'Orbitron', sans-serif",
                }}
              >
                8°C
              </span>
            </div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: COLORS.text1,
                letterSpacing: 3,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {formatted.time}
            </div>
            <div style={{ fontSize: 8, color: COLORS.text3 }}>
              {formatted.date} JST
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div
        style={{
          padding: "4px 20px",
          background: `linear-gradient(90deg, ${theme.accent}08, transparent)`,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: theme.accent,
            animation: "pulse 1.5s infinite",
          }}
        />
        <span style={{ fontSize: 9, color: `${theme.accent}70` }}>
          {isSecret
            ? "SECRET_MODE"
            : `${profileName || ""} • Lv.3 • 2 URGENT`}
        </span>
      </div>
    </>
  );
}
