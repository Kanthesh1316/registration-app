import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import Details from './pages/Details'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import MyClasses from './pages/MyClasses'
import Manage from './pages/Manage'
import Users from './pages/Users'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/details"
        element={
          <ProtectedRoute allowedRoles={['USER', 'MANAGER', 'ADMIN']}>
            <Details />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-classes"
        element={
          <ProtectedRoute allowedRoles={['USER', 'TRAINER', 'MANAGER', 'ADMIN']}>
            <MyClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/manage"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'MANAGER', 'TRAINER']}>
            <Manage />
          </ProtectedRoute>
        }
      />
      <Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={['ADMIN']}>
      <Users />
    </ProtectedRoute>
  }
/>
    </Routes>

  )
}

export default App