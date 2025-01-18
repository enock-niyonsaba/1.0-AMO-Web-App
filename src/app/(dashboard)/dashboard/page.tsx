'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart, LineChart, AreaChart, ResponsiveContainer, XAxis, 
  YAxis, Tooltip, Bar, Line, Area 
} from 'recharts'
import { 
  Users, QrCode, Receipt, Activity, ArrowUp, 
  ArrowDown, AlertCircle 
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface DashboardStats {
  totalUsers: number
  totalQrScans: number
  totalVat: number
  activeUsers: number
  recentActivities: any[]
  syncData: any[]
  qrCodeData: any[]
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalQrScans: 0,
    totalVat: 0,
    activeUsers: 0,
    recentActivities: [],
    syncData: [],
    qrCodeData: []
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (session?.user?.role === 'ADMIN') {
          // Fetch admin dashboard data
          const { data: users } = await supabase
            .from('desktop_user')
            .select('*')
            .eq('is_deleted', false)

          const { data: qrStats } = await supabase
            .from('company_info')
            .select('qr_code_scanned, vat_amount')

          const { data: activities } = await supabase
            .from('activities')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)

          setStats({
            totalUsers: users?.length || 0,
            totalQrScans: qrStats?.reduce((acc, curr) => acc + curr.qr_code_scanned, 0) || 0,
            totalVat: qrStats?.reduce((acc, curr) => acc + Number(curr.vat_amount), 0) || 0,
            activeUsers: users?.filter(u => u.status === 'active').length || 0,
            recentActivities: activities || [],
            syncData: [], // TODO: Add sync data
            qrCodeData: [] // TODO: Add QR code data
          })
        } else {
          // Fetch user dashboard data
          const { data: companyInfo } = await supabase
            .from('company_info')
            .select('*')
            .eq('desktop_user_id', session?.user?.id)
            .single()

          const { data: activities } = await supabase
            .from('activities')
            .select('*')
            .eq('affected_user', session?.user?.id)
            .order('created_at', { ascending: false })
            .limit(10)

          setStats({
            totalUsers: 1,
            totalQrScans: companyInfo?.qr_code_scanned || 0,
            totalVat: Number(companyInfo?.vat_amount) || 0,
            activeUsers: 1,
            recentActivities: activities || [],
            syncData: [], // TODO: Add sync data
            qrCodeData: [] // TODO: Add QR code data
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [session])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 ml-1">12%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">from last month</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">QR Codes Scanned</p>
              <h3 className="text-2xl font-bold mt-1">{stats.totalQrScans}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <QrCode className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 ml-1">8%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">from last week</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total VAT</p>
              <h3 className="text-2xl font-bold mt-1">${stats.totalVat.toLocaleString()}</h3>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowDown className="w-4 h-4 text-red-500" />
            <span className="text-red-500 ml-1">3%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">from yesterday</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Users</p>
              <h3 className="text-2xl font-bold mt-1">{stats.activeUsers}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <ArrowUp className="w-4 h-4 text-green-500" />
            <span className="text-green-500 ml-1">5%</span>
            <span className="text-gray-600 dark:text-gray-400 ml-2">from last hour</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">QR Code Scans</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.qrCodeData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="scans" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Sync Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.syncData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="syncs" 
                  stroke="#8b5cf6" 
                  strokeWidth={2} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {stats.recentActivities.map((activity, index) => (
            <div 
              key={activity.activity_id} 
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h4 className="font-medium">{activity.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {new Date(activity.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {session?.user?.role === 'ADMIN' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">System Alerts</h3>
          </div>
          <div className="space-y-4">
            {/* Add system alerts here */}
          </div>
        </motion.div>
      )}
    </div>
  )
}