package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 打卡任务实体类
 */
@Data
@TableName("checkins")
public class Checkin {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long courseId;
    
    private String courseName;
    
    private String title;
    
    private String description;
    
    private String location;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private String status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
    
    @TableLogic
    private Integer deleted;
}
