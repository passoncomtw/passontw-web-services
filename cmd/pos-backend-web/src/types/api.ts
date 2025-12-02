import type { User } from '../types'

// API 回應類型定義 - 匹配後端 API 回應格式
export interface AuthApiResponse {
  success: boolean
  message: string
  data: {
    access_token: string
    token_type: string
    user: User
  }
}

// API 錯誤回應類型
export interface ApiErrorResponse {
  success: false
  message: string
  error?: string
}