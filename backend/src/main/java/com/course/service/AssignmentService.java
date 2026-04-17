package com.course.service;

import com.course.common.PageResult;
import com.course.dto.request.CreateAssignmentRequest;
import com.course.dto.request.UpdateAssignmentRequest;
import com.course.dto.request.GradeAssignmentRequest;
import com.course.dto.request.SubmitAssignmentRequest;
import com.course.dto.response.AssignmentResponse;

import java.util.List;

public interface AssignmentService {
    
    AssignmentResponse createAssignment(CreateAssignmentRequest request);
    
    AssignmentResponse updateAssignment(Long id, UpdateAssignmentRequest request);
    
    void deleteAssignment(Long id);
    
    AssignmentResponse getAssignmentById(Long id);
    
    PageResult<AssignmentResponse> getAssignmentList(int page, int size, Long courseId, String keyword, String status);
    
    List<AssignmentResponse> getAssignmentsByCourseId(Long courseId);
}
