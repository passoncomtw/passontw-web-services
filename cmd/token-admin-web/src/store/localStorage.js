const { localStorage } = window;
const LOGIN_USER_KEY = '$_LOGIN_USER_KEY';

export const getLoginUser = () => {
  const user = localStorage.getItem(LOGIN_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const saveLoginUser = user =>
  localStorage.setItem(LOGIN_USER_KEY, JSON.stringify(user));

export const removeLoginUser = () => localStorage.removeItem(LOGIN_USER_KEY);
