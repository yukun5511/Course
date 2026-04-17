package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 兑换记录响应DTO
 */
@Data
public class ExchangeRecordDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String studentId;
    private Long itemId;
    private String itemName;
    private Integer badgeCost;
    private LocalDateTime exchangedAt;
}
