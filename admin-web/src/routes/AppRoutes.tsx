import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import { ProtectedRoute } from '../components/ProtectedRoute'
import Login from '../pages/Login'
import StaffDashboard from '../pages/staff/StaffDashboard'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageBookings from '../pages/staff/ManageBookings'
import ManageTours from '../pages/staff/ManageTours'
import ViewCancellations from '../pages/staff/ViewCancellations'
import CreateTour from '../pages/staff/CreateTour'
import ManageUsers from '../pages/admin/ManageUsers'
import ManageStaff from '../pages/admin/ManageStaff'
import ApproveTours from '../pages/admin/ApproveTours'
import SystemSettings from '../pages/admin/SystemSettings'
import Analytics from '../pages/admin/Analytics'

export default function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Staff Routes */}
        <Route
          path="/staff/dashboard"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/bookings"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <ManageBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tours"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <ManageTours />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/tours/create"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <CreateTour />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/cancellations"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <ViewCancellations />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStaff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/tours/approve"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ApproveTours />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemSettings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Analytics />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}

