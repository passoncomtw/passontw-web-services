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
    resultHandler: data => {
      // API 回傳格式: { success: true, data: [...], code: 'SUCCESS' }
      // sagaUtils 會把 resp.data 傳進來，因此這裡的 data 可能是陣列或物件
      const rows = Array.isArray(data) ? data : data?.data || [];
      const totalCount =
        (typeof data === 'object' && data?.count != null && Number.isFinite(data.count))
          ? data.count
          : rows.length;
      const pageSize = payload?.size || 10;
      const totalPageCount =
        (typeof data === 'object' && data?.totalPageCount != null && Number.isFinite(data.totalPageCount))
          ? data.totalPageCount
          : Math.ceil(totalCount / pageSize);

      return {
        data: rows,
        totalCount,
        totalPageCount,
      };
    },
  });
}
