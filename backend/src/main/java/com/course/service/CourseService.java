package com.course.service;

import com.course.common.PageResult;
import com.course.dto.request.CreateCourseRequest;
import com.course.dto.request.UpdateCourseRequest;
import com.course.dto.response.CourseResponse;

import java.util.List;

/**
 * 课程Service接口
 */
public interface CourseService {
    
    CourseResponse createCourse(CreateCourseRequest request);
    
    CourseResponse updateCourse(Long id, UpdateCourseRequest request);
    
    void deleteCourse(Long id);
    
    CourseResponse getCourseById(Long id);
    
    PageResult<CourseResponse> getCourseList(int page, int size, Long classId, String keyword, String status);
    
    List<CourseResponse> getCoursesByClassId(Long classId);
}
