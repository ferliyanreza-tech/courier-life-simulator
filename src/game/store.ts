import { create } from 'zustand'

export type ControlKey = 'forward' | 'backward' | 'left' | 'right'

type GameState = {
  keys: Record<ControlKey, boolean>
  missionStage: 'pickup' | 'delivery' | 'complete'
  money: number
  deliveries: number
  canInteract: boolean
  setKey: (key: ControlKey, pressed: boolean) => void
  setInteractEnabled: (enabled: boolean) => void
  interact: () => void
  resetMission: () => void
}

export const useGameStore = create<GameState>((set, get) => ({
  keys: { forward: false, backward: false, left: false, right: false },
  missionStage: 'pickup',
  money: 0,
  deliveries: 0,
  canInteract: false,
  setKey: (key, pressed) => set((state) => ({
    keys: { ...state.keys, [key]: pressed },
  })),
  setInteractEnabled: (enabled) => {
    if (get().canInteract !== enabled) set({ canInteract: enabled })
  },
  interact: () => {
    const { missionStage, canInteract } = get()
    if (!canInteract) return
    if (missionStage === 'pickup') set({ missionStage: 'delivery', canInteract: false })
    if (missionStage === 'delivery') set((state) => ({
      missionStage: 'complete',
      canInteract: false,
      money: state.money + 75000,
      deliveries: state.deliveries + 1,
    }))
  },
  resetMission: () => set({ missionStage: 'pickup', canInteract: false }),
}))