// Root Reducer - 整合所有 reducers

import { combineReducers } from 'redux'
import authReducer from './authReducer'

// 整合所有 reducers
const rootReducer = combineReducers({
  auth: authReducer,
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>
