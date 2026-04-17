import { request } from './client';
import { TOKEN_KEYS } from './config';

// 登录请求参数
export interface LoginRequest {
  studentId: string;
  password: string;
}

// 用户信息
export interface UserInfo {
  id: number;
  studentId: string;
  name: string;
  avatar: string;
  company: string;
  position: string;
  tags: string;
  role: string;
  phone: string;
  email: string;
  badges: number;
  points: number;
  currentPeriod: number;
  classId: number;
  status: string;
}

// 登录响应
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: UserInfo;
}

/**
 * 学员/学术主任登录
 */
export const login = async (data: LoginRequest) => {
  const response = await request.post<LoginResponse>('/auth/login', data);
  
  // 保存 token 和用户信息
  if (response.data) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER_INFO, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * 管理员登录
 */
export const adminLogin = async (data: LoginRequest) => {
  const response = await request.post<LoginResponse>('/auth/admin-login', data);
  
  // 保存 token 和用户信息
  if (response.data) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER_INFO, JSON.stringify(response.data.user));
    // 设置管理员认证标志
    localStorage.setItem('admin_auth', 'true');
  }
  
  return response.data;
};

/**
 * 微信登录
 */
export const wechatLogin = async (code: string) => {
  const response = await request.post<LoginResponse>('/auth/wechat-login', null, {
    params: { code },
  });
  
  // 保存 token 和用户信息
  if (response.data) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data.accessToken);
    localStorage.setItem(TOKEN_KEYS.REFRESH_TOKEN, response.data.refreshToken);
    localStorage.setItem(TOKEN_KEYS.USER_INFO, JSON.stringify(response.data.user));
  }
  
  return response.data;
};

/**
 * 刷新 Token
 */
export const refreshToken = async (refreshToken: string) => {
  const response = await request.post<string>('/auth/refresh', null, {
    params: { refreshToken },
  });
  
  // 保存新的 access token
  if (response.data) {
    localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, response.data);
  }
  
  return response.data;
};

/**
 * 退出登录
 */
export const logout = async () => {
  try {
    await request.post('/auth/logout');
  } finally {
    // 清除本地存储
    localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(TOKEN_KEYS.USER_INFO);
    localStorage.removeItem('admin_auth');
  }
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = (): UserInfo | null => {
  const userInfo = localStorage.getItem(TOKEN_KEYS.USER_INFO);
  if (userInfo) {
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
};
