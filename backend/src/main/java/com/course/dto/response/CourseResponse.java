package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 课程响应DTO
 */
@Data
public class CourseResponse {
    
    private Long id;
    
    private Long classId;
    
    private String className;
    
    private String name;
    
    private String description;
    
    private String teacherId;
    
    private String teacherName;
    
    private String coverImage;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private String location;
    
    private Integer totalHours;
    
    private String status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
