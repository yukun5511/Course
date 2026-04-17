import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL, TOKEN_KEYS, ApiResponse } from './config';

// 创建 axios 实例
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem(TOKEN_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // 如果没有 token，且不是登录/刷新接口，则拒绝请求
      const isAuthEndpoint = config.url?.includes('/auth/login') || 
                             config.url?.includes('/auth/admin-login') ||
                             config.url?.includes('/auth/wechat-login') || 
                             config.url?.includes('/auth/refresh');
      if (!isAuthEndpoint) {
        console.warn('未登录，请先登录');
        return Promise.reject(new Error('未提供认证令牌'));
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const { data } = response;
    
    // 如果返回的状态码是 200，说明接口请求成功
    if (data.code === 200) {
      return response;
    }
    
    // 处理业务错误
    return Promise.reject(new Error(data.message || '请求失败'));
  },
  async (error) => {
    const originalRequest = error.config;

    // 如果是请求拦截器拒绝的（没有token），直接跳转登录页
    if (error.message === '未提供认证令牌') {
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/login')) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
      }
      return Promise.reject(error);
    }

    // 处理 401 未授权错误
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // 尝试刷新 token
        const refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, null, {
            params: { refreshToken },
          });

          const { data } = response.data;
          if (data.code === 200) {
            // 保存新的 access token
            localStorage.setItem(TOKEN_KEYS.ACCESS_TOKEN, data.data);
            
            // 重试原请求
            originalRequest.headers.Authorization = `Bearer ${data.data}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // 刷新失败，清除 token 并跳转登录页
        localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(TOKEN_KEYS.USER_INFO);
        localStorage.removeItem('admin_auth');
        const currentPath = window.location.pathname;
        window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // 如果没有 refresh token 或者不是 401 错误，也跳转到登录页
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem(TOKEN_KEYS.ACCESS_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.REFRESH_TOKEN);
      localStorage.removeItem(TOKEN_KEYS.USER_INFO);
      localStorage.removeItem('admin_auth');
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/login')) {
        window.location.href = `/admin/login?redirect=${encodeURIComponent(currentPath)}`;
      }
    }

    // 处理其他错误
    const message = error.response?.data?.message || error.message || '网络错误';
    return Promise.reject(new Error(message));
  }
);

// 封装请求方法
export const request = {
  get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.get<ApiResponse<T>>(url, config).then(res => res.data);
  },

  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.post<ApiResponse<T>>(url, data, config).then(res => res.data);
  },

  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.put<ApiResponse<T>>(url, data, config).then(res => res.data);
  },

  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.patch<ApiResponse<T>>(url, data, config).then(res => res.data);
  },

  delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return apiClient.delete<ApiResponse<T>>(url, config).then(res => res.data);
  },
};

export default apiClient;
