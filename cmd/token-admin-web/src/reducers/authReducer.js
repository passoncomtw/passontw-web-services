import { authState } from './initialState';
import types from '../constants/actionTypes';
import { fromJS } from 'immutable';
import { saveLoginUser, removeLoginUser } from '~/store/localStorage';
import deepClone from 'lodash/cloneDeep';

export const loginSuccess = (auth, payload) => {
  // API 返回的是 access_token 而不是 token
  const { access_token, user } = payload;
  const userData = {
    token: access_token, // 將 access_token 存為 token
    info: {
      userName: user.name,
      userId: user.id,
      account: user.account,
      type: user.type,
    },
    permissions: user.permissions || [], // API 可能不返回 permissions，設定預設值
  };
  saveLoginUser(userData);
  return auth.merge(
    fromJS({
      isAuth: true,
      ...userData,
    })
  );
};

const loginError = auth => auth.merge({ isAuth: false });

const logoutSuccess = auth =>
  auth.merge(fromJS({ isAuth: false, info: {}, token: '' }));

const initialWebAppSuccess = auth => auth.update('isInitial', () => true);

export default function reducer(auth = deepClone(authState), { type, payload }) {
  switch (type) {
    case types.INITIAL_WEB_APP_SUCCESS:
      return initialWebAppSuccess(auth);
    case types.LOGOUT_SUCCESS:
      removeLoginUser();
      return logoutSuccess(auth);
    case types.LOGIN_SUCCESS:
      return loginSuccess(auth, payload);
    case types.LOGIN_ERROR:
      return loginError(auth, payload);
    case types.LOGOUT:
    case types.LOGOUT_ERROR:
    case types.LOGIN:
    case types.INITIAL_WEB_APP_ERROR: //應該要導到維護頁面
    case types.INITIAL_WEB_APP:
    default:
      return auth;
  }
}
