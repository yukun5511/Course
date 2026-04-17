package com.course.controller;

import com.course.common.PageResult;
import com.course.common.Result;
import com.course.dto.request.CreateEvaluationRequest;
import com.course.dto.request.SubmitEvaluationRequest;
import com.course.dto.response.EvaluationResponse;
import com.course.interceptor.RequireRole;
import com.course.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/evaluations")
@RequiredArgsConstructor
public class EvaluationController {
    
    private final EvaluationService evaluationService;
    
    @PostMapping
    @RequireRole("admin")
    public Result<EvaluationResponse> createEvaluation(@Validated @RequestBody CreateEvaluationRequest request) {
        return Result.success(evaluationService.createEvaluation(request));
    }
    
    @PutMapping("/{id}")
    @RequireRole("admin")
    public Result<EvaluationResponse> updateEvaluation(@PathVariable Long id, 
                                                       @Validated @RequestBody CreateEvaluationRequest request) {
        return Result.success(evaluationService.updateEvaluation(id, request));
    }
    
    @DeleteMapping("/{id}")
    @RequireRole("admin")
    public Result<Void> deleteEvaluation(@PathVariable Long id) {
        evaluationService.deleteEvaluation(id);
        return Result.success();
    }
    
    @GetMapping("/{id}")
    public Result<EvaluationResponse> getEvaluationById(@PathVariable Long id) {
        return Result.success(evaluationService.getEvaluationById(id));
    }
    
    @GetMapping
    public Result<PageResult<EvaluationResponse>> getEvaluationList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(evaluationService.getEvaluationList(page, size, courseId, keyword, status));
    }
    
    @GetMapping("/course/{courseId}")
    public Result<List<EvaluationResponse>> getEvaluationsByCourseId(@PathVariable Long courseId) {
        return Result.success(evaluationService.getEvaluationsByCourseId(courseId));
    }
    
    @PostMapping("/{id}/submit")
    public Result<Void> submitResponse(@PathVariable Long id, 
                                       @RequestBody SubmitEvaluationRequest request,
                                       HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        evaluationService.submitResponse(id, userId, request);
        return Result.success();
    }
}
