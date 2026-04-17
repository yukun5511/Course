package com.course.dto.request;

import lombok.Data;

/**
 * 打卡请求
 */
@Data
public class DoCheckinRequest {
    
    private String location;
    
    private String imageUrl;
    
    private String remark;
}
