package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.common.PageResult;
import com.course.dto.request.CreateCourseRequest;
import com.course.dto.request.UpdateCourseRequest;
import com.course.dto.response.CourseResponse;
import com.course.entity.Course;
import com.course.mapper.CourseMapper;
import com.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 课程Service实现
 */
@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {
    
    private final CourseMapper courseMapper;
    
    @Override
    public CourseResponse createCourse(CreateCourseRequest request) {
        Course course = new Course();
        course.setName(request.getName());
        course.setPeriod(1);
        course.setStartDate(request.getStartTime().toLocalDate());
        course.setEndDate(request.getEndTime().toLocalDate());
        course.setLocation(request.getLocation());
        course.setInstructor(request.getTeacherName());
        course.setInstructorId(request.getTeacherId() != null ? Long.valueOf(request.getTeacherId()) : null);
        course.setCredits(request.getTotalHours());
        course.setDescription(request.getDescription());
        course.setImage(request.getCoverImage());
        course.setClassId(request.getClassId());
        course.setStatus(request.getStatus());
        
        courseMapper.insert(course);
        return convertToResponse(course);
    }
    
    @Override
    public CourseResponse updateCourse(Long id, UpdateCourseRequest request) {
        Course course = courseMapper.selectById(id);
        if (course == null) {
            throw new BusinessException("课程不存在");
        }
        
        if (StringUtils.hasText(request.getName())) {
            course.setName(request.getName());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getTeacherId() != null) {
            course.setInstructorId(Long.valueOf(request.getTeacherId()));
        }
        if (request.getTeacherName() != null) {
            course.setInstructor(request.getTeacherName());
        }
        if (request.getCoverImage() != null) {
            course.setImage(request.getCoverImage());
        }
        if (request.getStartTime() != null) {
            course.setStartDate(request.getStartTime().toLocalDate());
        }
        if (request.getEndTime() != null) {
            course.setEndDate(request.getEndTime().toLocalDate());
        }
        if (request.getLocation() != null) {
            course.setLocation(request.getLocation());
        }
        if (request.getTotalHours() != null) {
            course.setCredits(request.getTotalHours());
        }
        if (StringUtils.hasText(request.getStatus())) {
            course.setStatus(request.getStatus());
        }
        
        courseMapper.updateById(course);
        return convertToResponse(course);
    }
    
    @Override
    public void deleteCourse(Long id) {
        Course course = courseMapper.selectById(id);
        if (course == null) {
            throw new BusinessException("课程不存在");
        }
        courseMapper.deleteById(id);
    }
    
    @Override
    public CourseResponse getCourseById(Long id) {
        Course course = courseMapper.selectById(id);
        if (course == null) {
            throw new BusinessException("课程不存在");
        }
        return convertToResponse(course);
    }
    
    @Override
    public PageResult<CourseResponse> getCourseList(int page, int size, Long classId, String keyword, String status) {
        Page<Course> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Course> queryWrapper = new LambdaQueryWrapper<>();
        
        if (classId != null) {
            queryWrapper.eq(Course::getClassId, classId);
        }
        if (StringUtils.hasText(keyword)) {
            queryWrapper.like(Course::getName, keyword);
        }
        if (StringUtils.hasText(status)) {
            queryWrapper.eq(Course::getStatus, status);
        }
        
        queryWrapper.orderByDesc(Course::getCreatedAt);
        
        Page<Course> resultPage = courseMapper.selectPage(pageParam, queryWrapper);
        
        List<CourseResponse> responses = resultPage.getRecords().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return PageResult.of(responses, resultPage.getTotal(), (int) resultPage.getCurrent(), (int) resultPage.getSize());
    }
    
    @Override
    public List<CourseResponse> getCoursesByClassId(Long classId) {
        LambdaQueryWrapper<Course> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Course::getClassId, classId)
                   .eq(Course::getStatus, "ongoing")
                   .orderByDesc(Course::getCreatedAt);
        
        List<Course> courses = courseMapper.selectList(queryWrapper);
        return courses.stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private CourseResponse convertToResponse(Course course) {
        CourseResponse response = new CourseResponse();
        response.setId(course.getId());
        response.setClassId(course.getClassId());
        response.setName(course.getName());
        response.setDescription(course.getDescription());
        response.setTeacherId(course.getInstructorId() != null ? String.valueOf(course.getInstructorId()) : null);
        response.setTeacherName(course.getInstructor());
        response.setCoverImage(course.getImage());
        response.setStartTime(course.getStartDate() != null ? course.getStartDate().atStartOfDay() : null);
        response.setEndTime(course.getEndDate() != null ? course.getEndDate().atStartOfDay() : null);
        response.setLocation(course.getLocation());
        response.setTotalHours(course.getCredits());
        response.setStatus(course.getStatus());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());
        return response;
    }
}
