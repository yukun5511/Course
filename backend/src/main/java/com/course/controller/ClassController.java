package com.course.controller;

import com.course.common.PageResult;
import com.course.common.Result;
import com.course.dto.request.CreateClassRequest;
import com.course.dto.request.UpdateClassRequest;
import com.course.dto.response.ClassResponse;
import com.course.interceptor.RequireRole;
import com.course.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 班级管理控制器
 */
@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
public class ClassController {
    
    private final ClassService classService;
    
    /**
     * 创建班级（管理员）
     */
    @PostMapping
    @RequireRole("admin")
    public Result<ClassResponse> createClass(@Validated @RequestBody CreateClassRequest request) {
        ClassResponse response = classService.createClass(request);
        return Result.success(response);
    }
    
    /**
     * 更新班级（管理员）
     */
    @PutMapping("/{id}")
    @RequireRole("admin")
    public Result<ClassResponse> updateClass(@PathVariable Long id, 
                                             @Validated @RequestBody UpdateClassRequest request) {
        ClassResponse response = classService.updateClass(id, request);
        return Result.success(response);
    }
    
    /**
     * 删除班级（管理员）
     */
    @DeleteMapping("/{id}")
    @RequireRole("admin")
    public Result<Void> deleteClass(@PathVariable Long id) {
        classService.deleteClass(id);
        return Result.success();
    }
    
    /**
     * 获取班级详情
     */
    @GetMapping("/{id}")
    public Result<ClassResponse> getClassById(@PathVariable Long id) {
        ClassResponse response = classService.getClassById(id);
        return Result.success(response);
    }
    
    /**
     * 分页查询班级列表
     */
    @GetMapping
    public Result<PageResult<ClassResponse>> getClassList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status) {
        PageResult<ClassResponse> result = classService.getClassList(page, size, keyword, status);
        return Result.success(result);
    }
    
    /**
     * 获取所有班级列表（用于下拉选择）
     */
    @GetMapping("/all")
    public Result<List<ClassResponse>> getAllClasses() {
        List<ClassResponse> classes = classService.getAllClasses();
        return Result.success(classes);
    }
}
