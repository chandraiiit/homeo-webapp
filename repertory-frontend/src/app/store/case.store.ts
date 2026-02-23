import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Chapter, Rubric } from '../services/api';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CaseItem {
  rubric: Rubric;
  chapter: Chapter;
}

interface CaseStore {
  items: CaseItem[];
  addRubric:    (rubric: Rubric, chapter: Chapter) => void;
  removeRubric: (rubricId: number) => void;
  clearCase:    () => void;
  hasRubric:    (rubricId: number) => boolean;
  rubricIds:    () => number[];
}

// ─── Store ────────────────────────────────────────────────────────────────────

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      items: [],

      addRubric: (rubric, chapter) => {
        if (get().hasRubric(rubric.id)) return;
        set((s) => ({ items: [...s.items, { rubric, chapter }] }));
      },

      removeRubric: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.rubric.id !== id) })),

      clearCase: () => set({ items: [] }),

      hasRubric: (id) => get().items.some((i) => i.rubric.id === id),

      rubricIds: () => get().items.map((i) => i.rubric.id),
    }),
    {
      name: 'homeo-case', // localStorage key
    }
  )
);