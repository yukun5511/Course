package com.course.controller;

import com.course.common.PageResult;
import com.course.common.Result;
import com.course.dto.request.*;
import com.course.dto.response.CheckinResponse;
import com.course.dto.response.LeaveRecordResponse;
import com.course.interceptor.RequireRole;
import com.course.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    
    // ========== 打卡任务管理 ==========
    
    @PostMapping("/checkins")
    @RequireRole("admin")
    public Result<CheckinResponse> createCheckin(@Validated @RequestBody CreateCheckinRequest request) {
        return Result.success(attendanceService.createCheckin(request));
    }
    
    @PutMapping("/checkins/{id}")
    @RequireRole("admin")
    public Result<CheckinResponse> updateCheckin(@PathVariable Long id, 
                                                  @Validated @RequestBody CreateCheckinRequest request) {
        return Result.success(attendanceService.updateCheckin(id, request));
    }
    
    @DeleteMapping("/checkins/{id}")
    @RequireRole("admin")
    public Result<Void> deleteCheckin(@PathVariable Long id) {
        attendanceService.deleteCheckin(id);
        return Result.success();
    }
    
    @GetMapping("/checkins/{id}")
    public Result<CheckinResponse> getCheckinById(@PathVariable Long id) {
        return Result.success(attendanceService.getCheckinById(id));
    }
    
    @GetMapping("/checkins")
    public Result<PageResult<CheckinResponse>> getCheckinList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String status) {
        return Result.success(attendanceService.getCheckinList(page, size, courseId, status));
    }
    
    // ========== 打卡操作 ==========
    
    @PostMapping("/checkins/{id}/do")
    public Result<Void> doCheckin(@PathVariable Long id, 
                                  @RequestBody DoCheckinRequest request,
                                  HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        attendanceService.doCheckin(id, userId, request);
        return Result.success();
    }
    
    // ========== 请假管理 ==========
    
    @PostMapping("/leave")
    public Result<LeaveRecordResponse> applyLeave(@Validated @RequestBody LeaveRequest request,
                                                   HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        return Result.success(attendanceService.applyLeave(userId, request));
    }
    
    @GetMapping("/leave")
    public Result<PageResult<LeaveRecordResponse>> getLeaveRecords(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            HttpServletRequest httpRequest) {
        // 如果是普通用户，只能查看自己的请假记录
        String role = (String) httpRequest.getAttribute("role");
        if (!"admin".equals(role)) {
            userId = (Long) httpRequest.getAttribute("userId");
        }
        return Result.success(attendanceService.getLeaveRecords(page, size, userId, status));
    }
    
    @PutMapping("/leave/{id}/approve")
    @RequireRole("admin")
    public Result<Void> approveLeave(@PathVariable Long id, 
                                     @RequestBody ApproveLeaveRequest request,
                                     HttpServletRequest httpRequest) {
        Long approverId = (Long) httpRequest.getAttribute("userId");
        attendanceService.approveLeave(id, approverId, request);
        return Result.success();
    }
}
