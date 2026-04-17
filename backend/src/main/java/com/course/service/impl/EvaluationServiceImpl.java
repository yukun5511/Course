package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.common.PageResult;
import com.course.dto.request.CreateEvaluationRequest;
import com.course.dto.request.SubmitEvaluationRequest;
import com.course.dto.response.EvaluationResponse;
import com.course.entity.Evaluation;
import com.course.mapper.EvaluationMapper;
import com.course.mapper.EvaluationResponseMapper;
import com.course.service.EvaluationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EvaluationServiceImpl implements EvaluationService {
    
    private final EvaluationMapper evaluationMapper;
    private final EvaluationResponseMapper evaluationResponseMapper;
    
    @Override
    public EvaluationResponse createEvaluation(CreateEvaluationRequest request) {
        Evaluation evaluation = new Evaluation();
        evaluation.setCourseId(request.getCourseId());
        evaluation.setCourseName(request.getCourseName());
        evaluation.setQuestions(request.getQuestions());
        
        evaluationMapper.insert(evaluation);
        return convertToResponse(evaluation);
    }
    
    @Override
    public EvaluationResponse updateEvaluation(Long id, CreateEvaluationRequest request) {
        Evaluation evaluation = evaluationMapper.selectById(id);
        if (evaluation == null) {
            throw new BusinessException("评价不存在");
        }
        
        if (request.getQuestions() != null) {
            evaluation.setQuestions(request.getQuestions());
        }
        
        evaluationMapper.updateById(evaluation);
        return convertToResponse(evaluation);
    }
    
    @Override
    public void deleteEvaluation(Long id) {
        Evaluation evaluation = evaluationMapper.selectById(id);
        if (evaluation == null) {
            throw new BusinessException("评价不存在");
        }
        evaluationMapper.deleteById(id);
    }
    
    @Override
    public EvaluationResponse getEvaluationById(Long id) {
        Evaluation evaluation = evaluationMapper.selectById(id);
        if (evaluation == null) {
            throw new BusinessException("评价不存在");
        }
        return convertToResponse(evaluation);
    }
    
    @Override
    public PageResult<EvaluationResponse> getEvaluationList(int page, int size, Long courseId, String keyword, String status) {
        Page<Evaluation> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Evaluation> queryWrapper = new LambdaQueryWrapper<>();
        
        if (courseId != null) {
            queryWrapper.eq(Evaluation::getCourseId, courseId);
        }
        
        queryWrapper.orderByDesc(Evaluation::getCreatedAt);
        
        Page<Evaluation> resultPage = evaluationMapper.selectPage(pageParam, queryWrapper);
        
        List<EvaluationResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PageResult.of(responses, resultPage.getTotal(), (int) resultPage.getCurrent(), (int) resultPage.getSize());
    }
    
    @Override
    public List<EvaluationResponse> getEvaluationsByCourseId(Long courseId) {
        LambdaQueryWrapper<Evaluation> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Evaluation::getCourseId, courseId)
                   .orderByDesc(Evaluation::getCreatedAt);
        
        List<Evaluation> evaluations = evaluationMapper.selectList(queryWrapper);
        return evaluations.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    @Override
    public void submitResponse(Long evaluationId, Long userId, SubmitEvaluationRequest request) {
        Evaluation evaluation = evaluationMapper.selectById(evaluationId);
        if (evaluation == null) {
            throw new BusinessException("评价不存在");
        }
        
        com.course.entity.EvaluationResponse response = new com.course.entity.EvaluationResponse();
        response.setEvaluationId(evaluationId);
        response.setUserId(userId);
        response.setAnswers(request.getAnswers());
        response.setSubmitTime(LocalDateTime.now());
        
        evaluationResponseMapper.insert(response);
    }
    
    private EvaluationResponse convertToResponse(Evaluation evaluation) {
        EvaluationResponse response = new EvaluationResponse();
        response.setId(evaluation.getId());
        response.setCourseId(evaluation.getCourseId());
        response.setCourseName(evaluation.getCourseName());
        response.setQuestions(evaluation.getQuestions());
        response.setCreatedAt(evaluation.getCreatedAt());
        return response;
    }
}
