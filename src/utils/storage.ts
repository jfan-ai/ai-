/**
 * 本地存储工具函数
 */

const PREFIX = 'yuexiaoshi_';

/**
 * 设置本地存储
 */
export const setStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(value));
  } catch (error) {
    console.error('Storage set error:', error);
  }
};

/**
 * 获取本地存储
 */
export const getStorage = <T>(key: string, defaultValue?: T): T | undefined => {
  try {
    const item = localStorage.getItem(`${PREFIX}${key}`);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Storage get error:', error);
    return defaultValue;
  }
};

/**
 * 移除本地存储
 */
export const removeStorage = (key: string): void => {
  try {
    localStorage.removeItem(`${PREFIX}${key}`);
  } catch (error) {
    console.error('Storage remove error:', error);
  }
};

/**
 * 清空本地存储（仅清除本应用的数据）
 */
export const clearStorage = (): void => {
  try {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch (error) {
    console.error('Storage clear error:', error);
  }
};

// Token 相关
export const setToken = (token: string): void => setStorage('token', token);
export const getToken = (): string | undefined => getStorage<string>('token');
export const removeToken = (): void => removeStorage('token');

// 用户信息相关
export const setUserInfo = <T>(user: T): void => setStorage('user', user);
export const getUserInfo = <T>(): T | undefined => getStorage<T>('user');
export const removeUserInfo = (): void => removeStorage('user');
