// Redux 相關類型定義 - 遵循 SRP 原則，專門處理 Redux 類型

import type { User, LoginCredentials } from './index'

// Action Types 常數
export enum AuthActionTypes {
  LOGIN_REQUEST = 'AUTH/LOGIN_REQUEST',
  LOGIN_SUCCESS = 'AUTH/LOGIN_SUCCESS',
  LOGIN_ERROR = 'AUTH/LOGIN_ERROR',
  LOGOUT_REQUEST = 'AUTH/LOGOUT_REQUEST',
  LOGOUT_SUCCESS = 'AUTH/LOGOUT_SUCCESS',
  CHECK_AUTH_SUCCESS = 'AUTH/CHECK_AUTH_SUCCESS',
  CHECK_AUTH_ERROR = 'AUTH/CHECK_AUTH_ERROR',
  UPDATE_USER = 'AUTH/UPDATE_USER',
}

// Action 介面定義
export interface LoginRequestAction {
  type: AuthActionTypes.LOGIN_REQUEST
  payload: LoginCredentials
}

export interface LoginSuccessAction {
  type: AuthActionTypes.LOGIN_SUCCESS
  payload: {
    user: User
    token: string
  }
}

export interface LoginErrorAction {
  type: AuthActionTypes.LOGIN_ERROR
  payload: {
    message: string
  }
}

export interface LogoutRequestAction {
  type: AuthActionTypes.LOGOUT_REQUEST
}

export interface LogoutSuccessAction {
  type: AuthActionTypes.LOGOUT_SUCCESS
}

export interface CheckAuthSuccessAction {
  type: AuthActionTypes.CHECK_AUTH_SUCCESS
  payload: {
    user: User
    token: string
  }
}

export interface CheckAuthErrorAction {
  type: AuthActionTypes.CHECK_AUTH_ERROR
}

export interface UpdateUserAction {
  type: AuthActionTypes.UPDATE_USER
  payload: Partial<User>
}

// 所有 Auth Actions 的聯合類型
export type AuthActions =
  | LoginRequestAction
  | LoginSuccessAction
  | LoginErrorAction
  | LogoutRequestAction
  | LogoutSuccessAction
  | CheckAuthSuccessAction
  | CheckAuthErrorAction
  | UpdateUserAction

// Auth State 介面
export interface AuthReduxState {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
}

// Root State 介面
export interface RootState {
  auth: AuthReduxState
}

// API 回應類型
export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}
