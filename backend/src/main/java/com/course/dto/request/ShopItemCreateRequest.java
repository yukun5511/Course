package com.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 商品创建请求
 */
@Data
public class ShopItemCreateRequest {
    @NotBlank(message = "商品名称不能为空")
    private String name;
    
    @NotBlank(message = "商品类型不能为空")
    private String type;
    
    private String image;
    
    @NotNull(message = "所需徽章数量不能为空")
    private Integer badgeCost;
    
    @NotNull(message = "库存不能为空")
    private Integer stock;
    
    private String description;
    private Long courseId;
}
