package com.course.dto.request;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * 请假申请请求
 */
@Data
public class LeaveRequest {
    
    @NotBlank(message = "请假原因不能为空")
    private String reason;
    
    @NotNull(message = "开始时间不能为空")
    private LocalDateTime startTime;
    
    @NotNull(message = "结束时间不能为空")
    private LocalDateTime endTime;
    
    private String attachmentUrl;
}
