/**
 * 表单验证工具函数
 */

/**
 * 验证邮箱格式
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证手机号格式（中国大陆）
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^1[3-9]\d{9}$/;
  return phoneRegex.test(phone);
};

/**
 * 验证密码强度
 * 至少6位，包含字母和数字
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * 验证是否为空
 */
export const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value.trim() === '';
};

/**
 * 验证长度范围
 */
export const isLengthValid = (
  value: string,
  min: number,
  max: number
): boolean => {
  const length = value.length;
  return length >= min && length <= max;
};

/**
 * 验证是否为数字
 */
export const isNumeric = (value: string): boolean => {
  return !isNaN(Number(value)) && !isEmpty(value);
};

/**
 * 验证是否为整数
 */
export const isInteger = (value: string): boolean => {
  return /^-?\d+$/.test(value);
};

/**
 * 验证是否为正整数
 */
export const isPositiveInteger = (value: string): boolean => {
  return /^\d+$/.test(value) && parseInt(value) > 0;
};

/**
 * 验证 URL 格式
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// 表单验证错误信息
export const validationMessages = {
  email: {
    required: '请输入邮箱地址',
    invalid: '请输入有效的邮箱地址',
  },
  password: {
    required: '请输入密码',
    tooShort: '密码长度至少为6位',
    weak: '密码强度不足，请包含字母和数字',
  },
  phone: {
    invalid: '请输入有效的手机号码',
  },
  required: (field: string) => `${field}不能为空`,
  length: (field: string, min: number, max: number) =>
    `${field}长度应在${min}到${max}个字符之间`,
};
