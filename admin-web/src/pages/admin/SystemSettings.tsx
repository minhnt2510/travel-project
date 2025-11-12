import AdminLayout from '../../components/layouts/AdminLayout'

export default function SystemSettings() {
  return (
    <AdminLayout>
      <div className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt hệ thống</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cài đặt chung</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên hệ thống
                  </label>
                  <input
                    type="text"
                    defaultValue="Travel App"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email liên hệ
                  </label>
                  <input
                    type="email"
                    defaultValue="admin@travel.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thời gian hết hạn token (giờ)
                  </label>
                  <input
                    type="number"
                    defaultValue="24"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
                Lưu cài đặt
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

