import types from '~/constants/actionTypes';
import { put } from 'redux-saga/effects';
import fetchAPIResult from '~/utils/sagaUtils';
import {
  getBEUserListResult,
  editBEUserResult,
  // deleteBEUserResult,
  addBEUserResult,
} from '~/apis/api';
import { compactObject } from '~/utils/utils';

export function* getAccountListSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: getBEUserListResult,
    payload: compactObject(payload),
    action: types.GET_ACCOUNT_LIST,
    resultHandler: data => {
      // API 回傳格式: { items: [...], code: "200", pagination: { totalCount: 10, page: 1, size: 10 } }
      // sagaUtils 會提取 resp.data，所以這裡的 data 是整個響應對象
      const rows = data.items;
      const count = data.pagination.totalCount;
      return { rows, count };
    },
  });
}

export function* updateAccountSaga({ payload: { onSuccess, ...payload } }) {
  return yield fetchAPIResult({
    apiResult: editBEUserResult,
    payload,
    action: types.UPDATE_ACCOUNT,
    onSuccess,
  });
}

export function* addAccountSaga({ payload: { onSuccess, ...payload } }) {
  return yield fetchAPIResult({
    apiResult: addBEUserResult,
    action: types.ADD_ACCOUNT,
    payload,
    onSuccess,
  });
}

export function* deleteAccountSaga({ payload }) {
  yield put({
    type: types.DELETE_ACCOUNT_SUCCESS,
    payload,
  });
  // return yield fetchAPIResult({
  //   apiResult: deleteBEUserResult,
  //   payload,
  //   action: types.DELETE_ACCOUNT,
  // });
}
