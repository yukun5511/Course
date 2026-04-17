package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.dto.request.ActivityCreateRequest;
import com.course.dto.request.ActivityQueryRequest;
import com.course.dto.request.ActivityUpdateRequest;
import com.course.dto.response.ActivityDTO;
import com.course.dto.response.ActivityRegistrationDTO;
import com.course.entity.Activity;
import com.course.entity.ActivityRegistration;
import com.course.entity.User;
import com.course.mapper.ActivityMapper;
import com.course.mapper.ActivityRegistrationMapper;
import com.course.mapper.UserMapper;
import com.course.service.ActivityService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 活动服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityServiceImpl implements ActivityService {

    private final ActivityMapper activityMapper;
    private final ActivityRegistrationMapper registrationMapper;
    private final UserMapper userMapper;

    @Override
    public Page<ActivityDTO> getActivityList(ActivityQueryRequest query) {
        LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(query.getTitle())) {
            wrapper.like(Activity::getTitle, query.getTitle());
        }
        if (query.getOnCarousel() != null) {
            wrapper.eq(Activity::getOnCarousel, query.getOnCarousel());
        }
        
        wrapper.orderByDesc(Activity::getCreatedAt);
        
        Page<Activity> page = new Page<>(query.getPage(), query.getSize());
        Page<Activity> activityPage = activityMapper.selectPage(page, wrapper);
        
        // 转换为DTO并添加报名数量
        Page<ActivityDTO> resultPage = new Page<>(query.getPage(), query.getSize(), activityPage.getTotal());
        List<ActivityDTO> dtoList = activityPage.getRecords().stream().map(activity -> {
            ActivityDTO dto = convertToDTO(activity);
            // 查询报名数量
            Long count = registrationMapper.selectCount(
                new LambdaQueryWrapper<ActivityRegistration>()
                    .eq(ActivityRegistration::getActivityId, activity.getId())
            );
            dto.setRegistrationCount(count.intValue());
            return dto;
        }).toList();
        
        resultPage.setRecords(dtoList);
        return resultPage;
    }

    @Override
    public ActivityDTO getActivityById(Long id) {
        Activity activity = activityMapper.selectById(id);
        if (activity == null) {
            throw new BusinessException("活动不存在");
        }
        ActivityDTO dto = convertToDTO(activity);
        
        // 查询报名数量
        Long count = registrationMapper.selectCount(
            new LambdaQueryWrapper<ActivityRegistration>()
                .eq(ActivityRegistration::getActivityId, id)
        );
        dto.setRegistrationCount(count.intValue());
        
        return dto;
    }

    @Override
    public ActivityDTO createActivity(ActivityCreateRequest request) {
        Activity activity = new Activity();
        BeanUtils.copyProperties(request, activity);
        
        // TODO: 从登录用户获取createdBy
        activity.setCreatedBy(1L);
        
        activityMapper.insert(activity);
        log.info("创建活动成功: id={}, title={}", activity.getId(), activity.getTitle());
        return convertToDTO(activity);
    }

    @Override
    public ActivityDTO updateActivity(Long id, ActivityUpdateRequest request) {
        Activity activity = activityMapper.selectById(id);
        if (activity == null) {
            throw new BusinessException("活动不存在");
        }
        
        if (StringUtils.hasText(request.getTitle())) {
            activity.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            activity.setContent(request.getContent());
        }
        if (request.getImage() != null) {
            activity.setImage(request.getImage());
        }
        if (request.getOnCarousel() != null) {
            activity.setOnCarousel(request.getOnCarousel());
        }
        
        activityMapper.updateById(activity);
        log.info("更新活动成功: id={}", id);
        return convertToDTO(activity);
    }

    @Override
    public void deleteActivity(Long id) {
        Activity activity = activityMapper.selectById(id);
        if (activity == null) {
            throw new BusinessException("活动不存在");
        }
        
        // 删除相关报名记录
        registrationMapper.delete(
            new LambdaQueryWrapper<ActivityRegistration>()
                .eq(ActivityRegistration::getActivityId, id)
        );
        
        activityMapper.deleteById(id);
        log.info("删除活动成功: id={}", id);
    }

    @Override
    public void registerActivity(Long activityId, Long userId) {
        // 检查活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null) {
            throw new BusinessException("活动不存在");
        }
        
        // 检查是否已报名
        Long count = registrationMapper.selectCount(
            new LambdaQueryWrapper<ActivityRegistration>()
                .eq(ActivityRegistration::getActivityId, activityId)
                .eq(ActivityRegistration::getUserId, userId)
        );
        if (count > 0) {
            throw new BusinessException("已报名该活动");
        }
        
        ActivityRegistration registration = new ActivityRegistration();
        registration.setActivityId(activityId);
        registration.setUserId(userId);
        
        registrationMapper.insert(registration);
        log.info("报名活动成功: activityId={}, userId={}", activityId, userId);
    }

    @Override
    public Page<ActivityRegistrationDTO> getRegistrationList(Long activityId, Integer page, Integer size) {
        // 检查活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null) {
            throw new BusinessException("活动不存在");
        }
        
        LambdaQueryWrapper<ActivityRegistration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ActivityRegistration::getActivityId, activityId);
        wrapper.orderByDesc(ActivityRegistration::getRegisteredAt);
        
        Page<ActivityRegistration> regPage = new Page<>(page, size);
        Page<ActivityRegistration> registrationPage = registrationMapper.selectPage(regPage, wrapper);
        
        // 转换为DTO并添加用户信息
        Page<ActivityRegistrationDTO> resultPage = new Page<>(page, size, registrationPage.getTotal());
        List<ActivityRegistrationDTO> dtoList = registrationPage.getRecords().stream().map(reg -> {
            ActivityRegistrationDTO dto = convertToRegistrationDTO(reg);
            dto.setActivityTitle(activity.getTitle());
            
            // 获取用户信息
            User user = userMapper.selectById(reg.getUserId());
            if (user != null) {
                dto.setUserName(user.getName());
                dto.setStudentId(user.getStudentId());
                dto.setCompany(user.getCompany());
                dto.setPosition(user.getPosition());
            }
            
            return dto;
        }).toList();
        
        resultPage.setRecords(dtoList);
        return resultPage;
    }

    @Override
    public List<ActivityRegistrationDTO> exportRegistrations(Long activityId) {
        // 检查活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null) {
            throw new BusinessException("活动不存在");
        }
        
        LambdaQueryWrapper<ActivityRegistration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ActivityRegistration::getActivityId, activityId);
        wrapper.orderByDesc(ActivityRegistration::getRegisteredAt);
        
        List<ActivityRegistration> registrations = registrationMapper.selectList(wrapper);
        
        return registrations.stream().map(reg -> {
            ActivityRegistrationDTO dto = convertToRegistrationDTO(reg);
            dto.setActivityTitle(activity.getTitle());
            
            User user = userMapper.selectById(reg.getUserId());
            if (user != null) {
                dto.setUserName(user.getName());
                dto.setStudentId(user.getStudentId());
                dto.setCompany(user.getCompany());
                dto.setPosition(user.getPosition());
            }
            
            return dto;
        }).toList();
    }

    private ActivityDTO convertToDTO(Activity activity) {
        ActivityDTO dto = new ActivityDTO();
        BeanUtils.copyProperties(activity, dto);
        
        // 获取创建人姓名
        if (activity.getCreatedBy() != null) {
            User creator = userMapper.selectById(activity.getCreatedBy());
            if (creator != null) {
                dto.setCreatorName(creator.getName());
            }
        }
        
        return dto;
    }

    private ActivityRegistrationDTO convertToRegistrationDTO(ActivityRegistration registration) {
        ActivityRegistrationDTO dto = new ActivityRegistrationDTO();
        BeanUtils.copyProperties(registration, dto);
        return dto;
    }
}
