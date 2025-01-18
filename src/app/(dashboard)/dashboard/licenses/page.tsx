'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Key, Search, Calendar, AlertTriangle, CheckCircle,
  Clock, Shield, Building2, Plus
} from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'
import { Input } from '@/components/ui/input'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface License {
  id: string
  desktop_user_id: string
  license_activated: string
  license_expired: string
  created_at: string
  company_name: string
  status: 'active' | 'expired' | 'expiring_soon'
}

export default function LicensesPage() {
  const { data: session } = useSession()
  const [licenses, setLicenses] = useState<License[]>([])
  const [filteredLicenses, setFilteredLicenses] = useState<License[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showAddLicense, setShowAddLicense] = useState(false)
  const [newLicense, setNewLicense] = useState({
    desktop_user_id: '',
    license_activated: '',
    license_expired: ''
  })

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        const { data: licenseData, error } = await supabase
          .from('licenses')
          .select(`
            *,
            desktop_user (
              company_name
            )
          `)
          .order('created_at', { ascending: false })

        if (error) throw error

        const formattedLicenses = licenseData.map(license => {
          const now = new Date()
          const expireDate = new Date(license.license_expired)
          const daysUntilExpire = Math.ceil((expireDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

          return {
            ...license,
            company_name: license.desktop_user.company_name,
            status: daysUntilExpire <= 0 
              ? 'expired'
              : daysUntilExpire <= 30 
              ? 'expiring_soon' 
              : 'active'
          }
        })

        setLicenses(formattedLicenses)
        setFilteredLicenses(formattedLicenses)
      } catch (error) {
        console.error('Error fetching licenses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLicenses()
  }, [])

  useEffect(() => {
    const filtered = licenses.filter(license => 
      license.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      license.desktop_user_id.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredLicenses(filtered)
  }, [searchTerm, licenses])

  const handleAddLicense = async () => {
    try {
      const { data, error } = await supabase
        .from('licenses')
        .insert([
          {
            desktop_user_id: newLicense.desktop_user_id,
            license_activated: newLicense.license_activated,
            license_expired: newLicense.license_expired
          }
        ])
        .select()
        .single()

      if (error) throw error

      // Update company_info table
      await supabase
        .from('company_info')
        .update({
          license_start: newLicense.license_activated,
          license_end: newLicense.license_expired
        })
        .eq('desktop_user_id', newLicense.desktop_user_id)

      // Add to activities
      await supabase
        .from('activities')
        .insert([
          {
            title: 'License Updated',
            description: `License updated for company ${newLicense.desktop_user_id}`,
            affected_user: newLicense.desktop_user_id,
            user_type: 'desktop_user'
          }
        ])

      // TODO: Sync with desktop app

      setShowAddLicense(false)
      // Refresh licenses
      window.location.reload()
    } catch (error) {
      console.error('Error adding license:', error)
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
          <Key className="w-5 h-5" />
          <h1 className="text-2xl font-semibold">License Management</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="search"
              placeholder="Search licenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {session?.user?.role === 'ADMIN' && (
            <button
              onClick={() => setShowAddLicense(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add License
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        {filteredLicenses.map((license, index) => (
          <motion.div
            key={license.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold">{license.company_name}</h3>
                    {license.status === 'active' && (
                      <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        Active
                      </span>
                    )}
                    {license.status === 'expired' && (
                      <span className="flex items-center gap-1 text-sm text-red-600 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        Expired
                      </span>
                    )}
                    {license.status === 'expiring_soon' && (
                      <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                        <Clock className="w-4 h-4" />
                        Expiring Soon
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    ID: {license.desktop_user_id}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Activated</p>
                    <p className="text-sm font-medium">
                      {new Date(license.license_activated).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expires</p>
                    <p className="text-sm font-medium">
                      {new Date(license.license_expired).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Days Left</p>
                    <p className="text-sm font-medium">
                      {Math.max(0, Math.ceil(
                        (new Date(license.license_expired).getTime() - new Date().getTime()) / 
                        (1000 * 60 * 60 * 24)
                      ))} days
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                    <p className={`text-sm font-medium ${
                      license.status === 'active'
                        ? 'text-green-600 dark:text-green-400'
                        : license.status === 'expired'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}>
                      {license.status.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add License Modal */}
      {showAddLicense && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Add License</h2>
                <button
                  onClick={() => setShowAddLicense(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Company ID
                  </label>
                  <Input
                    type="text"
                    value={newLicense.desktop_user_id}
                    onChange={(e) => setNewLicense({
                      ...newLicense,
                      desktop_user_id: e.target.value
                    })}
                    placeholder="Enter company ID"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    License Start Date
                  </label>
                  <Input
                    type="date"
                    value={newLicense.license_activated}
                    onChange={(e) => setNewLicense({
                      ...newLicense,
                      license_activated: e.target.value
                    })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    License End Date
                  </label>
                  <Input
                    type="date"
                    value={newLicense.license_expired}
                    onChange={(e) => setNewLicense({
                      ...newLicense,
                      license_expired: e.target.value
                    })}
                  />
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={handleAddLicense}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add License
                  </button>
                  <button
                    onClick={() => setShowAddLicense(false)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Cancel
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