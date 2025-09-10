"use client"

import { useState, useEffect } from "react"
import { giftListStore } from "@/lib/store"
import type { GiftListState } from "@/lib/types"

export function useGiftStore() {
  const [state, setState] = useState<GiftListState>(giftListStore.getState())

  useEffect(() => {
    const unsubscribe = giftListStore.subscribe(() => {
      setState(giftListStore.getState())
    })

    return unsubscribe
  }, [])

  return {
    ...state,
    store: giftListStore,
  }
}
