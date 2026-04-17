package com.course.dto.request;

import lombok.Data;

/**
 * 活动更新请求
 */
@Data
public class ActivityUpdateRequest {
    private String title;
    private String content;
    private String image;
    private Integer onCarousel;
}
