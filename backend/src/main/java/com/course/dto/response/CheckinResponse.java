package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 打卡任务响应DTO
 */
@Data
public class CheckinResponse {
    
    private Long id;
    
    private Long courseId;
    
    private String courseName;
    
    private String title;
    
    private String description;
    
    private String location;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private String status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
