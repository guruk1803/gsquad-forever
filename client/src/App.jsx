import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ErrorBoundary from './components/common/ErrorBoundary'
import PublicRoutes from './routes/PublicRoutes'
import AdminRoutes from './routes/AdminRoutes'
import NotFound from './pages/NotFound'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
              <Routes>
                <Route path="/*" element={<PublicRoutes />} />
                <Route path="/admin/*" element={<AdminRoutes />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
              <Toaster 
                position="top-center"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: '#fff',
                    color: '#333',
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  },
                }}
              />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App


