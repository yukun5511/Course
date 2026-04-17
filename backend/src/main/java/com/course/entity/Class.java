package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * 班级实体类
 */
@Data
@TableName(value = "classes", autoResultMap = true)
public class Class {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private String name;
    
    private String director;
    
    private Long directorId;
    
    private String monitor;
    
    private Long monitorId;
    
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Map<String, Object> committee;
    
    private String status;
    
    private Integer period;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
