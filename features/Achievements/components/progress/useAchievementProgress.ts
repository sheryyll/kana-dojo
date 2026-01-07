import { useState, useCallback } from 'react';
import useAchievementStore, {
  ACHIEVEMENTS
} from '@/features/Achievements/store/useAchievementStore';
import { useStatsStore } from '@/features/Progress';
import { useClick } from '@/shared/hooks/useAudio';
import { CategoryId } from './constants';

/**
 * Custom hook for AchievementProgress component logic
 * Encapsulates state management and utility functions
 */
export const useAchievementProgress = () => {
  const { playClick } = useClick();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');

  const unlockedAchievements = useAchievementStore(
    state => state.unlockedAchievements
  );
  const totalPoints = useAchievementStore(state => state.totalPoints);
  const level = useAchievementStore(state => state.level);
  const stats = useStatsStore();

  /**
   * Calculate achievement progress percentage based on current stats
   */
  const getAchievementProgress = useCallback(
    (achievementId: string) => {
      const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
      if (!achievement) return 0;

      let current = 0;
      const target = achievement.requirements.value;

      switch (achievement.requirements.type) {
        case 'total_correct':
          current = stats.allTimeStats.totalCorrect;
          break;
        case 'streak':
          current = stats.allTimeStats.bestStreak;
          break;
        case 'sessions':
          current = stats.allTimeStats.totalSessions;
          break;
        case 'accuracy':
          const totalAnswers =
            stats.allTimeStats.totalCorrect + stats.allTimeStats.totalIncorrect;
          current =
            totalAnswers > 0
              ? (stats.allTimeStats.totalCorrect / totalAnswers) * 100
              : 0;
          break;
      }

      return Math.min((current / target) * 100, 100);
    },
    [stats.allTimeStats]
  );

  /**
   * Filter achievements by selected category
   */
  const filteredAchievements =
    selectedCategory === 'all'
      ? ACHIEVEMENTS
      : ACHIEVEMENTS.filter(
          achievement => achievement.category === selectedCategory
        );

  const unlockedCount = Object.keys(unlockedAchievements).length;
  const totalCount = ACHIEVEMENTS.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  /**
   * Handle category selection with audio feedback
   */
  const handleCategorySelect = useCallback(
    (categoryId: CategoryId) => {
      playClick();
      setSelectedCategory(categoryId);
    },
    [playClick]
  );

  /**
   * Get stats for a specific category
   */
  const getCategoryStats = useCallback(
    (categoryId: string) => {
      const categoryAchievements =
        categoryId === 'all'
          ? ACHIEVEMENTS
          : ACHIEVEMENTS.filter(a => a.category === categoryId);
      const categoryUnlocked = categoryAchievements.filter(
        a => unlockedAchievements[a.id]
      ).length;
      return { total: categoryAchievements.length, unlocked: categoryUnlocked };
    },
    [unlockedAchievements]
  );

  return {
    // State
    selectedCategory,
    unlockedAchievements,
    totalPoints,
    level,
    filteredAchievements,
    unlockedCount,
    totalCount,
    completionPercentage,

    // Actions
    handleCategorySelect,
    getAchievementProgress,
    getCategoryStats
  };
};
