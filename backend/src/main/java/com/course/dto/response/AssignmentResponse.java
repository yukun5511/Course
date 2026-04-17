package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 作业响应DTO
 */
@Data
public class AssignmentResponse {
    
    private Long id;
    
    private Long courseId;
    
    private String courseName;
    
    private String title;
    
    private String description;
    
    private String attachmentUrl;
    
    private LocalDateTime deadline;
    
    private Integer totalScore;
    
    private String status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
