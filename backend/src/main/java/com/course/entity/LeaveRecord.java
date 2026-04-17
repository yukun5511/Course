package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 请假记录实体类
 */
@Data
@TableName("leave_records")
public class LeaveRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long userId;
    
    private String userName;
    
    private String reason;
    
    private LocalDateTime startTime;
    
    private LocalDateTime endTime;
    
    private String attachmentUrl;
    
    private String status;
    
    private String approverId;
    
    private String approverName;
    
    private String rejectReason;
    
    private LocalDateTime approveTime;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
    
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;
}
