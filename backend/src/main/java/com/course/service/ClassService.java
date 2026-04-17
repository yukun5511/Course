package com.course.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.PageResult;
import com.course.dto.request.CreateClassRequest;
import com.course.dto.request.UpdateClassRequest;
import com.course.dto.response.ClassResponse;

/**
 * 班级Service接口
 */
public interface ClassService {
    
    /**
     * 创建班级
     */
    ClassResponse createClass(CreateClassRequest request);
    
    /**
     * 更新班级
     */
    ClassResponse updateClass(Long id, UpdateClassRequest request);
    
    /**
     * 删除班级
     */
    void deleteClass(Long id);
    
    /**
     * 获取班级详情
     */
    ClassResponse getClassById(Long id);
    
    /**
     * 分页查询班级列表
     */
    PageResult<ClassResponse> getClassList(int page, int size, String keyword, String status);
    
    /**
     * 获取所有班级列表
     */
    java.util.List<ClassResponse> getAllClasses();
}
