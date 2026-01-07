'use client';

import { useCustomThemeStore } from '../store/useCustomThemeStore';
import usePreferencesStore from '../store/usePreferencesStore';

type PreferencesStoreState = ReturnType<typeof usePreferencesStore.getState>;
type CustomThemeStoreState = ReturnType<typeof useCustomThemeStore.getState>;

export const preferencesBackup = {
  getPreferencesState: (): PreferencesStoreState =>
    usePreferencesStore.getState(),
  setPreferencesState: (partial: Partial<PreferencesStoreState>) =>
    usePreferencesStore.setState(partial),

  getCustomThemeState: (): CustomThemeStoreState =>
    useCustomThemeStore.getState(),
  setCustomThemeState: (partial: Partial<CustomThemeStoreState>) =>
    useCustomThemeStore.setState(partial)
};

export type { PreferencesStoreState, CustomThemeStoreState };
