"use client";

import { useRef, useEffect } from "react";

interface Star {
  x: number;
  y: number;
  r: number;
  ts: number;
  to: number;
  b: number;
}

interface Shoot {
  x: number;
  y: number;
  len: number;
  spd: number;
  ang: number;
  life: number;
  dec: number;
}

interface StarfieldProps {
  sc: string;
}

export function Starfield({ sc }: StarfieldProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const stars = useRef<Star[]>([]);
  const shoots = useRef<Shoot[]>([]);
  const fr = useRef(0);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize stars
    stars.current = Array.from({ length: 80 }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      ts: Math.random() * 0.02 + 0.005,
      to: Math.random() * Math.PI * 2,
      b: Math.random() * 0.35 + 0.25,
    }));

    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      fr.current++;

      // Draw stars
      stars.current.forEach((s) => {
        const alpha =
          s.b * (Math.sin(fr.current * s.ts + s.to) * 0.35 + 0.65);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${sc},${alpha})`;
        ctx.fill();
      });

      // Create shooting stars
      if (Math.random() < 0.003) {
        shoots.current.push({
          x: Math.random() * w * 0.8,
          y: Math.random() * h * 0.3,
          len: 50 + Math.random() * 60,
          spd: 4 + Math.random() * 4,
          ang: Math.PI / 5 + Math.random() * 0.3,
          life: 1,
          dec: 0.018 + Math.random() * 0.01,
        });
      }

      // Draw and update shooting stars
      shoots.current = shoots.current.filter((s) => {
        s.x += Math.cos(s.ang) * s.spd;
        s.y += Math.sin(s.ang) * s.spd;
        s.life -= s.dec;

        if (s.life <= 0) return false;

        const gradient = ctx.createLinearGradient(
          s.x,
          s.y,
          s.x - Math.cos(s.ang) * s.len,
          s.y - Math.sin(s.ang) * s.len
        );
        gradient.addColorStop(0, `rgba(255,255,255,${s.life * 0.7})`);
        gradient.addColorStop(1, "rgba(255,255,255,0)");

        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(
          s.x - Math.cos(s.ang) * s.len * s.life,
          s.y - Math.sin(s.ang) * s.len * s.life
        );
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        return true;
      });

      requestAnimationFrame(loop);
    };

    const animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [sc]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
