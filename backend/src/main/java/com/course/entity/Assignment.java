package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 作业实体类
 */
@Data
@TableName("assignments")
public class Assignment {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long courseId;
    
    private String courseName;
    
    private String title;
    
    private String content;
    
    private LocalDateTime deadline;
    
    private Long createdBy;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
