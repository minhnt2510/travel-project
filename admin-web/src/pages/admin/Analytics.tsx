import { useQuery } from '@tanstack/react-query'
import AdminLayout from '../../components/layouts/AdminLayout'
import { bookingsApi } from '../../lib/api/bookings'
import { toursApi } from '../../lib/api/tours'

export default function Analytics() {
  const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getAll(),
  })

  const { data: toursResponse, isLoading: toursLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: () => toursApi.getAll(),
  })

  const isLoading = bookingsLoading || toursLoading

  const tours = toursResponse?.tours ?? []
  const totalTours = toursResponse?.total ?? tours.length

  // Calculate analytics
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0)

  const totalBookings = bookings.length
  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed').length
  const cancelledBookings = bookings.filter((b) => b.status === 'cancelled').length
  const averageBookingValue = confirmedBookings > 0 ? totalRevenue / confirmedBookings : 0

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Phân tích</h1>

        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng doanh thu</div>
            <div className="text-2xl font-bold text-purple-600">
              {totalRevenue.toLocaleString('vi-VN')}đ
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Tổng đơn hàng</div>
            <div className="text-2xl font-bold text-blue-600">{totalBookings}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Đơn đã xác nhận</div>
            <div className="text-2xl font-bold text-green-600">{confirmedBookings}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-1">Đơn đã hủy</div>
            <div className="text-2xl font-bold text-red-600">{cancelledBookings}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống kê chi tiết</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Giá trị đơn hàng trung bình</span>
              <span className="font-bold">{averageBookingValue.toLocaleString('vi-VN')}đ</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Tỷ lệ xác nhận</span>
              <span className="font-bold">
                {totalBookings > 0
                  ? ((confirmedBookings / totalBookings) * 100).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200">
              <span className="text-gray-600">Tỷ lệ hủy</span>
              <span className="font-bold">
                {totalBookings > 0 ? ((cancelledBookings / totalBookings) * 100).toFixed(1) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Tổng số tours</span>
              <span className="font-bold">{totalTours}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

