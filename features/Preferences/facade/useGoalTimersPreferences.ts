'use client';

import { useMemo } from 'react';
import useGoalTimersStore from '../store/useGoalTimersStore';
import type {
  GoalTimersStore,
  GoalTemplate,
  GoalTimersSettings
} from '../store/useGoalTimersStore';

export interface GoalTimersPreferences {
  templates: GoalTemplate[];
  settings: GoalTimersSettings;
}

export interface GoalTimersPreferencesActions {
  addTemplate: (template: Omit<GoalTemplate, 'id'>) => string;
  addToHistory: GoalTimersStore['addToHistory'];
}

export function useGoalTimersPreferences(): GoalTimersPreferences &
  GoalTimersPreferencesActions {
  const templates = useGoalTimersStore(state => state.templates);
  const settings = useGoalTimersStore(state => state.settings);
  const addTemplate = useGoalTimersStore(state => state.addTemplate);
  const addToHistory = useGoalTimersStore(state => state.addToHistory);

  return useMemo(
    () => ({
      templates,
      settings,
      addTemplate,
      addToHistory
    }),
    [templates, settings, addTemplate, addToHistory]
  );
}
