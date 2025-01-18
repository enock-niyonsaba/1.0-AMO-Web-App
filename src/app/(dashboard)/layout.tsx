import { Sidebar } from '@/components/dashboard/sidebar'
import { Header } from '@/components/dashboard/header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // TODO: Get user role from auth context
  const userRole = 'ADMIN'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole={userRole as 'ADMIN' | 'USER'} />
      <div className="pl-[280px]">
        <Header />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}