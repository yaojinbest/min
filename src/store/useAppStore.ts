/**
 * 全局状态(Zustand + persist)
 * - 用户进度
 * - 当前故事
 * - 设置
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface UserProgress {
  userName: string;
  buddyName: string;
  completedStories: string[];
  totalStars: number; // 答对累计星
  unlockedStoryIds: string[];
  createdAt: number;
}

interface AppState {
  // 用户
  user: UserProgress | null;
  setUser: (name: string, buddyName: string) => void;
  clearUser: () => void;

  // 进度
  unlockStory: (storyId: string) => void;
  completeStory: (storyId: string, stars: number) => void;
  isStoryCompleted: (storyId: string) => boolean;
  isStoryUnlocked: (storyId: string) => boolean;
}

const defaultProgress: UserProgress = {
  userName: '',
  buddyName: '',
  completedStories: [],
  totalStars: 0,
  unlockedStoryIds: ['story_1'], // 默认开第一关
  createdAt: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: (name, buddyName) => {
        const existing = get().user;
        set({
          user: {
            ...(existing ?? defaultProgress),
            userName: name,
            buddyName,
            createdAt: existing?.createdAt ?? Date.now(),
          },
        });
      },

      clearUser: () => set({ user: null }),

      unlockStory: (storyId) => {
        const u = get().user;
        if (!u || u.unlockedStoryIds.includes(storyId)) return;
        set({
          user: { ...u, unlockedStoryIds: [...u.unlockedStoryIds, storyId] },
        });
      },

      completeStory: (storyId, stars) => {
        const u = get().user;
        if (!u) return;
        const completed = u.completedStories.includes(storyId)
          ? u.completedStories
          : [...u.completedStories, storyId];
        set({
          user: {
            ...u,
            completedStories: completed,
            totalStars: u.totalStars + stars,
          },
        });
      },

      isStoryCompleted: (storyId) => {
        return get().user?.completedStories.includes(storyId) ?? false;
      },

      isStoryUnlocked: (storyId) => {
        return get().user?.unlockedStoryIds.includes(storyId) ?? false;
      },
    }),
    {
      name: 'magic-english-mvp',
    },
  ),
);
