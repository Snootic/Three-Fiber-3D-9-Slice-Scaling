import { create } from 'zustand';

export const useStore = create((set) => ({
  isDraggingArrow: false,
  setIsDraggingArrow: (isDragging) => set({ isDraggingArrow: isDragging }),
}));
