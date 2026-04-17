package com.course.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 积分商城商品实体类
 */
@Data
@TableName("shop_items")
public class ShopItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String type;
    private String image;
    private Integer badgeCost;
    private Integer stock;
    private Integer available;
    private String description;
    private Long courseId;
    private LocalDateTime createdAt;
}
