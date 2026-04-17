import { request } from './client';
import { PageResponse } from './config';

// 商品信息
export interface ShopItemInfo {
  id: number;
  name: string;
  type: string;
  image?: string;
  badgeCost: number;
  stock: number;
  available: number;
  description?: string;
  courseId?: number;
  courseName?: string;
  createdAt: string;
}

// 兑换记录
export interface ExchangeRecord {
  id: number;
  userId: number;
  userName?: string;
  studentId?: string;
  itemId: number;
  itemName: string;
  badgeCost: number;
  exchangedAt: string;
}

// 创建商品请求
export interface CreateShopItemRequest {
  name: string;
  type: string;
  image?: string;
  badgeCost: number;
  stock: number;
  description?: string;
  courseId?: number;
}

// 更新商品请求
export interface UpdateShopItemRequest {
  name?: string;
  type?: string;
  image?: string;
  badgeCost?: number;
  stock?: number;
  description?: string;
  courseId?: number;
}

// 兑换请求
export interface ExchangeRequest {
  itemId: number;
  userId: number;
}

/**
 * 获取商品列表（分页）
 */
export const getShopItemList = (params: {
  page?: number;
  size?: number;
  name?: string;
  type?: string;
  available?: number;
}) => {
  return request.get<PageResponse<ShopItemInfo>>('/shop/items', { params });
};

/**
 * 获取商品详情
 */
export const getShopItemById = (id: number) => {
  return request.get<ShopItemInfo>(`/shop/items/${id}`);
};

/**
 * 创建商品
 */
export const createShopItem = (data: CreateShopItemRequest) => {
  return request.post<ShopItemInfo>('/shop/items', data);
};

/**
 * 更新商品
 */
export const updateShopItem = (id: number, data: UpdateShopItemRequest) => {
  return request.put<ShopItemInfo>(`/shop/items/${id}`, data);
};

/**
 * 删除商品
 */
export const deleteShopItem = (id: number) => {
  return request.delete<void>(`/shop/items/${id}`);
};

/**
 * 上架/下架商品
 */
export const updateShopItemAvailable = (id: number, available: number) => {
  return request.patch<void>(`/shop/items/${id}/available`, { available });
};

/**
 * 兑换商品
 */
export const exchangeItem = (data: ExchangeRequest) => {
  return request.post<void>('/shop/exchange', data);
};

/**
 * 获取兑换记录
 */
export const getExchangeRecords = (params: {
  page?: number;
  size?: number;
  userId?: number;
}) => {
  return request.get<PageResponse<ExchangeRecord>>('/shop/exchanges', { params });
};
