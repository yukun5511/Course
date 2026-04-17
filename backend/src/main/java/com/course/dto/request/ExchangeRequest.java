package com.course.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 兑换请求
 */
@Data
public class ExchangeRequest {
    @NotNull(message = "商品ID不能为空")
    private Long itemId;
    
    @NotNull(message = "用户ID不能为空")
    private Long userId;
}
