package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 课程实体类
 */
@Data
@TableName("courses")
public class Course {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private Integer period;
    
    private LocalDate startDate;
    
    private LocalDate endDate;
    
    private String location;
    
    private String instructor;
    
    private Long instructorId;
    
    private Integer credits;
    
    private String status;
    
    private String description;
    
    private String image;
    
    private Long classId;
    
    private String representative;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
