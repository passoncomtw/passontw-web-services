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

// Mock 商家資料
export const MOCK_MERCHANTS: Merchant[] = [
  {
    id: '1',
    name: '美味關東煮',
    category: 'oden',
    status: 'online',
    email: 'contact@delicious-oden.com',
    phone: '02-1234-5678',
    createdAt: '2024-01-15',
    updatedAt: '2024-03-10',
  },
  {
    id: '2',
    name: '清香飲品店',
    category: 'beverage',
    status: 'offline',
    email: 'info@fresh-drinks.com',
    phone: '02-2345-6789',
    createdAt: '2024-02-01',
    updatedAt: '2024-03-08',
  },
  {
    id: '3',
    name: '溫暖小舖',
    category: 'mixed',
    status: 'online',
    email: 'service@warm-shop.com',
    phone: '02-3456-7890',
    createdAt: '2024-03-01',
    updatedAt: '2024-03-05',
  },
  {
    id: '4',
    name: '夜市飲料站',
    category: 'beverage',
    status: 'online',
    email: 'night@market-drinks.com',
    phone: '02-4567-8901',
    createdAt: '2024-01-20',
    updatedAt: '2024-03-12',
  },
  {
    id: '5',
    name: '老師傅關東煮',
    category: 'oden',
    status: 'offline',
    email: 'master@traditional-oden.com',
    phone: '02-5678-9012',
    createdAt: '2024-02-10',
    updatedAt: '2024-03-09',
  },
  {
    id: '6',
    name: '風味小食堂',
    category: 'mixed',
    status: 'online',
    email: 'flavor@small-kitchen.com',
    phone: '02-6789-0123',
    createdAt: '2024-02-15',
    updatedAt: '2024-03-11',
  },
  {
    id: '7',
    name: '24小時飲品',
    category: 'beverage',
    status: 'online',
    phone: '02-7890-1234',
    createdAt: '2024-01-25',
    updatedAt: '2024-03-12',
  },
  {
    id: '8',
    name: '傳統關東煮',
    category: 'oden',
    status: 'offline',
    email: 'traditional@oden-house.com',
    createdAt: '2024-03-05',
    updatedAt: '2024-03-10',
  },
  {
    id: '9',
    name: '綜合小攤',
    category: 'mixed',
    status: 'online',
    email: 'mixed@food-stall.com',
    phone: '02-9012-3456',
    createdAt: '2024-02-20',
    updatedAt: '2024-03-12',
  },
  {
    id: '10',
    name: '手搖飲專賣',
    category: 'beverage',
    status: 'online',
    email: 'handmade@tea-shop.com',
    phone: '02-0123-4567',
    createdAt: '2024-01-30',
    updatedAt: '2024-03-11',
  },
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
