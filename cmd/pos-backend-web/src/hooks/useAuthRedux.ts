// 認證專用 Hook - 遵循 SRP 原則，專門處理認證邏輯

import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAuth } from './useRedux'
import { loginRequest, logoutRequest } from '../actions/authActions'
import type { LoginCredentials } from '../types'

/**
 * 認證專用 Hook
 * 提供登入、登出等認證相關功能
 */
export const useAuthRedux = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const authState = useAuth()

  // 登入功能
  const login = useCallback(
    (credentials: LoginCredentials) => {
      dispatch(loginRequest(credentials))
    },
    [dispatch]
  )

  // 登出功能
  const logout = useCallback(() => {
    dispatch(logoutRequest())
    navigate('/login')
  }, [dispatch, navigate])

  return {
    // 狀態
    isAuthenticated: authState?.isAuthenticated || false,
    user: authState?.user || null,
    token: authState?.token || null,
    loading: authState?.loading || false,
    error: authState?.error || null,
    
    // 方法
    login,
    logout,
  }
}
