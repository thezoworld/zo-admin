"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

const STORAGE_KEY = "zo-pms-selected-operator"

type SelectedOperatorState = {
  selectedOperatorId: number | string | null
  hasHydrated: boolean
}

type SelectedOperatorActions = {
  setSelectedOperatorId: (id: number | string | null) => void
  setHasHydrated: (value: boolean) => void
}

export type SelectedOperatorStore = SelectedOperatorState &
  SelectedOperatorActions

export const useSelectedOperatorStore = create<SelectedOperatorStore>()(
  persist(
    (set) => ({
      selectedOperatorId: null,
      hasHydrated: false,
      setSelectedOperatorId(selectedOperatorId) {
        set({ selectedOperatorId })
      },
      setHasHydrated(value) {
        set({ hasHydrated: value })
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ selectedOperatorId: state.selectedOperatorId }),
      onRehydrateStorage: () => (state, error) => {
        if (error || !state) return
        state.setHasHydrated(true)
      },
    }
  )
)

if (typeof window !== "undefined") {
  window.addEventListener("storage", function syncFromOtherTab(event) {
    if (event.key === STORAGE_KEY) {
      void useSelectedOperatorStore.persist.rehydrate()
    }
  })
}
