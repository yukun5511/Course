package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 商品响应DTO
 */
@Data
public class ShopItemDTO {
    private Long id;
    private String name;
    private String type;
    private String image;
    private Integer badgeCost;
    private Integer stock;
    private Integer available;
    private String description;
    private Long courseId;
    private String courseName;
    private LocalDateTime createdAt;
}
