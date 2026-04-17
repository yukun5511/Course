package com.course.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 更新作业请求
 */
@Data
public class UpdateAssignmentRequest {
    
    private String title;
    
    private String description;
    
    private LocalDateTime deadline;
}
