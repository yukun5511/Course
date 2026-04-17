package com.course.dto.request;

import lombok.Data;

/**
 * 批改作业请求
 */
@Data
public class GradeAssignmentRequest {
    
    private Integer score;
    
    private String feedback;
}
