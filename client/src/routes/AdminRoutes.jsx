import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AdminLogin from '../pages/admin/AdminLogin'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminCelebrations from '../pages/admin/AdminCelebrations'
import AdminCelebrationEdit from '../pages/admin/AdminCelebrationEdit'
import AdminWishes from '../pages/admin/AdminWishes'
import AdminLayout from '../components/admin/AdminLayout'
import LoadingSpinner from '../components/common/LoadingSpinner'

const PrivateRoute = ({ children }) => {
  const { admin, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return admin ? children : <Navigate to="/admin/login" replace />
}

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<AdminLogin />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/celebrations"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminCelebrations />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/celebrations/new"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminCelebrationEdit />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/celebrations/:id"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminCelebrationEdit />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route
        path="/wishes"
        element={
          <PrivateRoute>
            <AdminLayout>
              <AdminWishes />
            </AdminLayout>
          </PrivateRoute>
        }
      />
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  )
}

export default AdminRoutes

