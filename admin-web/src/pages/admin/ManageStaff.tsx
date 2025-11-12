import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AdminLayout from '../../components/layouts/AdminLayout'
import { usersApi, User } from '../../lib/api/users'

export default function ManageStaff() {
  const queryClient = useQueryClient()

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => usersApi.getAll(),
  })

  const updateRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: User['role'] }) =>
      usersApi.updateRole(id, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })

  const staffAndAdmins = users.filter((u) => u.role === 'staff' || u.role === 'admin')

  const handleToggleRole = (id: string, currentRole: User['role']) => {
    const newRole = currentRole === 'staff' ? 'admin' : 'staff'
    if (confirm(`Thay đổi vai trò từ ${currentRole} sang ${newRole}?`)) {
      updateRoleMutation.mutate({ id, role: newRole })
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Quản lý Staff & Admin</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staffAndAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      Không có staff hoặc admin nào
                    </td>
                  </tr>
                ) : (
                  staffAndAdmins.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleToggleRole(user._id, user.role)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          {user.role === 'staff' ? 'Nâng lên Admin' : 'Hạ xuống Staff'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

