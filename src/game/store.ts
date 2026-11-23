import { create } from 'zustand'

export type ControlKey = 'forward' | 'backward' | 'left' | 'right'

type GameState = {
  keys: Record<ControlKey, boolean>
  missionStage: 'pickup' | 'delivery' | 'complete'
  money: number
  deliveries: number
  setKey: (key: ControlKey, pressed: boolean) => void
  interact: () => void
  resetMission: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  keys: { forward: false, backward: false, left: false, right: false },
  missionStage: 'pickup',
  money: 0,
  deliveries: 0,
  setKey: (key, pressed) => set((state) => ({
    keys: { ...state.keys, [key]: pressed },
  })),
  interact: () => {
    const stage = get().missionStage
    if (stage === 'pickup') set({ missionStage: 'delivery' })
    if (stage === 'delivery') set((state) => ({
      missionStage: 'complete',
      money: state.money + 75000,
      deliveries: state.deliveries + 1,
    }))
  },
  resetMission: () => set({ missionStage: 'pickup' }),
}))