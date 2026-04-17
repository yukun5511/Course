package com.course.dto.request;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

/**
 * 审批请假请求
 */
@Data
public class ApproveLeaveRequest {
    
    @NotBlank(message = "审批状态不能为空")
    private String status;
    
    private String rejectReason;
}
