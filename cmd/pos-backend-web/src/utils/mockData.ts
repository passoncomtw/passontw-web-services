// Mock 資料 - 遵循 DRY 原則，統一管理測試資料

import type { Merchant } from '../types'

// 商家類別選項
export const MERCHANT_CATEGORIES = [
  { value: '', label: '全部類別' },
  { value: 'oden', label: '關東煮' },
  { value: 'beverage', label: '飲品' },
  { value: 'mixed', label: '綜合' },
]

// 商家狀態選項
export const MERCHANT_STATUS_OPTIONS = [
  { value: '', label: '全部狀態' },
  { value: 'active', label: '營業中' },
  { value: 'inactive', label: '暫停營業' },
  { value: 'pending', label: '審核中' },
]

// 工具函數
export const getCategoryLabel = (value: string): string => {
  const category = MERCHANT_CATEGORIES.find(cat => cat.value === value)
  return category?.label || value
}

export const getStatusInfo = (status: string) => {
  const statusMap = {
    active: { label: '營業中', color: 'success' as const },
    inactive: { label: '暫停營業', color: 'error' as const },
    pending: { label: '審核中', color: 'warning' as const },
  }
  return statusMap[status as keyof typeof statusMap] || { label: status, color: 'default' as const }
}

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
  }).format(amount)
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const simulateApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
