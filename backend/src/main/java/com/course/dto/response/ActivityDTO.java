package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 活动响应DTO
 */
@Data
public class ActivityDTO {
    private Long id;
    private String title;
    private String content;
    private String image;
    private Integer onCarousel;
    private Long createdBy;
    private String creatorName;
    private Integer registrationCount;
    private LocalDateTime createdAt;
}
