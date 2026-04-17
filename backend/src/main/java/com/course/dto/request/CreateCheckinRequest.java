package com.course.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 创建打卡任务请求
 */
@Data
public class CreateCheckinRequest {
    
    @NotNull(message = "课程ID不能为空")
    private Long courseId;
    
    private String courseName;
    
    @NotBlank(message = "打卡标题不能为空")
    private String title;
    
    private String description;
    
    private String location;
    
    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;
    
    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;
    
    @NotBlank(message = "状态不能为空")
    private String status;
}
