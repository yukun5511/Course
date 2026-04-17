package com.course.dto.request;

import lombok.Data;

/**
 * 更新班级请求
 */
@Data
public class UpdateClassRequest {
    
    private String name;
    
    private String description;
    
    private String teacherId;
    
    private String teacherName;
    
    private String academicDirectorId;
    
    private String academicDirectorName;
    
    private String coverImage;
    
    private String status;
}
