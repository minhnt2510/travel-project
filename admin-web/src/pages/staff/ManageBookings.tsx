import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import StaffLayout from '../../components/layouts/StaffLayout'
import { bookingsApi, Booking } from '../../lib/api/bookings'

export default function ManageBookings() {
  const queryClient = useQueryClient()

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['bookings'],
    queryFn: () => bookingsApi.getAll(),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking['status'] }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
    },
  })

  const handleStatusChange = (id: string, status: Booking['status']) => {
    if (confirm('Bạn có chắc muốn thay đổi trạng thái?')) {
      updateStatusMutation.mutate({ id, status })
    }
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý đơn hàng</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số khách
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.tour?.title || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.user?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.user?.email || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.guests}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.totalPrice?.toLocaleString('vi-VN')}đ
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Xác nhận
                        </button>
                      )}
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'in_progress')}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          Bắt đầu
                        </button>
                      )}
                      {booking.status === 'in_progress' && (
                        <button
                          onClick={() => handleStatusChange(booking._id, 'completed')}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Hoàn thành
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </StaffLayout>
  )
}

