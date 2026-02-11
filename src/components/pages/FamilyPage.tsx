"use client";

import { ScrapCard } from "@/components/cards";
import { FamilyIcons, Icons } from "@/components/ui/Icons";
import { Theme, COLORS } from "@/lib/themes";
import { FAMILY_EVENTS, FamilyEvent } from "@/lib/data";

interface FamilyPageProps {
  theme: Theme;
}

export function FamilyPage({ theme }: FamilyPageProps) {
  // Group events by month
  const months: Record<string, FamilyEvent[]> = {};
  FAMILY_EVENTS.forEach((e) => {
    const m = e.date.split("/")[0] + "月";
    if (!months[m]) months[m] = [];
    months[m].push(e);
  });

  const getIcon = (event: FamilyEvent) =>
    FamilyIcons[event.cat] || Icons.cal;

  const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 0.5];
  let idx = 0;

  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: COLORS.text3,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: 4,
          marginBottom: 8,
        }}
      >
        FAMILY EVENTS
      </div>
      <div
        style={{
          fontSize: 16,
          color: `${theme.accent}90`,
          marginBottom: 20,
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
        }}
      >
        〜 みんなの大事な日 〜
      </div>

      {Object.entries(months).map(([month, events]) => (
        <div key={month} style={{ marginBottom: 24 }}>
          <div
            style={{
              fontSize: 14,
              color: theme.accent,
              fontWeight: 700,
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: 3,
              marginBottom: 14,
              display: "inline-block",
              borderBottom: `2px dashed ${theme.accent}30`,
              paddingBottom: 4,
            }}
          >
            {month}
          </div>

          {events.map((event, i) => {
            const rot = rotations[idx++ % rotations.length];
            return (
              <div key={event.id} style={{ marginBottom: 14 }}>
                <ScrapCard
                  delay={i * 100}
                  tape={i % 2 === 0}
                  sticker={event.color}
                  rotate={rot}
                  style={{ borderLeft: `4px solid ${event.color}40` }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 12,
                        background: `${event.color}0A`,
                        border: `2px dashed ${event.color}25`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transform: `rotate(${-rot}deg)`,
                      }}
                    >
                      {getIcon(event)(event.color, 24)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: COLORS.text1,
                        }}
                      >
                        {event.title}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: COLORS.text3,
                          fontStyle: "italic",
                          marginTop: 2,
                        }}
                      >
                        {event.cat}
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "8px 14px",
                        borderRadius: 8,
                        background: `${event.color}0A`,
                        border: `1px dashed ${event.color}20`,
                        fontSize: 16,
                        color: event.color,
                        fontWeight: 700,
                        fontFamily: "'Orbitron', sans-serif",
                        transform: "rotate(2deg)",
                      }}
                    >
                      {event.date.split("/")[1]}
                    </div>
                  </div>
                </ScrapCard>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
