package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 请假记录响应DTO
 */
@Data
public class LeaveRecordResponse {
    
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
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
