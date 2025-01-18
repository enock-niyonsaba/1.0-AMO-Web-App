'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, Search, Shield, User, Mail, Phone,
  Edit, Trash2, MoreVertical, Eye
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface AmoUser {
  user_id: string
  username: string
  email: string
  user_role: 'ADMIN' | 'USER'
  created_at: string
  phone_number?: string
  profile_picture?: string
}

export default function AmoUsersPage() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<AmoUser[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AmoUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState<AmoUser | null>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data: amoUsers, error } = await supabase
          .from('amo_user_login')
          .select(`
            *,
            amo_user_info (
              phone_number,
              profile_picture
            )
          `)

        if (error) throw error

        const formattedUsers = amoUsers.map(user => ({
          ...user,
          phone_number: user.amo_user_info?.[0]?.phone_number,
          profile_picture: user.amo_user_info?.[0]?.profile_picture
        }))

        setUsers(formattedUsers)
        setFilteredUsers(formattedUsers)
      } catch (error) {
        console.error('Error fetching AMO users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [])

  useEffect(() => {
    const filtered = users.filter(user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('amo_user_login')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      setUsers(users.filter(user => user.user_id !== userId))
      setShowUserDetails(false)
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
          <h1 className="text-2xl font-semibold">AMO Users</h1>
        </div>

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
      </div>

      <div className="grid gap-6">
        {filteredUsers.map((user, index) => (
          <motion.div
            key={user.user_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt={user.username}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{user.username}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        user.user_role === 'ADMIN'
                          ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {user.user_role}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: {user.user_id}
                    </p>
                  </div>
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
                    onClick={() => handleDeleteUser(user.user_id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-red-600 dark:text-red-400"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-sm font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                    <p className="text-sm font-medium">{user.phone_number || 'Not set'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                    <p className="text-sm font-medium">{user.user_role}</p>
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
                <h2 className="text-2xl font- semibold">User Details</h2>
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
                      <p className="text-sm text-gray-600 dark:text-gray-400">Username</p>
                      <p className="font-medium">{selectedUser.username}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                      <p className="font-medium">{selectedUser.user_id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                      <p className="font-medium">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-medium">{selectedUser.phone_number || 'Not set'}</p>
                    </div>
                  </div>
                </div>

                {/* Role Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Role Information</h3>
                  <div className="grid gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                      <p className="font-medium">{selectedUser.user_role}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Created At</p>
                      <p className="font-medium">
                        {new Date(selectedUser.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleDeleteUser(selectedUser.user_id)
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