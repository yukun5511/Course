package com.course.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 创建课程请求
 */
@Data
public class CreateCourseRequest {
    
    @NotNull(message = "班级ID不能为空")
    private Long classId;
    
    private String className;
    
    @NotBlank(message = "课程名称不能为空")
    private String name;
    
    private String description;
    
    private String teacherId;
    
    private String teacherName;
    
    private String coverImage;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private String location;
    
    private Integer totalHours;
    
    @NotBlank(message = "课程状态不能为空")
    private String status;
}
