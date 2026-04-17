package com.course.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 创建作业请求
 */
@Data
public class CreateAssignmentRequest {
    
    @NotNull(message = "课程ID不能为空")
    private Long courseId;
    
    private String courseName;
    
    @NotBlank(message = "作业标题不能为空")
    private String title;
    
    private String description;
    
    private String attachmentUrl;
    
    @NotNull(message = "截止时间不能为空")
    private LocalDateTime deadline;
    
    private Integer totalScore;
    
    @NotBlank(message = "状态不能为空")
    private String status;
}
