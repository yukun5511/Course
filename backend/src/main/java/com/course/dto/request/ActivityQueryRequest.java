package com.course.dto.request;

import lombok.Data;

/**
 * 活动查询请求
 */
@Data
public class ActivityQueryRequest {
    private String title;
    private Integer onCarousel;
    private Integer page = 1;
    private Integer size = 10;
}
