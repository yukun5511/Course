package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 评价回答实体类
 */
@Data
@TableName("evaluation_responses")
public class EvaluationResponse {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long evaluationId;
    
    private Long userId;
    
    private String userName;
    
    private String answers;
    
    private LocalDateTime submitTime;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
