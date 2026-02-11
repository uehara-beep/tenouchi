"use client";

import { useState, useEffect } from "react";

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  color: string;
  size?: number;
}

export function AnimatedNumber({
  value,
  prefix = "",
  color,
  size = 36,
}: AnimatedNumberProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const duration = 1200;
    const start = Date.now();

    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplayValue(Math.floor(value * eased));

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span
      style={{
        fontSize: size,
        fontWeight: 700,
        fontFamily: "'Orbitron', sans-serif",
        background: `linear-gradient(135deg, ${color}, ${color}AA)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {prefix}
      {displayValue.toLocaleString()}
    </span>
  );
}
