import type { User } from '../types'

// API 回應類型定義
export interface AuthApiResponse {
  success: boolean
  data: {
    user: User
    token: string
  }
  message: string
}