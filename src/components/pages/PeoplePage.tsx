"use client";

import { useState } from "react";
import { GlassCard, RetroCard } from "@/components/cards";
import { Stars } from "@/components/ui/Stars";
import { Theme, COLORS } from "@/lib/themes";
import { WOMEN_DATA, BUSINESS_CONTACTS, Woman } from "@/lib/data";

interface PeoplePageProps {
  isSecret: boolean;
  onRequestUnlock: () => void;
  theme: Theme;
}

export function PeoplePage({
  isSecret,
  onRequestUnlock,
  theme,
}: PeoplePageProps) {
  const [selected, setSelected] = useState<Woman | null>(null);

  // Secret mode - Woman detail view
  if (isSecret && selected) {
    const w = selected;
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          style={{
            background: "none",
            border: `1px solid ${COLORS.secret}30`,
            borderRadius: 4,
            color: COLORS.secret,
            fontSize: 11,
            cursor: "pointer",
            marginBottom: 16,
            padding: "6px 14px",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 2,
          }}
        >
          ◀ BACK
        </button>

        <RetroCard delay={0} glitch={COLORS.secret}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 4,
                background: `${COLORS.secret}0C`,
                border: `2px solid ${COLORS.secret}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                fontSize: 28,
                fontWeight: 800,
                fontFamily: "'Orbitron', sans-serif",
                color: COLORS.secret,
                textShadow: `0 0 12px ${COLORS.secret}`,
              }}
            >
              {w.av}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: COLORS.text1 }}>
              {w.nm}
            </div>
            <div
              style={{
                fontSize: 13,
                color: COLORS.text2,
                marginTop: 4,
                fontFamily: "monospace",
              }}
            >
              {w.age} // {w.job}
            </div>
          </div>
        </RetroCard>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
            marginTop: 14,
          }}
        >
          {[
            { l: "SEX", v: w.sex },
            { l: "LOOKS", v: w.looks },
            { l: "MIND", v: w.per },
            { l: "ALL", v: w.ov },
          ].map((r, i) => (
            <RetroCard key={r.l} delay={i * 60}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: 8,
                    color: "#00FFC8",
                    fontFamily: "'Orbitron', sans-serif",
                    letterSpacing: 2,
                    marginBottom: 6,
                  }}
                >
                  {r.l}
                </div>
                <Stars count={r.v} />
              </div>
            </RetroCard>
          ))}
        </div>
      </div>
    );
  }

  // Secret mode - Women list
  if (isSecret) {
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              background: COLORS.secret,
              boxShadow: `0 0 12px ${COLORS.secret}`,
              animation: "pulse 1.5s infinite",
            }}
          />
          <span
            style={{
              fontSize: 9,
              color: COLORS.secret,
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: 3,
            }}
          >
            SECRET_MODE
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {WOMEN_DATA.map((w, i) => (
            <RetroCard
              key={w.id}
              delay={i * 100}
              glitch={COLORS.secret}
              onClick={() => setSelected(w)}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 4,
                    background: `${COLORS.secret}08`,
                    border: `2px solid ${COLORS.secret}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 10px",
                    fontSize: 22,
                    fontWeight: 800,
                    fontFamily: "'Orbitron', sans-serif",
                    color: COLORS.secret,
                    textShadow: `0 0 8px ${COLORS.secret}`,
                  }}
                >
                  {w.av}
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 700, color: COLORS.text1 }}
                >
                  {w.nm}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.text2,
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  {w.age} // {w.job}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Stars count={w.ov} size={11} />
                </div>
              </div>
            </RetroCard>
          ))}
        </div>
      </div>
    );
  }

  // Normal mode - Business contacts
  return (
    <div>
      <div
        style={{
          fontSize: 9,
          color: COLORS.text3,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: 4,
          marginBottom: 16,
        }}
      >
        CONTACTS
      </div>

      {BUSINESS_CONTACTS.map((p, i) => (
        <GlassCard
          key={i}
          delay={i * 80}
          style={{ marginBottom: 10, borderRadius: 22 }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 16,
                background: `${theme.accent}08`,
                border: `1px solid ${theme.accent}12`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                fontWeight: 800,
                fontFamily: "'Orbitron', sans-serif",
                color: theme.accent,
              }}
            >
              {p.nm[0]}
            </div>
            <div>
              <div
                style={{ fontSize: 15, fontWeight: 600, color: COLORS.text1 }}
              >
                {p.nm}
              </div>
              <div style={{ fontSize: 12, color: COLORS.text2 }}>
                {p.co} / {p.pos}
              </div>
            </div>
          </div>
        </GlassCard>
      ))}

      {/* Hidden trigger for secret mode */}
      <div
        onClick={onRequestUnlock}
        style={{ marginTop: 40, padding: 16, textAlign: "center", cursor: "pointer" }}
      >
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.03)" }}>•</span>
      </div>
    </div>
  );
}
