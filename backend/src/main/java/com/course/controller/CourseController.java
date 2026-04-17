package com.course.controller;

import com.course.common.PageResult;
import com.course.common.Result;
import com.course.dto.request.CreateCourseRequest;
import com.course.dto.request.UpdateCourseRequest;
import com.course.dto.response.CourseResponse;
import com.course.interceptor.RequireRole;
import com.course.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 课程管理控制器
 */
@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    
    @PostMapping
    @RequireRole("admin")
    public Result<CourseResponse> createCourse(@Validated @RequestBody CreateCourseRequest request) {
        return Result.success(courseService.createCourse(request));
    }
    
    @PutMapping("/{id}")
    @RequireRole("admin")
    public Result<CourseResponse> updateCourse(@PathVariable Long id, 
                                               @Validated @RequestBody UpdateCourseRequest request) {
        return Result.success(courseService.updateCourse(id, request));
    }
    
    @DeleteMapping("/{id}")
    @RequireRole("admin")
    public Result<Void> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return Result.success();
    }
    
    @GetMapping("/{id}")
    public Result<CourseResponse> getCourseById(@PathVariable Long id) {
        return Result.success(courseService.getCourseById(id));
    }
    
    @GetMapping
    public Result<PageResult<CourseResponse>> getCourseList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        return Result.success(courseService.getCourseList(page, size, classId, keyword, status));
    }
    
    @GetMapping("/class/{classId}")
    public Result<List<CourseResponse>> getCoursesByClassId(@PathVariable Long classId) {
        return Result.success(courseService.getCoursesByClassId(classId));
    }
}
