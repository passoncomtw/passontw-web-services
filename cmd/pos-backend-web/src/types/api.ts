import type { User } from '../types'
import type { Merchant } from '../types'

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

// 商家列表回應
export interface MerchantListResponse {
  success: boolean
  message: string
  data: {
    merchants: MerchantDTO[]
    pagination: PaginationDTO
  }
}

// 後端返回的商家 DTO
export interface MerchantDTO {
  merchant_id: string
  merchant_name: string
  status: 'online' | 'offline'
  created_at: string
  updated_at: string
}

// 後端返回的分頁資訊
export interface PaginationDTO {
  current_page: number
  per_page: number
  total_count: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}