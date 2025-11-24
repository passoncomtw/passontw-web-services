import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// API 基礎配置 - 遵循 DRY 原則，統一管理 API 配置
const server = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 請求攔截器 - 統一添加認證 token
server.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// 回應攔截器 - 統一處理錯誤
server.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 清除過期的認證資訊
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getServer = () => server
export default server
