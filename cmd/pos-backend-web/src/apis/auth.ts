import { AuthApiResponse } from '@/types/api'
import type { LoginCredentials } from '../types'
import server from './index'

/**
 * 登入 API - 呼叫後端認證服務
 * 
 * @param payload - 登入憑證 { account, password }
 * @returns Promise<AuthApiResponse> - 包含 access_token 和 user 資料
 */
export const signinResult = async (payload: LoginCredentials): Promise<AuthApiResponse> => {
  try {
    const response = await server.post<AuthApiResponse>('/api/admin/auth/login', payload)
    return response.data
  } catch (error: unknown) {
    // 處理錯誤回應
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } }
      const message = axiosError.response?.data?.message || '登入失敗'
      throw new Error(message)
    }
    throw new Error('網路錯誤，請稍後再試')
  }
}

/**
 * 登出 API - 呼叫後端登出服務
 * 
 * @returns Promise<{ success: boolean; message: string }>
 */
export const signoutResult = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await server.post<{ success: boolean; message: string }>('/api/admin/auth/logout')
    return response.data
  } catch {
    // 即使後端登出失敗，也返回成功（本地清除即可）
    return {
      success: true,
      message: '登出成功',
    }
  }
}
