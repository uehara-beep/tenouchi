"use client";

import { useState, useEffect } from "react";
import { NeuCard, RetroCard } from "@/components/cards";
import { Icons } from "@/components/ui/Icons";
import { AnimatedNumber } from "@/components/ui/AnimatedNumber";
import { Theme, COLORS } from "@/lib/themes";
import { MONEY_DATA, STASH_DATA } from "@/lib/data";

interface MoneyPageProps {
  theme: Theme;
  isSecret: boolean;
}

export function MoneyPage({ theme, isSecret }: MoneyPageProps) {
  const [barAnimated, setBarAnimated] = useState(false);
  const [stashView, setStashView] = useState(false);

  useEffect(() => {
    setTimeout(() => setBarAnimated(true), 300);
  }, []);

  // Secret mode - Stash detail view
  if (isSecret && stashView) {
    const pct = Math.round((STASH_DATA.balance / STASH_DATA.target) * 100);

    return (
      <div>
        <button
          onClick={() => setStashView(false)}
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {Icons.safe(COLORS.secret, 22)}
            <span
              style={{
                fontSize: 10,
                color: COLORS.secret,
                fontFamily: "'Orbitron', sans-serif",
                letterSpacing: 3,
              }}
            >
              PRIVATE VAULT
            </span>
          </div>
          <AnimatedNumber
            value={STASH_DATA.balance}
            prefix="¥"
            color={COLORS.secret}
            size={36}
          />
          <div style={{ marginTop: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: COLORS.text3,
                  fontFamily: "monospace",
                }}
              >
                TARGET: ¥{STASH_DATA.target.toLocaleString()}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: COLORS.secret,
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 700,
                }}
              >
                {pct}%
              </span>
            </div>
            <div
              style={{
                height: 6,
                borderRadius: 3,
                background: "rgba(255,255,255,0.04)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  borderRadius: 3,
                  width: barAnimated ? `${pct}%` : "0%",
                  background: `linear-gradient(90deg, ${COLORS.secret}, ${COLORS.secret}88)`,
                  boxShadow: `0 0 14px ${COLORS.secret}40`,
                  transition: "width 1.2s cubic-bezier(0.22,1,0.36,1)",
                }}
              />
            </div>
          </div>
        </RetroCard>

        <div
          style={{
            fontSize: 9,
            color: "#00FFC8",
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 3,
            margin: "20px 0 12px 4px",
          }}
        >
          HISTORY
        </div>

        {STASH_DATA.recent.map((tx, i) => (
          <RetroCard
            key={i}
            delay={200 + i * 80}
            glitch={tx.dir === "in" ? "#00D68F" : COLORS.secret}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: 14 }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  background:
                    tx.dir === "in"
                      ? "rgba(0,214,143,0.06)"
                      : `${COLORS.secret}08`,
                  border: `1px solid ${
                    tx.dir === "in"
                      ? "rgba(0,214,143,0.15)"
                      : `${COLORS.secret}15`
                  }`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tx.dir === "in"
                  ? Icons.arrIn("#00D68F")
                  : Icons.arrOut(COLORS.secret)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: COLORS.text1 }}>{tx.n}</div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.text3,
                    fontFamily: "monospace",
                    marginTop: 2,
                  }}
                >
                  {tx.d}
                </div>
              </div>
              <span
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: "'Orbitron', sans-serif",
                  color: tx.dir === "in" ? "#00D68F" : COLORS.secret,
                }}
              >
                {tx.dir === "in" ? "+" : "-"}¥{tx.a.toLocaleString()}
              </span>
            </div>
          </RetroCard>
        ))}
      </div>
    );
  }

  // Secret mode - Overview
  if (isSecret) {
    return (
      <div>
        <NeuCard
          delay={0}
          style={{ padding: "28px 24px", marginBottom: 20, borderRadius: 28 }}
        >
          <div
            style={{
              fontSize: 9,
              color: COLORS.text3,
              fontFamily: "'Orbitron', sans-serif",
              letterSpacing: 4,
              marginBottom: 8,
            }}
          >
            BALANCE
          </div>
          <AnimatedNumber
            value={MONEY_DATA.income - MONEY_DATA.expense}
            prefix="¥"
            color={theme.accent}
            size={36}
          />
        </NeuCard>

        <RetroCard
          delay={100}
          glitch={COLORS.secret}
          onClick={() => setStashView(true)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {Icons.safe(COLORS.secret, 20)}
            <div>
              <div
                style={{
                  fontSize: 9,
                  color: COLORS.secret,
                  fontFamily: "'Orbitron', sans-serif",
                  letterSpacing: 2,
                }}
              >
                PRIVATE VAULT
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: COLORS.text1,
                  fontFamily: "'Orbitron', sans-serif",
                  marginTop: 4,
                }}
              >
                ¥••••••
              </div>
            </div>
            <div style={{ flex: 1 }} />
            <span style={{ fontSize: 18, color: COLORS.text3 }}>›</span>
          </div>
        </RetroCard>
        <div
          style={{
            fontSize: 8,
            color: COLORS.text3,
            textAlign: "center",
            marginTop: 8,
            fontFamily: "monospace",
          }}
        >
          tap to reveal
        </div>
      </div>
    );
  }

  // Normal mode
  return (
    <div>
      {/* Balance card */}
      <NeuCard
        delay={0}
        style={{ padding: "28px 24px", marginBottom: 20, borderRadius: 28 }}
      >
        <div
          style={{
            fontSize: 9,
            color: COLORS.text3,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: 4,
            marginBottom: 8,
          }}
        >
          BALANCE
        </div>
        <AnimatedNumber
          value={MONEY_DATA.income - MONEY_DATA.expense}
          prefix="¥"
          color={theme.accent}
          size={40}
        />
        <div style={{ display: "flex", gap: 24, marginTop: 16 }}>
          <div>
            {Icons.arrIn("#00D68F", 14)}
            <div
              style={{
                fontSize: 16,
                color: "#00D68F",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              +¥{MONEY_DATA.income.toLocaleString()}
            </div>
          </div>
          <div>
            {Icons.arrOut("#FF3B3B", 14)}
            <div
              style={{
                fontSize: 16,
                color: "#FF3B3B",
                fontWeight: 600,
                marginTop: 4,
              }}
            >
              -¥{MONEY_DATA.expense.toLocaleString()}
            </div>
          </div>
        </div>
      </NeuCard>

      {/* Categories */}
      {MONEY_DATA.cats.map((cat, i) => (
        <NeuCard
          key={cat.n}
          delay={i * 80}
          style={{ padding: "14px 18px", marginBottom: 10, borderRadius: 20 }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <span style={{ fontSize: 13, color: COLORS.text1 }}>{cat.n}</span>
            <span
              style={{ fontSize: 14, color: theme.accent, fontWeight: 700 }}
            >
              ¥{cat.a.toLocaleString()}
            </span>
          </div>
          <div
            style={{
              height: 8,
              borderRadius: 12,
              background: "rgba(0,0,0,0.25)",
              boxShadow: "inset 2px 2px 4px rgba(0,0,0,0.3)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                borderRadius: 12,
                width: barAnimated ? `${cat.p}%` : "0%",
                background: `linear-gradient(90deg, ${theme.accent}, ${theme.accent2})`,
                boxShadow: `0 2px 8px ${theme.accent}40, inset 0 1px 0 rgba(255,255,255,0.2)`,
                transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`,
              }}
            />
          </div>
        </NeuCard>
      ))}

      {/* Recent transactions */}
      <div
        style={{
          fontSize: 9,
          color: COLORS.text3,
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: 3,
          margin: "20px 0 12px 4px",
        }}
      >
        RECENT
      </div>
      {MONEY_DATA.recent.map((tx, i) => (
        <NeuCard
          key={i}
          delay={400 + i * 80}
          style={{ padding: "14px 18px", marginBottom: 10, borderRadius: 20 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 16,
                background: "linear-gradient(145deg, #1a2d4a, #142240)",
                boxShadow:
                  "4px 4px 12px rgba(0,0,0,0.3), -2px -2px 8px rgba(147,197,253,0.04)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {tx.dir === "in"
                ? Icons.arrIn("#00D68F")
                : Icons.arrOut(theme.accent)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, color: COLORS.text1 }}>{tx.n}</div>
              <div
                style={{ fontSize: 11, color: COLORS.text3, marginTop: 2 }}
              >
                {tx.d}
              </div>
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: tx.dir === "in" ? "#00D68F" : COLORS.text1,
              }}
            >
              {tx.dir === "in" ? "+" : "-"}¥{tx.a.toLocaleString()}
            </span>
          </div>
        </NeuCard>
      ))}
    </div>
  );
}
