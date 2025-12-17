import { create } from 'zustand';

export const useStore = create((set) => ({
  isDraggingArrow: false,
  setIsDraggingArrow: (isDragging) => set({ isDraggingArrow: isDragging }),
  objectScales: {},
  setObjectScale: (objectId, scale) => set((state) => ({
    objectScales: { ...state.objectScales, [objectId]: scale }
  })),
  getObjectScale: (objectId) => (state) => state.objectScales[objectId] || 1,
  activeObjectId: null,
  setActiveObjectId: (objectId) => set({ activeObjectId: objectId }),
}));