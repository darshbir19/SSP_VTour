import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { nodes } from '../data/nodes'

export type Language = 'en' | 'zh'

interface ExperienceState {
  currentNodeId: string
  previousNodeId: string | null
  language: Language
  muted: boolean
  volume: number
  ambientEnabled: boolean
  effectsEnabled: boolean
  infoOpen: boolean
}

interface ExperienceActions {
  goToNode: (id: string) => void
  toggleLanguage: () => void
  toggleMute: () => void
  setVolume: (v: number) => void
  toggleAmbient: () => void
  toggleEffects: () => void
  setInfoOpen: (open: boolean) => void
}

type ExperienceCtx = ExperienceState & ExperienceActions

const Ctx = createContext<ExperienceCtx | null>(null)

export function ExperienceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ExperienceState>({
    currentNodeId: nodes[0].id,
    previousNodeId: null,
    language: 'en',
    muted: false,
    volume: 0.75,
    ambientEnabled: true,
    effectsEnabled: true,
    infoOpen: false,
  })

  const goToNode = useCallback((id: string) => {
    setState((s) => ({ ...s, previousNodeId: s.currentNodeId, currentNodeId: id }))
  }, [])

  const toggleLanguage = useCallback(() => {
    setState((s) => ({ ...s, language: s.language === 'en' ? 'zh' : 'en' }))
  }, [])

  const toggleMute = useCallback(() => {
    setState((s) => ({ ...s, muted: !s.muted }))
  }, [])

  const setVolume = useCallback((v: number) => {
    setState((s) => ({ ...s, volume: v }))
  }, [])

  const toggleAmbient = useCallback(() => {
    setState((s) => ({ ...s, ambientEnabled: !s.ambientEnabled }))
  }, [])

  const toggleEffects = useCallback(() => {
    setState((s) => ({ ...s, effectsEnabled: !s.effectsEnabled }))
  }, [])

  const setInfoOpen = useCallback((open: boolean) => {
    setState((s) => ({ ...s, infoOpen: open }))
  }, [])

  return (
    <Ctx.Provider
      value={{
        ...state,
        goToNode,
        toggleLanguage,
        toggleMute,
        setVolume,
        toggleAmbient,
        toggleEffects,
        setInfoOpen,
      }}
    >
      {children}
    </Ctx.Provider>
  )
}

export function useExperience(): ExperienceCtx {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useExperience must be used inside ExperienceProvider')
  return ctx
}
