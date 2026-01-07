'use client';

import useStatsStore from '../store/useStatsStore';

type StatsStoreState = ReturnType<typeof useStatsStore.getState>;

export const progressBackup = {
  getStatsState: (): StatsStoreState => useStatsStore.getState(),
  setStatsState: (partial: Partial<StatsStoreState>) =>
    useStatsStore.setState(partial)
};

export type { StatsStoreState };
