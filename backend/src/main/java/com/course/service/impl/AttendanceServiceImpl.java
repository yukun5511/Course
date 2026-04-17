package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.common.PageResult;
import com.course.dto.request.*;
import com.course.dto.response.CheckinResponse;
import com.course.dto.response.LeaveRecordResponse;
import com.course.entity.Checkin;
import com.course.entity.CheckinRecord;
import com.course.entity.LeaveRecord;
import com.course.mapper.CheckinMapper;
import com.course.mapper.CheckinRecordMapper;
import com.course.mapper.LeaveRecordMapper;
import com.course.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {
    
    private final CheckinMapper checkinMapper;
    private final CheckinRecordMapper checkinRecordMapper;
    private final LeaveRecordMapper leaveRecordMapper;
    
    @Override
    public CheckinResponse createCheckin(CreateCheckinRequest request) {
        Checkin checkin = new Checkin();
        checkin.setCourseId(request.getCourseId());
        checkin.setCourseName(request.getCourseName());
        checkin.setTitle(request.getTitle());
        checkin.setDescription(request.getDescription());
        checkin.setLocation(request.getLocation());
        checkin.setStartTime(request.getStartTime());
        checkin.setEndTime(request.getEndTime());
        checkin.setStatus(request.getStatus());
        
        checkinMapper.insert(checkin);
        return convertToCheckinResponse(checkin);
    }
    
    @Override
    public CheckinResponse updateCheckin(Long id, CreateCheckinRequest request) {
        Checkin checkin = checkinMapper.selectById(id);
        if (checkin == null) {
            throw new BusinessException("打卡任务不存在");
        }
        
        if (StringUtils.hasText(request.getTitle())) {
            checkin.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            checkin.setDescription(request.getDescription());
        }
        if (request.getLocation() != null) {
            checkin.setLocation(request.getLocation());
        }
        if (request.getStartTime() != null) {
            checkin.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            checkin.setEndTime(request.getEndTime());
        }
        if (StringUtils.hasText(request.getStatus())) {
            checkin.setStatus(request.getStatus());
        }
        
        checkinMapper.updateById(checkin);
        return convertToCheckinResponse(checkin);
    }
    
    @Override
    public void deleteCheckin(Long id) {
        Checkin checkin = checkinMapper.selectById(id);
        if (checkin == null) {
            throw new BusinessException("打卡任务不存在");
        }
        checkinMapper.deleteById(id);
    }
    
    @Override
    public CheckinResponse getCheckinById(Long id) {
        Checkin checkin = checkinMapper.selectById(id);
        if (checkin == null) {
            throw new BusinessException("打卡任务不存在");
        }
        return convertToCheckinResponse(checkin);
    }
    
    @Override
    public PageResult<CheckinResponse> getCheckinList(int page, int size, Long courseId, String status) {
        Page<Checkin> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Checkin> queryWrapper = new LambdaQueryWrapper<>();
        
        if (courseId != null) {
            queryWrapper.eq(Checkin::getCourseId, courseId);
        }
        if (StringUtils.hasText(status)) {
            queryWrapper.eq(Checkin::getStatus, status);
        }
        
        queryWrapper.orderByDesc(Checkin::getCreatedAt);
        
        Page<Checkin> resultPage = checkinMapper.selectPage(pageParam, queryWrapper);
        
        List<CheckinResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToCheckinResponse)
                .collect(Collectors.toList());
        
        return PageResult.of(responses, resultPage.getTotal(), (int) resultPage.getCurrent(), (int) resultPage.getSize());
    }
    
    @Override
    public void doCheckin(Long checkinId, Long userId, DoCheckinRequest request) {
        Checkin checkin = checkinMapper.selectById(checkinId);
        if (checkin == null) {
            throw new BusinessException("打卡任务不存在");
        }
        
        CheckinRecord record = new CheckinRecord();
        record.setCheckinId(checkinId);
        record.setUserId(userId);
        record.setCheckinTime(LocalDateTime.now());
        record.setLocation(request.getLocation());
        record.setImageUrl(request.getImageUrl());
        record.setRemark(request.getRemark());
        record.setStatus("success");
        
        checkinRecordMapper.insert(record);
    }
    
    @Override
    public LeaveRecordResponse applyLeave(Long userId, LeaveRequest request) {
        LeaveRecord record = new LeaveRecord();
        record.setUserId(userId);
        record.setReason(request.getReason());
        record.setStartTime(request.getStartTime());
        record.setEndTime(request.getEndTime());
        record.setAttachmentUrl(request.getAttachmentUrl());
        record.setStatus("pending");
        
        leaveRecordMapper.insert(record);
        return convertToLeaveResponse(record);
    }
    
    @Override
    public PageResult<LeaveRecordResponse> getLeaveRecords(int page, int size, Long userId, String status) {
        Page<LeaveRecord> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<LeaveRecord> queryWrapper = new LambdaQueryWrapper<>();
        
        if (userId != null) {
            queryWrapper.eq(LeaveRecord::getUserId, userId);
        }
        if (StringUtils.hasText(status)) {
            queryWrapper.eq(LeaveRecord::getStatus, status);
        }
        
        queryWrapper.orderByDesc(LeaveRecord::getCreatedAt);
        
        Page<LeaveRecord> resultPage = leaveRecordMapper.selectPage(pageParam, queryWrapper);
        
        List<LeaveRecordResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToLeaveResponse)
                .collect(Collectors.toList());
        
        return PageResult.of(responses, resultPage.getTotal(), (int) resultPage.getCurrent(), (int) resultPage.getSize());
    }
    
    @Override
    public void approveLeave(Long leaveId, Long approverId, ApproveLeaveRequest request) {
        LeaveRecord record = leaveRecordMapper.selectById(leaveId);
        if (record == null) {
            throw new BusinessException("请假记录不存在");
        }
        
        record.setStatus(request.getStatus());
        record.setApproverId(String.valueOf(approverId));
        record.setApproveTime(LocalDateTime.now());
        
        if ("rejected".equals(request.getStatus())) {
            record.setRejectReason(request.getRejectReason());
        }
        
        leaveRecordMapper.updateById(record);
    }
    
    private CheckinResponse convertToCheckinResponse(Checkin checkin) {
        CheckinResponse response = new CheckinResponse();
        response.setId(checkin.getId());
        response.setCourseId(checkin.getCourseId());
        response.setCourseName(checkin.getCourseName());
        response.setTitle(checkin.getTitle());
        response.setDescription(checkin.getDescription());
        response.setLocation(checkin.getLocation());
        response.setStartTime(checkin.getStartTime());
        response.setEndTime(checkin.getEndTime());
        response.setStatus(checkin.getStatus());
        response.setCreatedAt(checkin.getCreatedAt());
        response.setUpdatedAt(checkin.getUpdatedAt());
        return response;
    }
    
    private LeaveRecordResponse convertToLeaveResponse(LeaveRecord record) {
        LeaveRecordResponse response = new LeaveRecordResponse();
        response.setId(record.getId());
        response.setUserId(record.getUserId());
        response.setReason(record.getReason());
        response.setStartTime(record.getStartTime());
        response.setEndTime(record.getEndTime());
        response.setAttachmentUrl(record.getAttachmentUrl());
        response.setStatus(record.getStatus());
        response.setApproverId(record.getApproverId());
        response.setRejectReason(record.getRejectReason());
        response.setApproveTime(record.getApproveTime());
        response.setCreatedAt(record.getCreatedAt());
        response.setUpdatedAt(record.getUpdatedAt());
        return response;
    }
}
