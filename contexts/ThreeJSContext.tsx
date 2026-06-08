'use client'

import { createContext, useContext } from 'react'

export interface ThreeJSContextValue {
  /** true on screen.width < 768 OR hardwareConcurrency < 4 */
  mobile:   boolean
  /** true on mobile devices with hardwareConcurrency < 2 — replaces canvas with static gradient */
  isLowEnd: boolean
}

export const ThreeJSContext = createContext<ThreeJSContextValue>({
  mobile:   false,
  isLowEnd: false,
})

export const useThreeJS = () => useContext(ThreeJSContext)
