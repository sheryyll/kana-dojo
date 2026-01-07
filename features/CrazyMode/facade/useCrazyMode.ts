'use client';

import { useMemo } from 'react';
import useCrazyModeStore from '../store/useCrazyModeStore';

export interface CrazyModeState {
  isCrazyMode: boolean;
  activeThemeId: string | null;
  activeFontName: string | null;
}

export interface CrazyModeActions {
  toggleCrazyMode: () => void;
  randomize: () => void;
}

export function useCrazyMode(): CrazyModeState & CrazyModeActions {
  const isCrazyMode = useCrazyModeStore(state => state.isCrazyMode);
  const activeThemeId = useCrazyModeStore(state => state.activeThemeId);
  const activeFontName = useCrazyModeStore(state => state.activeFontName);
  const toggleCrazyMode = useCrazyModeStore(state => state.toggleCrazyMode);
  const randomize = useCrazyModeStore(state => state.randomize);

  return useMemo(
    () => ({
      isCrazyMode,
      activeThemeId,
      activeFontName,
      toggleCrazyMode,
      randomize
    }),
    [isCrazyMode, activeThemeId, activeFontName, toggleCrazyMode, randomize]
  );
}
