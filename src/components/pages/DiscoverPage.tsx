"use client";

import { GlassCard } from "@/components/cards";
import { Icons } from "@/components/ui/Icons";
import { Theme, COLORS } from "@/lib/themes";
import { TRENDS_DATA } from "@/lib/data";

interface DiscoverPageProps {
  theme: Theme;
}

export function DiscoverPage({ theme }: DiscoverPageProps) {
  return (
    <div>
      {/* Search bar */}
      <GlassCard
        delay={0}
        style={{ padding: "14px 18px", marginBottom: 20, borderRadius: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={COLORS.text3}
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span style={{ fontSize: 14, color: COLORS.text3 }}>検索...</span>
        </div>
      </GlassCard>

      {/* AI Picks */}
      <GlassCard
        delay={80}
        style={{
          marginBottom: 24,
          borderRadius: 28,
          borderColor: `${theme.accent}20`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 10,
          }}
        >
          {Icons.ai(theme.accent, 14)}
          <span
            style={{
              fontSize: 9,
              color: theme.accent,
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: 2,
            }}
          >
            AI PICKS
          </span>
        </div>
        <div style={{ fontSize: 14, color: COLORS.text1, lineHeight: 1.6 }}>
          NEXCO西日本が来月の予算計画を発表。水切り工事の需要が前年比120%増。
        </div>
      </GlassCard>

      {/* Trends by source */}
      {TRENDS_DATA.map((trend, ti) => (
        <div key={trend.src} style={{ marginBottom: 22 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 10,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: trend.color,
                boxShadow: `0 0 10px ${trend.color}60`,
              }}
            />
            <span
              style={{
                fontSize: 10,
                color: trend.color,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: 2,
                fontWeight: 700,
              }}
            >
              {trend.src}
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: `linear-gradient(90deg, ${trend.color}30, transparent)`,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {trend.items.map((item, i) => (
              <GlassCard
                key={item}
                delay={ti * 80 + i * 60}
                style={{
                  padding: "16px",
                  borderRadius: 20,
                  minWidth: 170,
                  flexShrink: 0,
                  borderColor: `${trend.color}15`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 8,
                  }}
                >
                  {Icons.trend(trend.color, 13)}
                  <span
                    style={{
                      fontSize: 8,
                      color: trend.color,
                      fontFamily: "'Orbitron', sans-serif",
                    }}
                  >
                    TREND
                  </span>
                </div>
                <div
                  style={{ fontSize: 14, color: COLORS.text1, fontWeight: 500 }}
                >
                  {item}
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
