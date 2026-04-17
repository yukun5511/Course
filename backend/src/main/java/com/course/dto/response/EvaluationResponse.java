package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 评价响应DTO
 */
@Data
public class EvaluationResponse {
    
    private Long id;
    
    private Long courseId;
    
    private String courseName;
    
    private List<Map<String, Object>> questions;
    
    private LocalDateTime createdAt;
}
