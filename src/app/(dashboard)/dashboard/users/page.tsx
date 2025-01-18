'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Search, Filter, Building2, Key, Activity,
  Lock, AlertTriangle, CheckCircle, Trash2, Eye,
  Edit, MoreVertical, RefreshCcw
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface User {
  desktop_user_id: string
  company_name: string
  tin_number: string
  status: 'active' | 'locked' | 'license_expired'
  created_at: string
  qr_code_scanned: number
  vat_amount: number
  last_sync?: string
  license_start?: string
  license_end?: string
}

export default function UsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'qr' | 'vat' | 'license'>('qr')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: desktopUsers, error: desktopError } = await supabase
          .from('desktop_user')
          .select(`
            *,
            company_info (
              qr_code_scanned,
              vat_amount,
              last_sync,
              license_start,
              license_end
            )
          `)
          .eq('is_deleted', false)

        if (desktopError) throw desktopError

        const formattedUsers = desktopUsers.map(user => ({
          ...user,
          qr_code_scanned: user.company_info?.[0]?.qr_code_scanned || 0,
          vat_amount: user.company_info?.[0]?.vat_amount || 0,
          last_sync: user.company_info?.[0]?.last_sync,
          license_start: user.company_info?.[0]?.license_start,
          license_end: user.company_info?.[0]?.license_end
        }))

        setUsers(formattedUsers)
        setFilteredUsers(formattedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user => 
      user.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.desktop_user_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.tin_number.includes(searchTerm)
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleSort = (type: 'qr' | 'vat' | 'license') => {
    setSortBy(type)
    let sorted = [...filteredUsers]
    
    switch (type) {
      case 'qr':
        sorted.sort((a, b) => b.qr_code_scanned - a.qr_code_scanned)
        break
      case 'vat':
        sorted.sort((a, b) => Number(b.vat_amount) - Number(a.vat_amount))
        break
      case 'license':
        sorted.sort((a, b) => {
          if (!a.license_end) return 1
          if (!b.license_end) return -1
          return new Date(b.license_end).getTime() - new Date(a.license_end).getTime()
        })
        break
    }

    setFilteredUsers(sorted)
  }

  const handleLockUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('desktop_user')
        .update({ status: 'locked' })
        .eq('desktop_user_id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.map(user => 
        user.desktop_user_id === userId 
          ? { ...user, status: 'locked' } 
          : user
      ))

      // TODO: Send lock signal to desktop app via API
    } catch (error) {
      console.error('Error locking user:', error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('desktop_user')
        .update({ is_deleted: true })
        .eq('desktop_user_id', userId)

      if (error) throw error

      // Update local state
      setUsers(users.filter(user => user.desktop_user_id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <h1 className="text-2xl font-semibold">Users Management</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSort('qr')}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === 'qr' 
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Activity className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSort('vat')}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === 'vat'
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Building2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleSort('license')}
              className={`p-2 rounded-lg transition-colors ${
                sortBy === 'license'
                  ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Key className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.desktop_user_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{user.company_name}</h3>
                    {user.status === 'active' && (
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    )}
                    {user.status === 'locked' && (
                      <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                        <Lock className="w-4 h-4" />
                        Locked
                      </span>
                    )}
                    {user.status === 'license_expired' && (
                      <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                        <AlertTriangle className="w-4 h-4" />
                        License Expired
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ID: {user.desktop_user_id}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    TIN: {user.tin_number}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setShowUserDetails(true)
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleLockUser(user.desktop_user_id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Lock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.desktop_user_id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">QR Codes Scanned</p>
                    <p className="text-lg font-semibold">{user.qr_code_scanned}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total VAT</p>
                    <p className="text-lg font-semibold">${user.vat_amount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <RefreshCcw className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
                    <p className="text-lg font-semibold">
                      {user.last_sync 
                        ? new Date(user.last_sync).toLocaleDateString()
                        : 'Never'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* User details content */}
              <div className="space-y-6">
                {/* Basic Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Company Name</p>
                      <p className="font-medium">{selectedUser.company_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                      <p className="font-medium">{selectedUser.desktop_user_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">TIN Number</p>
                      <p className="font-medium">{selectedUser.tin_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                      <p className="font-medium">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* License Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">License Information</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                      <p className={`font-medium ${
                        selectedUser.status === 'active' 
                          ? 'text-green-600 dark:text-green-400'
                          : selectedUser.status === 'locked'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                      }`}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">License Start</p>
                      <p className="font-medium">
                        {selectedUser.license_start
                          ? new Date(selectedUser.license_start).toLocaleDateString()
                          : 'Not set'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">License End</p>
                      <p className="font-medium">
                        {selectedUser.license_end
                          ? new Date(selectedUser.license_end).toLocaleDateString()
                          : 'Not set'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Usage Statistics */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Usage Statistics</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">QR Codes Scanned</p>
                      <p className="font-medium">{selectedUser.qr_code_scanned}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total VAT</p>
                      <p className="font-medium">${selectedUser.vat_amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Last Sync</p>
                      <p className="font-medium">
                        {selectedUser.last_sync
                          ? new Date(selectedUser.last_sync).toLocaleDateString()
                          : 'Never'
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleLockUser(selectedUser.desktop_user_id)
                      setShowUserDetails(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
                  >
                    <Lock className="w-4 h-4" />
                    Lock User
                  </button>
                  <button
                    onClick={() => {
                      handleDeleteUser(selectedUser.desktop_user_id)
                      setShowUserDetails(false)
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}