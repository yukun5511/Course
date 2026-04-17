package com.course.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * 创建班级请求
 */
@Data
public class CreateClassRequest {
    
    @NotBlank(message = "班级名称不能为空")
    private String name;
    
    private String description;
    
    private String teacherId;
    
    private String teacherName;
    
    private String academicDirectorId;
    
    private String academicDirectorName;
    
    private String coverImage;
    
    @NotBlank(message = "班级状态不能为空")
    private String status;
}
