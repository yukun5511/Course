package com.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 弹窗创建请求
 */
@Data
public class PopupCreateRequest {
    @NotBlank(message = "标题不能为空")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    private String content;
    
    private String image;
}
