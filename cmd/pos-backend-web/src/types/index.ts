// 全域類型定義 - 遵循 DRY 原則，統一管理所有類型

// 使用者相關類型 - 匹配後端 API 回應
export interface User {
  user_id: string
  account: string
  name: string
  role: string
  email: string
}

// 登入憑證類型 - 匹配後端 API 請求
export interface LoginCredentials {
  account: string
  password: string
}

// 商家相關類型
export interface Merchant {
  id: string
  name: string
  category: string
  status: 'online' | 'offline'
  email?: string
  phone?: string
  createdAt: string
  updatedAt: string
}

// 商家篩選條件
export interface MerchantFilters {
  search: string
  category: string
  status: string
}

// 分頁狀態
export interface PaginationState {
  page: number
  pageSize: number
  total: number
}

// 應用程式布局 Props
export interface AppLayoutProps {
  children: React.ReactNode
  title?: string
}

// 導航項目
export interface DrawerItem {
  text: string
  icon: React.ReactNode
  path: string
  active?: boolean
}
