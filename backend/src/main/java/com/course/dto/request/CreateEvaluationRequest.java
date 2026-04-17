package com.course.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 创建评价请求
 */
@Data
public class CreateEvaluationRequest {
    
    @NotNull(message = "课程ID不能为空")
    private Long courseId;
    
    private String courseName;
    
    private List<Map<String, Object>> questions;
}
