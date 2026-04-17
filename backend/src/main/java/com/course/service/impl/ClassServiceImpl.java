package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.common.PageResult;
import com.course.dto.request.CreateClassRequest;
import com.course.dto.request.UpdateClassRequest;
import com.course.dto.response.ClassResponse;
import com.course.entity.Class;
import com.course.mapper.ClassMapper;
import com.course.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 班级Service实现
 */
@Service
@RequiredArgsConstructor
public class ClassServiceImpl implements ClassService {
    
    private final ClassMapper classMapper;
    
    @Override
    public ClassResponse createClass(CreateClassRequest request) {
        // 检查班级名称是否已存在
        LambdaQueryWrapper<Class> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Class::getName, request.getName());
        if (classMapper.selectCount(queryWrapper) > 0) {
            throw new BusinessException("班级名称已存在");
        }
        
        Class clazz = new Class();
        clazz.setName(request.getName());
        clazz.setDirector(request.getTeacherName());
        clazz.setDirectorId(request.getTeacherId() != null ? Long.valueOf(request.getTeacherId()) : null);
        clazz.setMonitor(request.getAcademicDirectorName());
        clazz.setMonitorId(request.getAcademicDirectorId() != null ? Long.valueOf(request.getAcademicDirectorId()) : null);
        clazz.setPeriod(1); // 默认期数
        clazz.setStatus(request.getStatus());
        
        classMapper.insert(clazz);
        
        return convertToResponse(clazz);
    }
    
    @Override
    public ClassResponse updateClass(Long id, UpdateClassRequest request) {
        Class clazz = classMapper.selectById(id);
        if (clazz == null) {
            throw new BusinessException("班级不存在");
        }
        
        if (StringUtils.hasText(request.getName())) {
            // 检查新名称是否与其他班级重复
            LambdaQueryWrapper<Class> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Class::getName, request.getName())
                       .ne(Class::getId, id);
            if (classMapper.selectCount(queryWrapper) > 0) {
                throw new BusinessException("班级名称已存在");
            }
            clazz.setName(request.getName());
        }
        
        if (StringUtils.hasText(request.getTeacherName())) {
            clazz.setDirector(request.getTeacherName());
        }
        if (StringUtils.hasText(request.getTeacherId())) {
            clazz.setDirectorId(Long.valueOf(request.getTeacherId()));
        }
        if (request.getAcademicDirectorName() != null) {
            clazz.setMonitor(request.getAcademicDirectorName());
        }
        if (request.getAcademicDirectorId() != null) {
            clazz.setMonitorId(Long.valueOf(request.getAcademicDirectorId()));
        }
        if (StringUtils.hasText(request.getStatus())) {
            clazz.setStatus(request.getStatus());
        }
        
        classMapper.updateById(clazz);
        
        return convertToResponse(clazz);
    }
    
    @Override
    public void deleteClass(Long id) {
        Class clazz = classMapper.selectById(id);
        if (clazz == null) {
            throw new BusinessException("班级不存在");
        }
        
        classMapper.deleteById(id);
    }
    
    @Override
    public ClassResponse getClassById(Long id) {
        Class clazz = classMapper.selectById(id);
        if (clazz == null) {
            throw new BusinessException("班级不存在");
        }
        
        return convertToResponse(clazz);
    }
    
    @Override
    public PageResult<ClassResponse> getClassList(int page, int size, String keyword, String status) {
        Page<Class> pageParam = new Page<>(page, size);
        
        LambdaQueryWrapper<Class> queryWrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(keyword)) {
            queryWrapper.like(Class::getName, keyword);
        }
        
        if (StringUtils.hasText(status)) {
            queryWrapper.eq(Class::getStatus, status);
        }
        
        queryWrapper.orderByDesc(Class::getCreatedAt);
        
        Page<Class> resultPage = classMapper.selectPage(pageParam, queryWrapper);
        
        List<ClassResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PageResult.of(
                responses,
                resultPage.getTotal(),
                (int) resultPage.getCurrent(),
                (int) resultPage.getSize()
        );
    }
    
    @Override
    public List<ClassResponse> getAllClasses() {
        LambdaQueryWrapper<Class> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Class::getStatus, "ongoing")
                   .orderByDesc(Class::getCreatedAt);
        
        List<Class> classes = classMapper.selectList(queryWrapper);
        
        return classes.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private ClassResponse convertToResponse(Class clazz) {
        ClassResponse response = new ClassResponse();
        response.setId(clazz.getId());
        response.setName(clazz.getName());
        response.setTeacherName(clazz.getDirector());
        response.setTeacherId(clazz.getDirectorId() != null ? String.valueOf(clazz.getDirectorId()) : null);
        response.setAcademicDirectorName(clazz.getMonitor());
        response.setAcademicDirectorId(clazz.getMonitorId() != null ? String.valueOf(clazz.getMonitorId()) : null);
        response.setStatus(clazz.getStatus());
        response.setCreatedAt(clazz.getCreatedAt());
        response.setUpdatedAt(clazz.getUpdatedAt());
        return response;
    }
}
