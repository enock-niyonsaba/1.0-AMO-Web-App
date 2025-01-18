import { Providers } from '@/components/providers'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AMO Platform - Analyze, Monitor, Optimize',
  description:
    'Comprehensive business management solution for tracking sales data, monitoring QR codes, and optimizing business performance.',
  keywords: [
    'business management',
    'QR code tracking',
    'sales monitoring',
    'business analytics',
    'performance optimization',
  ],
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}