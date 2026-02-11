"use client";

import { useState, useEffect } from "react";

export function useJST() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const jstTime = new Date(
    time.toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );

  return {
    time,
    jstTime,
    formatted: {
      time: jstTime.toLocaleTimeString("ja-JP", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: jstTime.toLocaleDateString("ja-JP", {
        month: "short",
        day: "numeric",
        weekday: "short",
      }),
    },
  };
}
