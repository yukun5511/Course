package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 班级响应DTO
 */
@Data
public class ClassResponse {
    
    private Long id;
    
    private String name;
    
    private String director;
    
    private Long directorId;
    
    private String monitor;
    
    private Long monitorId;
    
    private Integer period;
    
    private String status;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    // 兼容旧字段
    public String getTeacherName() {
        return director;
    }
    
    public void setTeacherName(String name) {
        this.director = name;
    }
    
    public String getTeacherId() {
        return directorId != null ? String.valueOf(directorId) : null;
    }
    
    public void setTeacherId(String id) {
        this.directorId = id != null ? Long.valueOf(id) : null;
    }
    
    public String getAcademicDirectorName() {
        return monitor;
    }
    
    public void setAcademicDirectorName(String name) {
        this.monitor = name;
    }
    
    public String getAcademicDirectorId() {
        return monitorId != null ? String.valueOf(monitorId) : null;
    }
    
    public void setAcademicDirectorId(String id) {
        this.monitorId = id != null ? Long.valueOf(id) : null;
    }
}
