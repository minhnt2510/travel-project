import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layouts/AdminLayout'
import { bookingsApi } from '../../lib/api/bookings'
import { toursApi } from '../../lib/api/tours'
import { usersApi } from '../../lib/api/users'

export default function AdminDashboard() {
  const navigate = useNavigate()

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getAll(),
  })

  const { data: toursResponse, isLoading: toursLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: () => toursApi.getAll(),
  })

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  })

  const isLoading = bookingsLoading || toursLoading || usersLoading

  const tours = toursResponse?.tours ?? []

  // Calculate governance KPIs
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  const totalOrders = bookings.length
  const totalTours = toursResponse?.total ?? tours.length
  const totalUsers = users.length
  const pendingTours = tours.filter((t) => t.status === 'pending').length

  const statCards = [
    {
      title: 'Tổng doanh thu',
      value: totalRevenue.toLocaleString('vi-VN') + 'đ',
      icon: '💰',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
      action: () => navigate('/admin/analytics'),
    },
    {
      title: 'Tổng đơn hàng',
      value: totalOrders.toString(),
      icon: '📦',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
      action: () => navigate('/admin/analytics'),
    },
    {
      title: 'Tổng tours',
      value: totalTours.toString(),
      icon: '🗺️',
      color: 'bg-green-50 border-green-200 text-green-700',
      action: () => navigate('/admin/tours/approve'),
    },
    {
      title: 'Tổng users',
      value: totalUsers.toString(),
      icon: '👥',
      color: 'bg-orange-50 border-orange-200 text-orange-700',
      action: () => navigate('/admin/users'),
    },
  ]

  const quickActions = [
    {
      label: 'Quản lý Users',
      icon: '👥',
      route: '/admin/users',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      label: 'Quản lý Staff',
      icon: '👔',
      route: '/admin/staff',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
      label: 'Cài đặt hệ thống',
      icon: '⚙️',
      route: '/admin/settings',
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
    },
    {
      label: 'Phân tích',
      icon: '📈',
      route: '/admin/analytics',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
  ]

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Quản lý hệ thống và phân tích dữ liệu</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, i) => (
            <button
              key={i}
              onClick={stat.action}
              className={`p-6 rounded-lg border-2 ${stat.color} hover:shadow-lg transition text-left`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
              </div>
              <div className="text-sm font-medium mb-1">{stat.title}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </button>
          ))}
        </div>

        {/* Pending Tours Alert */}
        {pendingTours > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-yellow-900">
                  Có {pendingTours} tour đang chờ duyệt
                </div>
                <div className="text-sm text-yellow-700 mt-1">
                  Vui lòng xem và duyệt các tour mới
                </div>
              </div>
              <button
                onClick={() => navigate('/admin/tours/approve')}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
              >
                Xem ngay
              </button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="grid grid-cols-4 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                className={`p-6 rounded-lg border-2 ${action.color} transition text-center`}
              >
                <div className="text-4xl mb-2">{action.icon}</div>
                <div className="text-sm font-medium">{action.label}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

