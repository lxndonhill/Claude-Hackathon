'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type TextSize = 'small' | 'medium' | 'large'

interface TextSizeContextValue {
  textSize: TextSize
  setTextSize: (size: TextSize) => Promise<void>
}

const TextSizeContext = createContext<TextSizeContextValue>({
  textSize: 'medium',
  setTextSize: async () => {},
})

export function useTextSize() {
  return useContext(TextSizeContext)
}

interface Props {
  initialSize: TextSize
  children: React.ReactNode
}

export function TextSizeProvider({ initialSize, children }: Props) {
  const [textSize, setTextSizeState] = useState<TextSize>(initialSize)

  useEffect(() => {
    document.documentElement.setAttribute('data-text-size', textSize)
  }, [textSize])

  async function setTextSize(size: TextSize) {
    setTextSizeState(size)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ textSizePreference: size }),
    })
  }

  return (
    <TextSizeContext.Provider value={{ textSize, setTextSize }}>
      {children}
    </TextSizeContext.Provider>
  )
}
