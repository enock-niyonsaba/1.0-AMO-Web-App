'use client';

import { AppProgressBar } from 'next-nprogress-bar'
import { Toaster } from 'react-hot-toast'

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <AppProgressBar
        height="2px"
        color="#3b82f6"
        options={{ showSpinner: false }}
        shallowRouting
      />
      <Toaster position="top-right" />
    </>
  )
}