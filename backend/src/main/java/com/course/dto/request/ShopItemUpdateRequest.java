package com.course.dto.request;

import lombok.Data;

/**
 * 商品更新请求
 */
@Data
public class ShopItemUpdateRequest {
    private String name;
    private String type;
    private String image;
    private Integer badgeCost;
    private Integer stock;
    private String description;
    private Long courseId;
}
