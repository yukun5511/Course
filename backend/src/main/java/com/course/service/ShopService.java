package com.course.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.dto.request.ExchangeRequest;
import com.course.dto.request.ShopItemCreateRequest;
import com.course.dto.request.ShopItemQueryRequest;
import com.course.dto.request.ShopItemUpdateRequest;
import com.course.dto.response.ExchangeRecordDTO;
import com.course.dto.response.ShopItemDTO;

/**
 * 积分商城服务接口
 */
public interface ShopService {
    
    /**
     * 获取商品列表
     */
    Page<ShopItemDTO> getItemList(ShopItemQueryRequest query);
    
    /**
     * 获取商品详情
     */
    ShopItemDTO getItemById(Long id);
    
    /**
     * 创建商品
     */
    ShopItemDTO createItem(ShopItemCreateRequest request);
    
    /**
     * 更新商品
     */
    ShopItemDTO updateItem(Long id, ShopItemUpdateRequest request);
    
    /**
     * 删除商品
     */
    void deleteItem(Long id);
    
    /**
     * 上架/下架商品
     */
    void updateAvailable(Long id, Integer available);
    
    /**
     * 兑换商品
     */
    void exchangeItem(ExchangeRequest request);
    
    /**
     * 获取兑换记录
     */
    Page<ExchangeRecordDTO> getExchangeRecords(Integer page, Integer size, Long userId);
}
