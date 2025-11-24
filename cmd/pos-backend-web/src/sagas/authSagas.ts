// 認證 Sagas - 遵循 SRP 原則，只負責認證相關的副作用處理

import { call, put, takeLatest } from 'redux-saga/effects'
import { AuthActionTypes } from '../types/redux'
import type { LoginRequestAction } from '../types/redux'
import { loginSuccess, loginError, logoutSuccess } from '../actions/authActions'
import { loginAPI, logoutAPI } from '../services/authService'
import { AuthApiResponse } from '@/types/api'

/**
 * 處理登入請求 Saga
 */
function* handleLoginRequest(action: LoginRequestAction) {
  try {
    const response: AuthApiResponse = yield call(loginAPI, action.payload)
    
    if (response.success) {
      // 儲存 token 到 localStorage
      localStorage.setItem('auth-token', response.data.token)
      localStorage.setItem('auth-user', JSON.stringify(response.data.user))
      
      // 發送登入成功 action
      yield put(loginSuccess(response.data.user, response.data.token))
    } else {
      yield put(loginError(response.message || '登入失敗'))
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : '登入失敗'
    yield put(loginError(message))
  }
}

/**
 * 處理登出請求 Saga
 */
function* handleLogoutRequest() {
  try {
    // 呼叫登出 API（可選）
    yield call(logoutAPI)
    
    // 清除 localStorage 中的認證資訊
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    
    // 發送登出成功 action
    yield put(logoutSuccess())
  } catch {
    // 即使 API 失敗，也要清除本地資訊
    localStorage.removeItem('auth-token')
    localStorage.removeItem('auth-user')
    yield put(logoutSuccess())
  }
}

/**
 * 監聽認證相關的 Actions
 */
export function* watchAuthSagas() {
  yield takeLatest(AuthActionTypes.LOGIN_REQUEST, handleLoginRequest)
  yield takeLatest(AuthActionTypes.LOGOUT_REQUEST, handleLogoutRequest)
}
