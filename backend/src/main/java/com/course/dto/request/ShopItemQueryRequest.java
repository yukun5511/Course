package com.course.dto.request;

import lombok.Data;

/**
 * 商品查询请求
 */
@Data
public class ShopItemQueryRequest {
    private String name;
    private String type;
    private Integer available;
    private Integer page = 1;
    private Integer size = 10;
}
