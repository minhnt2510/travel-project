import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import StaffLayout from '../../components/layouts/StaffLayout'
import { bookingsApi } from '../../lib/api/bookings'

export default function StaffDashboard() {
  const navigate = useNavigate()

  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getAll(),
  })

  const isLoading = bookingsLoading

  // Calculate stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const todayOrders = bookings.filter((b) => {
    const bookingDate = new Date(b.createdAt)
    bookingDate.setHours(0, 0, 0, 0)
    return bookingDate.getTime() === today.getTime()
  }).length

  const pendingBookings = bookings.filter((b) => b.status === 'pending').length
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'in_progress').length
  const cancellationsToday = bookings.filter((b) => {
    if (b.status !== 'cancelled') return false
    const d = new Date(b.updatedAt || b.createdAt)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  }).length

  const recentPending = bookings.filter((b) => b.status === 'pending').slice(0, 5)
  const recentCancellations = bookings.filter((b) => {
    if (b.status !== 'cancelled') return false
    const d = new Date(b.updatedAt || b.createdAt)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  }).slice(0, 5)

  const glanceChips = [
    { label: 'Hôm nay', value: todayOrders, icon: '📅', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Chờ xác nhận', value: pendingBookings, icon: '⏰', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Đang xử lý', value: confirmedBookings, icon: '✅', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Đơn hủy', value: cancellationsToday, icon: '❌', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  ]

  if (isLoading) {
    return (
      <StaffLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </StaffLayout>
    )
  }

  return (
    <StaffLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Vận hành hôm nay</h1>
          <p className="text-sm text-gray-600 mt-1">
            {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Quick Glance Chips */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {glanceChips.map((chip, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${chip.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-lg">{chip.icon}</span>
                <span className="text-2xl font-bold">{chip.value}</span>
              </div>
              <div className="text-sm font-medium">{chip.label}</div>
            </div>
          ))}
        </div>

        {/* Workbox - Cần xử lý hôm nay */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Cần xử lý hôm nay</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => navigate('/staff/bookings')}
              className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-yellow-900">Chờ xác nhận</span>
                <span className="text-2xl font-bold text-yellow-900">{pendingBookings}</span>
              </div>
              <div className="text-xs text-yellow-700">Xem tất cả →</div>
            </button>
            
            <button
              onClick={() => navigate('/staff/cancellations')}
              className="p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-red-900">Đơn hủy</span>
                <span className="text-2xl font-bold text-red-900">{cancellationsToday}</span>
              </div>
              <div className="text-xs text-red-700">Xem tất cả →</div>
            </button>
          </div>

          {/* Recent Items */}
          <div className="space-y-4">
            {recentPending.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Đơn chờ xác nhận gần đây</h3>
                <div className="space-y-2">
                  {recentPending.map((b) => (
                    <div key={b._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {b.tour?.title || 'Đơn hàng'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.user?.name || 'Khách'} • {new Date(b.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {b.totalPrice?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentCancellations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Đơn hủy gần đây</h3>
                <div className="space-y-2">
                  {recentCancellations.map((b) => (
                    <div key={b._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {b.tour?.title || 'Đơn hàng'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.user?.name || 'Khách'} • {new Date(b.updatedAt || b.createdAt).toLocaleString('vi-VN')}
                        </div>
                      </div>
                      <div className="text-sm font-bold text-red-600">
                        {b.totalPrice?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recentPending.length === 0 && recentCancellations.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Không có công việc cần xử lý ngay.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          <button
            onClick={() => navigate('/staff/tours/create')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">➕</div>
            <div className="text-sm font-medium text-gray-900">Thêm Tour</div>
          </button>
          
          <button
            onClick={() => navigate('/staff/bookings')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">📋</div>
            <div className="text-sm font-medium text-gray-900">Quản lý đơn hàng</div>
          </button>
          
          <button
            onClick={() => navigate('/staff/tours')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">🗺️</div>
            <div className="text-sm font-medium text-gray-900">Quản lý Tours</div>
          </button>
          
          <button
            onClick={() => navigate('/staff/cancellations')}
            className="p-6 bg-white border border-gray-200 rounded-lg hover:border-red-500 hover:shadow-md transition text-center"
          >
            <div className="text-3xl mb-2">❌</div>
            <div className="text-sm font-medium text-gray-900">Xem hủy đơn</div>
          </button>
        </div>
      </div>
    </StaffLayout>
  )
}

