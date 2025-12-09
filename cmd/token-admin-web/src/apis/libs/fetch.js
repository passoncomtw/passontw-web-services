import axios from 'axios';
import QS from 'query-string';
import isUndefined from 'lodash/isUndefined';
import { localDomain } from './route';

const UNEXPECT_ERROR_MSG = '服务异常，请重新再试或与客服联系';
const SERVER_ERROR_MSG = '服务异常，请稍后再试或与客服联系';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const getErrorFormat = (code, message) => ({
  code,
  data: { message },
});

const getResponseCode = (responseOK, statusCode, bodyResult) => {
  if (responseOK && statusCode >= 200 && statusCode < 300) {
    return bodyResult.code;
  }
  return '101';
};

const validateCode = code => {
  if (isUndefined(code)) return true;
  if (code === 100) return true;
  return false;
};

const parseInternetError = error => {
  // Unexpect error，不會過 parseResponse;
  if (error.message === 'Failed to fetch' || error.code === 'ERR_NETWORK') {
    throw getErrorFormat(500, UNEXPECT_ERROR_MSG);
  }
  throw error;
};

const parseAxiosError = error => {
  if (error.response) {
    // 服務器返回了錯誤響應
    const { status, data } = error.response;
    if ([500, 404].includes(status)) {
      throw getErrorFormat(status, SERVER_ERROR_MSG);
    }
    // 返回標準格式的錯誤
    throw getErrorFormat(status, data?.message || SERVER_ERROR_MSG);
  } else if (error.request) {
    // 請求已發送但沒有收到響應
    throw getErrorFormat(500, UNEXPECT_ERROR_MSG);
  } else {
    // 請求設置時發生錯誤
    throw getErrorFormat(500, UNEXPECT_ERROR_MSG);
  }
};

const parseAxiosResponse = response => {
  const { status: statusCode } = response;
  // 先把 500, 404 拉到更上層就丟出，避免不需要的 parse 造成錯誤
  if ([500, 404].includes(statusCode)) {
    throw getErrorFormat(statusCode, SERVER_ERROR_MSG);
  }
  return response.data;
};

export const fetchGet = (url, customHeaders={}) => {
  return axios
    .get(localDomain(url), {
      headers: {
        ...defaultHeaders,
        ...customHeaders,
      },
    })
    .then(parseAxiosResponse)
    .catch(parseAxiosError);
};

export const fetchGetWithToken = (url, customHeaders = {}, payload = {}) => {
  const realUrl =
    Object.keys(payload).length === 0 ? url : `${url}?${QS.stringify(payload)}`;

  const headers = {
    ...defaultHeaders,
    ...customHeaders,
  };

  return axios({
    method: 'get',
    url: localDomain(realUrl),
    headers,
  })
    .then(parseAxiosResponse)
    .catch(parseAxiosError);
};

export const fetchPost = (url, payload) => {
  return axios
    .post(localDomain(url), payload, {
      headers: defaultHeaders,
    })
    .then(parseAxiosResponse)
    .catch(parseAxiosError);
};

export const fetchPostWithToken = (
  url,
  customHeaders,
  payload = {},
  method = 'POST'
) => {
  const headers = {
    ...defaultHeaders,
    ...customHeaders,
  };

  return axios({
    url: localDomain(url),
    method,
    headers,
    data: payload,
  })
    .then(parseAxiosResponse)
    .catch(parseAxiosError);
};

export const fetchPostFormDataWithToken = (
  url,
  customHeaders,
  payload = {},
  method = 'POST'
) => {
  const formData = new FormData();
  formData.append('file', payload);

  return axios({
    url: localDomain(url),
    method,
    headers: {
      ...customHeaders,
    },
    data: formData,
  })
    .then(parseAxiosResponse)
    .catch(parseAxiosError);
};

export const fetchPostWithTokenAndQS = (
  url,
  customHeaders,
  payload = {},
  qs = {},
  method = 'POST'
) => {
  const realUrl =
    Object.keys(qs).length === 0 ? url : `${url}?${QS.stringify(qs)}`;

  const headers = {
    ...defaultHeaders,
    ...customHeaders,
  };

  return axios({
    url: localDomain(realUrl),
    method,
    headers,
    data: payload,
  })
    .then(parseAxiosResponse)
    .catch(parseAxiosError);
};
