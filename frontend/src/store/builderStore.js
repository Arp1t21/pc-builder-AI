import { create } from 'zustand';

export const useBuilderStore = create((set, get) => ({
  selectedComponents: {
    CPU: null,
    GPU: null,
    RAM: null,
    SSD: null,
    PSU: null,
    Motherboard: null,
    Case: null,
  },
  
  totalPrice: 0,
  aiAnalysis: null,
  
  setComponent: (category, component) => {
    const newComponents = {
      ...get().selectedComponents,
      [category]: component,
    };
    
    const total = Object.values(newComponents).reduce(
      (sum, comp) => sum + (comp?.price || 0),
      0
    );
    
    set({ selectedComponents: newComponents, totalPrice: total });
  },
  
  removeComponent: (category) => {
    const newComponents = {
      ...get().selectedComponents,
      [category]: null,
    };
    
    const total = Object.values(newComponents).reduce(
      (sum, comp) => sum + (comp?.price || 0),
      0
    );
    
    set({ selectedComponents: newComponents, totalPrice: total });
  },
  
  setAIAnalysis: (analysis) => set({ aiAnalysis: analysis }),
  
  clearBuild: () => set({
    selectedComponents: {
      CPU: null,
      GPU: null,
      RAM: null,
      SSD: null,
      PSU: null,
      Motherboard: null,
      Case: null,
    },
    totalPrice: 0,
    aiAnalysis: null,
  }),
}));