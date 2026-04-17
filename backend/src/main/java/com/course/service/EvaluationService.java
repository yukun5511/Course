package com.course.service;

import com.course.common.PageResult;
import com.course.dto.request.CreateEvaluationRequest;
import com.course.dto.request.SubmitEvaluationRequest;
import com.course.dto.response.EvaluationResponse;

import java.util.List;

public interface EvaluationService {
    
    EvaluationResponse createEvaluation(CreateEvaluationRequest request);
    
    EvaluationResponse updateEvaluation(Long id, CreateEvaluationRequest request);
    
    void deleteEvaluation(Long id);
    
    EvaluationResponse getEvaluationById(Long id);
    
    PageResult<EvaluationResponse> getEvaluationList(int page, int size, Long courseId, String keyword, String status);
    
    List<EvaluationResponse> getEvaluationsByCourseId(Long courseId);
    
    void submitResponse(Long evaluationId, Long userId, SubmitEvaluationRequest request);
}
