"use client";

import { useState, useCallback, useEffect } from "react";

const AUTO_LOCK_TIMEOUT = 30000; // 30 seconds

export function useSecret() {
  const [isSecret, setIsSecret] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const confirmPin = useCallback(() => {
    setShowPin(false);
    setIsSecret(true);
  }, []);

  const exitSecret = useCallback(() => {
    setIsSecret(false);
  }, []);

  const requestSecret = useCallback(() => {
    setShowPin(true);
  }, []);

  const cancelPin = useCallback(() => {
    setShowPin(false);
  }, []);

  // Auto-lock after timeout
  useEffect(() => {
    if (!isSecret) return;

    let timeout = setTimeout(exitSecret, AUTO_LOCK_TIMEOUT);

    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(exitSecret, AUTO_LOCK_TIMEOUT);
    };

    window.addEventListener("touchstart", resetTimer);
    window.addEventListener("mousemove", resetTimer);

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("touchstart", resetTimer);
      window.removeEventListener("mousemove", resetTimer);
    };
  }, [isSecret, exitSecret]);

  return {
    isSecret,
    showPin,
    requestSecret,
    confirmPin,
    exitSecret,
    cancelPin,
  };
}
