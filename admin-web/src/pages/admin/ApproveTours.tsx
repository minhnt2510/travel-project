import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/layouts/AdminLayout'
import { toursApi, Tour } from '../../lib/api/tours'

export default function ApproveTours() {
  const queryClient = useQueryClient()

  const { data: pendingTours = [], isLoading } = useQuery({
    queryKey: ['tours', 'pending'],
    queryFn: () => toursApi.getPending(),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Tour['status'] }) =>
      toursApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] })
    },
  })

  const handleApprove = (id: string) => {
    if (confirm('Bạn có chắc muốn duyệt tour này?')) {
      updateStatusMutation.mutate({ id, status: 'approved' })
    }
  }

  const handleReject = (id: string) => {
    if (confirm('Bạn có chắc muốn từ chối tour này?')) {
      updateStatusMutation.mutate({ id, status: 'rejected' })
    }
  }

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Duyệt Tours</h1>

        {pendingTours.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-gray-500">Không có tour nào đang chờ duyệt</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingTours.map((tour) => (
              <div key={tour._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {tour.imageUrl && (
                  <img src={tour.imageUrl} alt={tour.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{tour.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Địa điểm</div>
                      <div className="font-medium">{tour.destination}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Giá</div>
                      <div className="font-bold text-green-600">
                        {tour.price?.toLocaleString('vi-VN')}đ
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(tour._id)}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Duyệt
                    </button>
                    <button
                      onClick={() => handleReject(tour._id)}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

