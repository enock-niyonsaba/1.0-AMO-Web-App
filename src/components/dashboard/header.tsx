'use client';

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Bell, Moon, Search, Sun, User } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <header className="h-16 fixed top-0 right-0 left-[280px] z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="h-full flex items-center justify-between px-6">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <span>John Doe</span>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="py-2">
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Settings
                  </a>
                  <hr className="my-2 border-gray-200 dark:border-gray-700" />
                  <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}