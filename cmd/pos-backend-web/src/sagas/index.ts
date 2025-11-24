// Root Saga - 整合所有 sagas

import { all, fork } from 'redux-saga/effects'
import { watchAuthSagas } from './authSagas'

/**
 * Root Saga
 * 整合所有功能的 sagas
 */
export default function* rootSaga() {
  yield all([
    fork(watchAuthSagas),
  ])
}
