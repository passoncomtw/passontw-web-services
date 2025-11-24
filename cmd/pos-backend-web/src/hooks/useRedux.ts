// 類型安全的 Redux Hooks - 遵循 DRY 原則，統一管理 Redux 操作

import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store/configureStore'
import type { AuthReduxState } from '../types/redux'

// 類型安全的 useDispatch hook
export const useAppDispatch = () => useDispatch<AppDispatch>()

// 類型安全的 useSelector hook
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// 認證相關的 selector hooks
export const useAuth = () => {
  return useAppSelector((state: RootState) => state.auth) as unknown as AuthReduxState
}