"use client";

import { useState } from "react";
import { COLORS } from "@/lib/themes";

interface PinPadProps {
  onSuccess: () => void;
  onCancel: () => void;
  theme?: any;
  storedPin?: string; // PIN from user profile
}

export function PinPad({ onSuccess, onCancel, theme, storedPin }: PinPadProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Setup mode if no PIN stored
  const [isSetup, setIsSetup] = useState(!storedPin);
  const [newPin, setNewPin] = useState("");
  const [setupStep, setSetupStep] = useState<"enter" | "confirm">("enter");

  const accent = theme?.accent || COLORS.secret;

  const handleInput = (n: string) => {
    if (isSetup) {
      handleSetupInput(n);
      return;
    }

    if (pin.length >= 4) return;
    const next = pin + n;
    setPin(next);

    if (next.length === 4) {
      if (next === storedPin) {
        setTimeout(onSuccess, 200);
      } else {
        setError(true);
        setShake(true);
        setTimeout(() => {
          setPin("");
          setError(false);
          setShake(false);
        }, 600);
      }
    }
  };

  const handleSetupInput = (n: string) => {
    if (setupStep === "enter") {
      if (newPin.length >= 4) return;
      const next = newPin + n;
      setNewPin(next);
      if (next.length === 4) {
        setTimeout(() => {
          setSetupStep("confirm");
          setPin("");
        }, 300);
      }
    } else {
      if (pin.length >= 4) return;
      const next = pin + n;
      setPin(next);
      if (next.length === 4) {
        if (next === newPin) {
          // Save PIN to Supabase via API
          savePinAndUnlock(next);
        } else {
          setError(true);
          setShake(true);
          setTimeout(() => {
            setPin("");
            setNewPin("");
            setSetupStep("enter");
            setError(false);
            setShake(false);
          }, 600);
        }
      }
    }
  };

  const savePinAndUnlock = async (pinValue: string) => {
    try {
      const { supabase } = await import("@/lib/supabase");
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").update({ secret_pin: pinValue }).eq("user_id", user.id);
      }
    } catch (e) {
      console.error("PIN save error:", e);
    }
    setTimeout(onSuccess, 200);
  };

  const handleBackspace = () => {
    if (isSetup && setupStep === "enter") {
      setNewPin(p => p.slice(0, -1));
    } else {
      setPin(p => p.slice(0, -1));
    }
  };

  const currentPin = isSetup && setupStep === "enter" ? newPin : pin;
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, "←"];

  const title = isSetup
    ? (setupStep === "enter" ? "NEW PIN" : "CONFIRM PIN")
    : "AUTHENTICATION";

  const subtitle = isSetup
    ? (setupStep === "enter" ? "4桁の暗証番号を設定" : "もう一度入力してください")
    : "";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.95)",
        backdropFilter: "blur(40px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontSize: 8,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: 5,
          marginBottom: 8,
          fontFamily: "'Orbitron', sans-serif",
        }}
      >
        {title}
      </div>

      {subtitle && (
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>
          {subtitle}
        </div>
      )}

      {/* PIN dots */}
      <div
        style={{
          display: "flex",
          gap: 18,
          marginBottom: 44,
          animation: shake ? "shakeX 0.4s" : "none",
        }}
      >
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: `2px solid ${
                error
                  ? "#FF3B3B"
                  : i < currentPin.length
                  ? accent
                  : "rgba(255,255,255,0.12)"
              }`,
              background:
                i < currentPin.length ? (error ? "#FF3B3B" : accent) : "transparent",
              transition: "all 0.15s",
            }}
          />
        ))}
      </div>

      {/* Keypad */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 14,
          width: 220,
        }}
      >
        {keys.map((key, i) =>
          key === null ? (
            <div key={i} />
          ) : (
            <button
              key={i}
              onClick={() =>
                key === "←" ? handleBackspace() : handleInput(String(key))
              }
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                border: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.03)",
                color: "#F0F0F5",
                fontSize: key === "←" ? 18 : 22,
                fontWeight: 300,
                cursor: "pointer",
                fontFamily: "'Orbitron', sans-serif",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {key}
            </button>
          )
        )}
      </div>

      <button
        onClick={onCancel}
        style={{
          marginTop: 28,
          background: "none",
          border: "none",
          color: "rgba(255,255,255,0.3)",
          fontSize: 9,
          cursor: "pointer",
          fontFamily: "'Orbitron', sans-serif",
          letterSpacing: 3,
        }}
      >
        CANCEL
      </button>

      <style>{`
        @keyframes shakeX {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
      `}</style>
    </div>
  );
}
