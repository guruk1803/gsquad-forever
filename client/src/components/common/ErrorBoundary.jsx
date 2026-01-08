import React from 'react'
import { Heart } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ ErrorBoundary caught an error:', error)
    console.error('Error Info:', errorInfo)
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-2xl w-full card text-center">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              An error occurred while loading this page. Please try refreshing.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-gray-100 p-4 rounded-lg">
                <summary className="cursor-pointer font-semibold text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-600 overflow-auto max-h-64">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null })
                window.location.reload()
              }}
              className="btn-primary bg-primary text-white mt-4"
            >
              Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

