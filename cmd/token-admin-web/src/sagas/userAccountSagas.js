import types from '~/constants/actionTypes';
import { put } from 'redux-saga/effects';
import fetchAPIResult from '~/utils/sagaUtils';
import {
  getBankCardListResult,
  // deleteBankCardResult,
} from '~/apis/api';
import { compactObject } from '~/utils/utils';

export function* getUserAccountListSaga({ payload }) {
  return yield fetchAPIResult({
    action: types.GET_USER_ACCOUNT_LIST,
    apiResult: getBankCardListResult,
    payload: compactObject(payload),
    resultHandler: data => {
      // API 可能返回多種格式，需要兼容處理
      // 格式1: { items: [...], pagination: { totalCount: ... } }
      // 格式2: { rows: [...], count: ... }
      // 格式3: { data: [...], count: ... }
      const rows = data?.items || data?.rows || data?.data || [];
      const count = data?.pagination?.totalCount || data?.count || rows.length;
      const pageSize = payload?.size || 10;
      const pages = Math.ceil(count / pageSize) || 1;

      return {
        data: rows,
        count,
        pages,
      };
    },
  });
}

export function* deleteUserAccountSaga({ payload }) {
  yield put({
    type: types.DELETE_USER_ACCOUNT_SUCCESS,
    payload,
  });
  // return yield fetchAPIResult({
  //   apiResult: deleteBankCardResult,
  //   payload,
  //   action: types.DELETE_USER_ACCOUNT,
  //   message: '已刪除帳戶',
  // });
}
