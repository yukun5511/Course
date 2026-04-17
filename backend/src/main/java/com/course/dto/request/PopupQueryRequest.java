package com.course.dto.request;

import lombok.Data;

/**
 * 弹窗查询请求
 */
@Data
public class PopupQueryRequest {
    private String title;
    private Integer published;
    private Integer page = 1;
    private Integer size = 10;
}
