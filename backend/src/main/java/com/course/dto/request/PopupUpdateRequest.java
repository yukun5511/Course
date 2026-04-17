package com.course.dto.request;

import lombok.Data;

/**
 * 弹窗更新请求
 */
@Data
public class PopupUpdateRequest {
    private String title;
    private String content;
    private String image;
}
