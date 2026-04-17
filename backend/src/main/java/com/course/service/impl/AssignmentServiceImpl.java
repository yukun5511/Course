package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.common.PageResult;
import com.course.dto.request.CreateAssignmentRequest;
import com.course.dto.request.UpdateAssignmentRequest;
import com.course.dto.response.AssignmentResponse;
import com.course.entity.Assignment;
import com.course.mapper.AssignmentMapper;
import com.course.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {
    
    private final AssignmentMapper assignmentMapper;
    
    @Override
    public AssignmentResponse createAssignment(CreateAssignmentRequest request) {
        Assignment assignment = new Assignment();
        assignment.setCourseId(request.getCourseId());
        assignment.setCourseName(request.getCourseName());
        assignment.setTitle(request.getTitle());
        assignment.setContent(request.getDescription());
        assignment.setDeadline(request.getDeadline());
        
        assignmentMapper.insert(assignment);
        return convertToResponse(assignment);
    }
    
    @Override
    public AssignmentResponse updateAssignment(Long id, UpdateAssignmentRequest request) {
        Assignment assignment = assignmentMapper.selectById(id);
        if (assignment == null) {
            throw new BusinessException("作业不存在");
        }
        
        if (StringUtils.hasText(request.getTitle())) {
            assignment.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            assignment.setContent(request.getDescription());
        }
        if (request.getDeadline() != null) {
            assignment.setDeadline(request.getDeadline());
        }
        
        assignmentMapper.updateById(assignment);
        return convertToResponse(assignment);
    }
    
    @Override
    public void deleteAssignment(Long id) {
        Assignment assignment = assignmentMapper.selectById(id);
        if (assignment == null) {
            throw new BusinessException("作业不存在");
        }
        assignmentMapper.deleteById(id);
    }
    
    @Override
    public AssignmentResponse getAssignmentById(Long id) {
        Assignment assignment = assignmentMapper.selectById(id);
        if (assignment == null) {
            throw new BusinessException("作业不存在");
        }
        return convertToResponse(assignment);
    }
    
    @Override
    public PageResult<AssignmentResponse> getAssignmentList(int page, int size, Long courseId, String keyword, String status) {
        Page<Assignment> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Assignment> queryWrapper = new LambdaQueryWrapper<>();
        
        if (courseId != null) {
            queryWrapper.eq(Assignment::getCourseId, courseId);
        }
        if (StringUtils.hasText(keyword)) {
            queryWrapper.like(Assignment::getTitle, keyword);
        }
        
        queryWrapper.orderByDesc(Assignment::getCreatedAt);
        
        Page<Assignment> resultPage = assignmentMapper.selectPage(pageParam, queryWrapper);
        
        List<AssignmentResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PageResult.of(responses, resultPage.getTotal(), (int) resultPage.getCurrent(), (int) resultPage.getSize());
    }
    
    @Override
    public List<AssignmentResponse> getAssignmentsByCourseId(Long courseId) {
        LambdaQueryWrapper<Assignment> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Assignment::getCourseId, courseId)
                   .orderByDesc(Assignment::getCreatedAt);
        
        List<Assignment> assignments = assignmentMapper.selectList(queryWrapper);
        return assignments.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private AssignmentResponse convertToResponse(Assignment assignment) {
        AssignmentResponse response = new AssignmentResponse();
        response.setId(assignment.getId());
        response.setCourseId(assignment.getCourseId());
        response.setCourseName(assignment.getCourseName());
        response.setTitle(assignment.getTitle());
        response.setDescription(assignment.getContent());
        response.setDeadline(assignment.getDeadline());
        response.setCreatedAt(assignment.getCreatedAt());
        return response;
    }
}
