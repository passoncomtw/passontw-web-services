// 認證服務 - 遵循單一職責原則，只負責認證相關的服務調用

import { AuthApiResponse } from '@/types/api'
import { signinResult, signoutResult } from '../apis/auth'
import type { LoginCredentials } from '../types'

/**
 * 登入 API 調用
 */
export const loginAPI = async (credentials: LoginCredentials): Promise<AuthApiResponse> => {
  const response = await signinResult(credentials)
  return response
}

/**
 * 登出 API 調用
 */
export const logoutAPI = async () => {
  const response = await signoutResult()
  return response
}
