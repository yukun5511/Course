package com.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 活动创建请求
 */
@Data
public class ActivityCreateRequest {
    @NotBlank(message = "活动标题不能为空")
    private String title;
    
    private String content;
    private String image;
    private Integer onCarousel;
}
