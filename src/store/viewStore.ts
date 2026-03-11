import { create } from 'zustand'

export type ViewMode = 'landing' | 'map' | 'immersive'

interface ViewStore {
  mode: ViewMode
  flyTarget: string | null
  enterMap: () => void
  flyToNode: (nodeId: string) => void
  enterImmersive: () => void
  backToMap: () => void
  backToLanding: () => void
}

export const useViewStore = create<ViewStore>((set) => ({
  mode: 'landing',
  flyTarget: null,
  enterMap: () => set({ mode: 'map', flyTarget: null }),
  flyToNode: (nodeId) => set({ flyTarget: nodeId }),
  enterImmersive: () => set({ mode: 'immersive', flyTarget: null }),
  backToMap: () => set({ mode: 'map', flyTarget: null }),
  backToLanding: () => set({ mode: 'landing', flyTarget: null }),
}))
