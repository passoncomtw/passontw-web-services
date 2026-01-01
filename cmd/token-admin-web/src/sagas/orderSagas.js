import types from '~/constants/actionTypes';
import { put } from 'redux-saga/effects';
import fetchAPIResult from '~/utils/sagaUtils';
import {
  // cancelOrderResult,
  // completeOrderResult,
  getOrderListResult,
} from '~/apis/api';
import { pureList } from '~/constants/mock/userOrder';
import { compactObject } from '~/utils/utils';

export function* cancelOrderSaga({ payload }) {
  yield put({
    type: types.CANCEL_ORDER_SUCCESS,
    payload,
  });
  // return yield fetchAPIResult({
  //   apiResult: cancelOrderResult,
  //   payload,
  //   action: types.CANCEL_ORDER,
  //   message: '订单已取消',
  // });
}

export function* completeOrderSaga({ payload }) {
  yield put({
    type: types.COMPLETE_ORDER_SUCCESS,
    payload,
  });
  // return yield fetchAPIResult({
  //   apiResult: completeOrderResult,
  //   payload,
  //   action: types.COMPLETE_ORDER,
  // });
}

export function* getOrderListSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: getOrderListResult,
    payload: compactObject(payload),
    action: types.GET_ORDER_LIST,
    resultHandler: resp => {
      // API 回傳格式: { items: [...], code: '200', pagination: { totalCount: 2, page: 1, size: 10 } }
      // parseAxiosResponse 返回 response.data，所以 resp 是整個響應對象
      const rows = resp?.items || [];
      const totalCount = resp?.pagination?.totalCount || 0;
      const pageSize = payload?.size || resp?.pagination?.size || 10;
      const totalPageCount = Math.ceil(totalCount / pageSize) || 1;

      return {
        data: rows,
        totalCount,
        totalPageCount,
      };
    },
  });
}
