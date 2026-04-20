import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">DevLink</Link>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/jobs" className="text-gray-600 hover:text-blue-600">Jobs</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link to="/messages" className="text-gray-600 hover:text-blue-600">Messages</Link>
              {user.role === 'employer' && (
                <Link to="/post-job" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">Post Job</Link>
              )}
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-600 hover:text-blue-600">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
