import { create } from 'zustand';

export const useStore = create((set) => ({
  isDraggingArrow: false,
  setIsDraggingArrow: (isDragging) => set({ isDraggingArrow: isDragging }),  scale: 0.1,
  setScale: (scale) => set({ scale }),}));
