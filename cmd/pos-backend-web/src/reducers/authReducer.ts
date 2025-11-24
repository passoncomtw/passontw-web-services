// 認證 Reducer - 遵循 SRP 原則，只負責認證狀態管理

import { AuthActionTypes, AuthActions, AuthReduxState } from '../types/redux'

// 初始狀態
const initialState: AuthReduxState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
}

// Auth Reducer
const authReducer = (state = initialState, action: AuthActions): AuthReduxState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      }

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }

    case AuthActionTypes.LOGIN_ERROR:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
        error: action.payload.message,
      }

    case AuthActionTypes.LOGOUT_SUCCESS:
      return initialState

    case AuthActionTypes.CHECK_AUTH_SUCCESS:
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        error: null,
      }

    case AuthActionTypes.CHECK_AUTH_ERROR:
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        token: null,
      }

    case AuthActionTypes.UPDATE_USER:
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      }

    default:
      return state
  }
}

export default authReducer
