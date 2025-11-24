// 認證相關 Actions - 遵循 SRP 原則，只負責 Action 創建

import {
  AuthActionTypes,
  LoginRequestAction,
  LoginSuccessAction,
  LoginErrorAction,
  LogoutRequestAction,
  LogoutSuccessAction,
  CheckAuthSuccessAction,
  CheckAuthErrorAction,
  UpdateUserAction,
} from '../types/redux'
import type { LoginCredentials, User } from '../types'

// 登入請求 Action
export const loginRequest = (credentials: LoginCredentials): LoginRequestAction => ({
  type: AuthActionTypes.LOGIN_REQUEST,
  payload: credentials,
})

// 登入成功 Action
export const loginSuccess = (user: User, token: string): LoginSuccessAction => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  payload: { user, token },
})

// 登入失敗 Action
export const loginError = (message: string): LoginErrorAction => ({
  type: AuthActionTypes.LOGIN_ERROR,
  payload: { message },
})

// 登出請求 Action
export const logoutRequest = (): LogoutRequestAction => ({
  type: AuthActionTypes.LOGOUT_REQUEST,
})

// 登出成功 Action
export const logoutSuccess = (): LogoutSuccessAction => ({
  type: AuthActionTypes.LOGOUT_SUCCESS,
})

// 檢查認證成功 Action
export const checkAuthSuccess = (user: User, token: string): CheckAuthSuccessAction => ({
  type: AuthActionTypes.CHECK_AUTH_SUCCESS,
  payload: { user, token },
})

// 檢查認證失敗 Action
export const checkAuthError = (): CheckAuthErrorAction => ({
  type: AuthActionTypes.CHECK_AUTH_ERROR,
})

// 更新使用者 Action
export const updateUser = (userData: Partial<User>): UpdateUserAction => ({
  type: AuthActionTypes.UPDATE_USER,
  payload: userData,
})
