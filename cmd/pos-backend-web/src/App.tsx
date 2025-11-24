// 主應用程式組件 - 整合路由、主題和 Redux

import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import ReduxProvider from './store/ReduxProvider'
import { theme } from './theme'
import { useAuth } from './hooks/useRedux'
import LoginPage from './pages/LoginPage'
import MerchantsPage from './pages/MerchantsPage'

/**
 * 受保護的路由組件
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth() || {
    isAuthenticated: false,
    loading: false,
    user: null,
    token: null,
    error: null,
  }

  if (auth.loading) {
    return <div>載入中...</div>
  }

  return auth.isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

/**
 * 應用程式路由組件
 */
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* 公開路由 */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* 受保護的路由 */}
        <Route
          path="/merchants"
          element={
            <ProtectedRoute>
              <MerchantsPage />
            </ProtectedRoute>
          }
        />
        
        {/* 預設重定向 */}
        <Route path="/" element={<Navigate to="/merchants" replace />} />
        <Route path="*" element={<Navigate to="/merchants" replace />} />
      </Routes>
    </Router>
  )
}

/**
 * 主應用程式組件
 */
const App: React.FC = () => {
  return (
    <ReduxProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </ReduxProvider>
  )
}

export default App
