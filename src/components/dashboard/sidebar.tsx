'use client';

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, Users, Key, Activity, MessageSquare, 
  ChevronLeft, ChevronRight, Settings, LogOut, Bell
} from 'lucide-react'
import { cn } from '@/lib/utils'

const adminMenuItems = [
  { 
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'Users',
    icon: Users,
    href: '/dashboard/users'
  },
  {
    title: 'Licenses',
    icon: Key,
    href: '/dashboard/licenses'
  },
  {
    title: 'Activities',
    icon: Activity,
    href: '/dashboard/activities'
  },
  {
    title: 'Messages',
    icon: MessageSquare,
    href: '/dashboard/messages'
  }
]

const userMenuItems = [
  { 
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard'
  },
  {
    title: 'Company',
    icon: Users,
    href: '/dashboard/company'
  },
  {
    title: 'Activities',
    icon: Activity,
    href: '/dashboard/activities'
  }
]

interface SidebarProps {
  userRole: 'ADMIN' | 'USER'
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const pathname = usePathname()
  const menuItems = userRole === 'ADMIN' ? adminMenuItems : userMenuItems

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className="h-screen fixed left-0 top-0 z-40 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800"
    >
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center justify-between px-4">
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="font-bold text-xl">AMO</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors",
                  isActive 
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <Settings className="w-5 h-5" />
            <LogOut className="w-5 h-5 text-red-500" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}