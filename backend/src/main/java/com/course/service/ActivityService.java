package com.course.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.dto.request.ActivityCreateRequest;
import com.course.dto.request.ActivityQueryRequest;
import com.course.dto.request.ActivityUpdateRequest;
import com.course.dto.response.ActivityDTO;
import com.course.dto.response.ActivityRegistrationDTO;

/**
 * 活动服务接口
 */
public interface ActivityService {
    
    /**
     * 获取活动列表
     */
    Page<ActivityDTO> getActivityList(ActivityQueryRequest query);
    
    /**
     * 获取活动详情
     */
    ActivityDTO getActivityById(Long id);
    
    /**
     * 创建活动
     */
    ActivityDTO createActivity(ActivityCreateRequest request);
    
    /**
     * 更新活动
     */
    ActivityDTO updateActivity(Long id, ActivityUpdateRequest request);
    
    /**
     * 删除活动
     */
    void deleteActivity(Long id);
    
    /**
     * 报名活动
     */
    void registerActivity(Long activityId, Long userId);
    
    /**
     * 获取活动报名列表
     */
    Page<ActivityRegistrationDTO> getRegistrationList(Long activityId, Integer page, Integer size);
    
    /**
     * 导出报名名单
     */
    java.util.List<ActivityRegistrationDTO> exportRegistrations(Long activityId);
}
