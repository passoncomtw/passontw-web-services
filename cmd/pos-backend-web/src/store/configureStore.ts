import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from '../reducers'
import rootSaga from '../sagas'

// Redux Persist 配置
const persistConfig = {
  key: 'react-mui-redux-saga-root',
  storage,
  whitelist: ['auth'], // 只持久化 auth 狀態
}

// 建立 Saga 中間件
const sagaMiddleware = createSagaMiddleware()

// 建立持久化的 reducer
// @ts-expect-error - Redux Persist 類型衝突的已知問題
const persistedReducer = persistReducer(persistConfig, rootReducer)

// 配置 store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/PURGE',
          'persist/REGISTER',
          'persist/FLUSH',
        ],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
})

// 建立 persistor
// @ts-expect-error - Redux Persist 類型衝突的已知問題
export const persistor = persistStore(store)

// 運行 root saga
sagaMiddleware.run(rootSaga)

// 定義類型
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
