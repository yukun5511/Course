package com.course.dto.request;

import lombok.Data;

/**
 * 提交作业请求
 */
@Data
public class SubmitAssignmentRequest {
    
    private String content;
    
    private String attachmentUrl;
}
