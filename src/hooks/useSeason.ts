"use client";

import { useMemo } from "react";
import { SEASONS, SECRET_THEME, getSeason, getJSTMonth, Theme, Season } from "@/lib/themes";

export function useSeason(isSecretMode: boolean = false) {
  const month = getJSTMonth();
  const season = getSeason(month);

  const theme = useMemo<Theme>(() => {
    return isSecretMode ? SECRET_THEME : SEASONS[season];
  }, [isSecretMode, season]);

  return {
    season,
    theme,
    label: SEASONS[season].label,
  };
}
