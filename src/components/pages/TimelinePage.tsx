"use client";

import { useState } from "react";
import { RetroCard } from "@/components/cards";
import { Icons, SourceIcons, SourceLabels } from "@/components/ui/Icons";
import { PRIORITY, Theme, COLORS } from "@/lib/themes";
import { TIMELINE_DATA, TimelineItem } from "@/lib/data";

interface TimelinePageProps {
  theme: Theme;
}

interface PriorityGroup {
  key: "urgent" | "today" | "this_week";
  label: string;
  color: string;
  items: TimelineItem[];
}

export function TimelinePage({ theme }: TimelinePageProps) {
  const [expanded, setExpanded] = useState<number | null>(null);

  const groups: PriorityGroup[] = (
    Object.entries(PRIORITY) as [
      "urgent" | "today" | "this_week",
      { label: string; color: string }
    ][]
  )
    .map(([key, value]) => ({
      key,
      label: value.label,
      color: value.color,
      items: TIMELINE_DATA.filter((item) => item.pr === key),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div>
      {groups.map((group) => (
        <div key={group.key} style={{ marginBottom: 28 }}>
          {/* Group header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: group.color,
                boxShadow: `0 0 12px ${group.color}`,
                animation: group.key === "urgent" ? "pulse 1.5s infinite" : "none",
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: group.color,
                letterSpacing: 4,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {group.label}
            </span>
            <div
              style={{
                flex: 1,
                height: 1,
                background: `repeating-linear-gradient(90deg, ${group.color}40, ${group.color}40 4px, transparent 4px, transparent 8px)`,
              }}
            />
          </div>

          {/* Items */}
          {group.items.map((item, idx) => (
            <div key={item.id} style={{ marginBottom: 12 }}>
              <RetroCard
                delay={idx * 100}
                glitch={group.color}
                onClick={() =>
                  setExpanded(expanded === item.id ? null : item.id)
                }
              >
                {/* Source & time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  {SourceIcons[item.src] && SourceIcons[item.src]()}
                  <span
                    style={{
                      fontSize: 10,
                      color: "#00FFC8",
                      fontFamily: "'Orbitron', sans-serif",
                      letterSpacing: 1,
                    }}
                  >
                    {SourceLabels[item.src]}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: COLORS.text3,
                      fontFamily: "monospace",
                    }}
                  >
                    {item.time}
                  </span>
                </div>

                {/* From & subject */}
                <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.text1 }}>
                  {item.from}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: COLORS.text2,
                    marginBottom: 10,
                    fontFamily: "monospace",
                  }}
                >
                  {item.subj}
                </div>

                {/* AI summary */}
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: 2,
                    background: "rgba(0,255,200,0.04)",
                    border: "1px dashed rgba(0,255,200,0.15)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      color: "#00FFC8",
                      fontFamily: "'Orbitron', sans-serif",
                      letterSpacing: 2,
                    }}
                  >
                    ▶ AI
                  </span>
                  <div
                    style={{
                      fontSize: 12,
                      color: "rgba(0,255,200,0.7)",
                      lineHeight: 1.5,
                      fontFamily: "monospace",
                      marginTop: 4,
                    }}
                  >
                    {item.ai}
                  </div>
                </div>

                {/* Expanded actions */}
                {expanded === item.id && (
                  <div
                    style={{
                      marginTop: 14,
                      display: "flex",
                      gap: 10,
                      animation: "fadeUp 0.3s",
                    }}
                  >
                    {item.draft && (
                      <button
                        style={{
                          padding: "11px 22px",
                          borderRadius: 4,
                          border: "1px solid rgba(0,255,200,0.3)",
                          background: "rgba(0,255,200,0.08)",
                          color: "#00FFC8",
                          fontSize: 12,
                          fontWeight: 700,
                          cursor: "pointer",
                          fontFamily: "'Orbitron', sans-serif",
                          letterSpacing: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {Icons.reply("#00FFC8")} REPLY
                      </button>
                    )}
                    <button
                      style={{
                        padding: "11px 18px",
                        borderRadius: 4,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "transparent",
                        color: COLORS.text3,
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "monospace",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {Icons.clock(COLORS.text3)} SNOOZE
                    </button>
                  </div>
                )}
              </RetroCard>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
