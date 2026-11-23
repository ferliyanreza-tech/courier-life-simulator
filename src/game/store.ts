import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ControlKey = 'forward' | 'backward' | 'left' | 'right'

export const deliveryStops = [
  { name: 'Warung Bu Sari', address: 'Jl. Melati No. 08', position: [8, 0, -8] as [number, number, number], reward: 75000 },
  { name: 'Rumah Pak Andi', address: 'Jl. Kenanga No. 14', position: [-10, 0, 11] as [number, number, number], reward: 90000 },
  { name: 'Toko Sinar Pagi', address: 'Jl. Merdeka No. 21', position: [11, 0, 10] as [number, number, number], reward: 85000 },
]

type GameState = {
  keys: Record<ControlKey, boolean>
  missionStage: 'pickup' | 'delivery' | 'complete'
  money: number
  deliveries: number
  experience: number
  reputation: number
  canInteract: boolean
  setKey: (key: ControlKey, pressed: boolean) => void
  setInteractEnabled: (enabled: boolean) => void
  interact: () => void
  resetMission: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      keys: { forward: false, backward: false, left: false, right: false },
      missionStage: 'pickup',
      money: 0,
      deliveries: 0,
      experience: 0,
      reputation: 0,
      canInteract: false,
      setKey: (key, pressed) => set((state) => ({ keys: { ...state.keys, [key]: pressed } })),
      setInteractEnabled: (enabled) => {
        if (get().canInteract !== enabled) set({ canInteract: enabled })
      },
      interact: () => {
        const { missionStage, canInteract, deliveries } = get()
        if (!canInteract) return
        if (missionStage === 'pickup') set({ missionStage: 'delivery', canInteract: false })
        else if (missionStage === 'delivery') {
          const mission = deliveryStops[deliveries % deliveryStops.length]
          set((state) => ({
            missionStage: 'complete', canInteract: false,
            money: state.money + mission.reward,
            deliveries: state.deliveries + 1,
            experience: state.experience + 100,
            reputation: Math.min(100, state.reputation + 5),
          }))
        }
      },
      resetMission: () => set({ missionStage: 'pickup', canInteract: false }),
    }),
    {
      name: 'courier-life-save-v1',
      partialize: (state) => ({
        missionStage: state.missionStage, money: state.money, deliveries: state.deliveries,
        experience: state.experience, reputation: state.reputation,
      }),
    },
  ),
)
