import { AuthApiResponse } from '@/types/api';
import type { LoginCredentials, User } from '../types'

// Mock 使用者資料 - 模擬真實 API 回應
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
    email: 'admin@example.com',
    name: '系統管理員',
    role: 'admin',
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    email: 'user@example.com',
    name: '一般使用者',
    role: 'user',
  },
];

/**
 * 登入 API - 遵循單一職責原則，只負責登入驗證
 */
export const signinResult = async (payload: LoginCredentials): Promise<AuthApiResponse> => {
  // 模擬 API 延遲
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // 模擬登入驗證
  const user = MOCK_USERS.find(
    (u) => u.username === payload.username && u.password === payload.password
  )
  
  if (!user) {
    throw new Error('帳號或密碼錯誤')
  }
  
  // 移除密碼欄位
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password: _, ...userWithoutPassword } = user
  
  // 生成 mock token
  const token = `mock_token_${user.id}_${Date.now()}`
  
  return {
    success: true,
    data: {
      user: userWithoutPassword,
      token,
    },
    message: '登入成功',
  }
}

/**
 * 登出 API - 遵循單一職責原則，只負責登出處理
 */
export const signoutResult = async (): Promise<{ success: boolean; message: string }> => {
  // 模擬 API 延遲
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return {
    success: true,
    message: '登出成功',
  }
}
