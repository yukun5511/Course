package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 作业提交实体类
 */
@Data
@TableName("assignment_submissions")
public class AssignmentSubmission {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long assignmentId;
    
    private Long userId;
    
    private String userName;
    
    private String content;
    
    private String attachmentUrl;
    
    private LocalDateTime submitTime;
    
    private Integer score;
    
    private String feedback;
    
    private String status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
