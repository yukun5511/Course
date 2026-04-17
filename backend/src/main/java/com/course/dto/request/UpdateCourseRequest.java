package com.course.dto.request;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 更新课程请求
 */
@Data
public class UpdateCourseRequest {
    
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
}
