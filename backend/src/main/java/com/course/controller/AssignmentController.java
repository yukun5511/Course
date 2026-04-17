package com.course.controller;

import com.course.common.PageResult;
import com.course.common.Result;
import com.course.dto.request.CreateAssignmentRequest;
import com.course.dto.request.UpdateAssignmentRequest;
import com.course.dto.response.AssignmentResponse;
import com.course.interceptor.RequireRole;
import com.course.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    
    private final AssignmentService assignmentService;
    
    @PostMapping
    @RequireRole("admin")
    public Result<AssignmentResponse> createAssignment(@Validated @RequestBody CreateAssignmentRequest request) {
        return Result.success(assignmentService.createAssignment(request));
    }
    
    @PutMapping("/{id}")
    @RequireRole("admin")
    public Result<AssignmentResponse> updateAssignment(@PathVariable Long id, 
                                                       @RequestBody UpdateAssignmentRequest request) {
        return Result.success(assignmentService.updateAssignment(id, request));
    }
    
    @DeleteMapping("/{id}")
    @RequireRole("admin")
    public Result<Void> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return Result.success();
    }
    
    @GetMapping("/{id}")
    public Result<AssignmentResponse> getAssignmentById(@PathVariable Long id) {
        return Result.success(assignmentService.getAssignmentById(id));
    }
    
    @GetMapping
    public Result<PageResult<AssignmentResponse>> getAssignmentList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(assignmentService.getAssignmentList(page, size, courseId, keyword, status));
    }
    
    @GetMapping("/course/{courseId}")
    public Result<List<AssignmentResponse>> getAssignmentsByCourseId(@PathVariable Long courseId) {
        return Result.success(assignmentService.getAssignmentsByCourseId(courseId));
    }
}
