package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 评价模板实体类
 */
@Data
@TableName(value = "evaluations", autoResultMap = true)
public class Evaluation {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long courseId;
    
    private String courseName;
    
    @TableField(typeHandler = JacksonTypeHandler.class)
    private List<Map<String, Object>> questions;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
