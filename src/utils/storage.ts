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

// Token 相关 - 直接操作 localStorage，不进行 JSON 序列化
export const setToken = (token: string): void => {
  try {
    localStorage.setItem(`${PREFIX}token`, token);
  } catch (error) {
    console.error('Token set error:', error);
  }
};

export const getToken = (): string | undefined => {
  try {
    return localStorage.getItem(`${PREFIX}token`) || undefined;
  } catch (error) {
    console.error('Token get error:', error);
    return undefined;
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(`${PREFIX}token`);
  } catch (error) {
    console.error('Token remove error:', error);
  }
};

// 用户信息相关
export const setUserInfo = <T>(user: T): void => setStorage('user', user);
export const getUserInfo = <T>(): T | undefined => getStorage<T>('user');
export const removeUserInfo = (): void => removeStorage('user');
