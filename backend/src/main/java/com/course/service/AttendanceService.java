package com.course.service;

import com.course.common.PageResult;
import com.course.dto.request.CreateCheckinRequest;
import com.course.dto.request.DoCheckinRequest;
import com.course.dto.request.LeaveRequest;
import com.course.dto.request.ApproveLeaveRequest;
import com.course.dto.response.CheckinResponse;
import com.course.dto.response.LeaveRecordResponse;

public interface AttendanceService {
    
    // 打卡任务管理
    CheckinResponse createCheckin(CreateCheckinRequest request);
    
    CheckinResponse updateCheckin(Long id, CreateCheckinRequest request);
    
    void deleteCheckin(Long id);
    
    CheckinResponse getCheckinById(Long id);
    
    PageResult<CheckinResponse> getCheckinList(int page, int size, Long courseId, String status);
    
    // 打卡操作
    void doCheckin(Long checkinId, Long userId, DoCheckinRequest request);
    
    // 请假管理
    LeaveRecordResponse applyLeave(Long userId, LeaveRequest request);
    
    PageResult<LeaveRecordResponse> getLeaveRecords(int page, int size, Long userId, String status);
    
    void approveLeave(Long leaveId, Long approverId, ApproveLeaveRequest request);
}
