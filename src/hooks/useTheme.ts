'use client';

import { useEffect, useState } from 'react'
import { useTheme as useNextTheme } from 'next-themes'

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, systemTheme } = useNextTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    if (!mounted) return
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const currentTheme = mounted ? theme : 'system'
  const isDark = currentTheme === 'dark' || (currentTheme === 'system' && systemTheme === 'dark')

  return {
    theme: currentTheme,
    isDark,
    toggleTheme,
    setTheme
  }
}