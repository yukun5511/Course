import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MiniAppLayout } from './components/layout/MiniAppLayout'
import { AdminLayout } from './components/layout/AdminLayout'
import { AdminProtectedRoute } from './components/common/ProtectedRoute'
import { MiniAppProtectedRoute } from './components/common/MiniAppProtectedRoute'
import { ToastContainer } from './components/ui/Toast'
import { ConfirmProvider } from './components/ui/ConfirmDialog'

// 小程序端页面
import LoginPage from './pages/mini/login/LoginPage'
import HomePage from './pages/mini/home/HomePage'
import CoursePage from './pages/mini/course/CoursePage'
import ClassPage from './pages/mini/class/ClassPage'
import ProfilePage from './pages/mini/profile/ProfilePage'
import SchedulePage from './pages/mini/schedule/SchedulePage'

// 管理后台页面
import AdminDashboard from './pages/admin/dashboard/AdminDashboard'
import AdminUsers from './pages/admin/users/AdminUsers'
import AdminClasses from './pages/admin/classes/AdminClasses'
import AdminSchedule from './pages/admin/schedule/AdminSchedule'
import AdminTeaching from './pages/admin/teaching/AdminTeaching'
import AdminAttendance from './pages/admin/attendance/AdminAttendance'
import AdminActivity from './pages/admin/activity/AdminActivity'
import AdminPoints from './pages/admin/points/AdminPoints'
import AdminMessages from './pages/admin/messages/AdminMessages'
import AdminSystem from './pages/admin/system/AdminSystem'
import AdminLoginPage from './pages/admin/login/AdminLoginPage'

function App() {
  return (
    <BrowserRouter>
      <ConfirmProvider>
        <ToastContainer />
        <Routes>
        {/* 默认重定向到小程序登录页 */}
        <Route path="/" element={<Navigate to="/mini/login" replace />} />
        
        {/* 小程序端路由 - 需要登录 */}
        <Route path="/mini" element={<MiniAppLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route
            path="home"
            element={
              <MiniAppProtectedRoute>
                <HomePage />
              </MiniAppProtectedRoute>
            }
          />
          <Route
            path="course"
            element={
              <MiniAppProtectedRoute>
                <CoursePage />
              </MiniAppProtectedRoute>
            }
          />
          <Route
            path="class"
            element={
              <MiniAppProtectedRoute>
                <ClassPage />
              </MiniAppProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <MiniAppProtectedRoute>
                <ProfilePage />
              </MiniAppProtectedRoute>
            }
          />
          <Route
            path="schedule"
            element={
              <MiniAppProtectedRoute>
                <SchedulePage />
              </MiniAppProtectedRoute>
            }
          />
        </Route>

        {/* 管理后台登录 */}
        <Route path="/admin/login" element={<AdminLoginPage />} />

        {/* 管理后台路由 - 需要登录 */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="classes" element={<AdminClasses />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="teaching" element={<AdminTeaching />} />
          <Route path="attendance" element={<AdminAttendance />} />
          <Route path="activity" element={<AdminActivity />} />
          <Route path="points" element={<AdminPoints />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="system" element={<AdminSystem />} />
          <Route index element={<Navigate to="dashboard" replace />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/mini/login" replace />} />
      </Routes>
      </ConfirmProvider>
    </BrowserRouter>
  )
}

export default App
