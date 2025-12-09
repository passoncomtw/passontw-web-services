import types from '~/constants/actionTypes';
import fetchAPIResult from '~/utils/sagaUtils';
import {
  cancelPendingOrderResult,
  deletePendingOrderResult,
  openPendingOrderResult,
  stopPendingOrderResult,
  getPendingOrderListResult,
} from '~/apis/api';
import { compactObject } from '~/utils/utils';

export function* cancelPendingOrderSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: cancelPendingOrderResult,
    payload,
    action: types.CANCEL_PENDING_ORDER,
    message: '已取消掛單',
    resultHandler: () => payload,
  });
}

export function* deletePendingOrderSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: deletePendingOrderResult,
    payload,
    action: types.DELETE_PENDING_ORDER,
    message: '已刪除掛單',
    resultHandler: () => payload,
  });
}

export function* openPendingOrderSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: openPendingOrderResult,
    payload,
    action: types.OPEN_PENDING_ORDER,
    message: '已開啓掛單',
    resultHandler: () => payload,
  });
}
export function* stopPendingOrderSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: stopPendingOrderResult,
    payload,
    action: types.STOP_PENDING_ORDER,
    message: '已暫停掛單',
    resultHandler: () => payload,
  });
}

export function* getPendingOrderListSaga({ payload }) {
  return yield fetchAPIResult({
    apiResult: getPendingOrderListResult,
    payload: compactObject(payload),
    action: types.GET_PENDING_ORDER_LIST,
    resultHandler: data => {
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
