import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// API 基礎配置 - 遵循 DRY 原則，統一管理 API 配置
const server = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

// Redux Persist 的 key（需與 configureStore 的 persistConfig.key 一致），401 時一併清除，避免重載後還原成已登入造成登入/merchants 無限重導
const REDUX_PERSIST_KEY = 'persist:react-mui-redux-saga-root'

// 回應攔截器 - 統一處理錯誤
server.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // 清除過期的認證資訊（含 redux-persist，否則重載後會還原 isAuthenticated 導致 login ↔ merchants 無限重導）
      localStorage.removeItem('auth-token')
      localStorage.removeItem('auth-user')
      localStorage.removeItem(REDUX_PERSIST_KEY)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const getServer = () => server
export default server
