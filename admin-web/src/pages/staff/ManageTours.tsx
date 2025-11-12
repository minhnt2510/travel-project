import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import StaffLayout from '../../components/layouts/StaffLayout'
import { toursApi } from '../../lib/api/tours'

export default function ManageTours() {
  const { data: toursResponse, isLoading } = useQuery({
    queryKey: ['tours'],
    queryFn: () => toursApi.getAll(),
  })

  const tours = toursResponse?.tours ?? []

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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Tours</h1>
          <Link
            to="/staff/tours/create"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Thêm Tour
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div key={tour._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {tour.imageUrl && (
                <img src={tour.imageUrl} alt={tour.title} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{tour.title}</h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                <div className="flex items-center justify-between">
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
                <div className="mt-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      tour.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : tour.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {tour.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </StaffLayout>
  )
}

