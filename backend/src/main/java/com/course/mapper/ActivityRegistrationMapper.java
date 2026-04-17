package com.course.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.course.entity.ActivityRegistration;
import org.apache.ibatis.annotations.Mapper;

/**
 * 活动报名 Mapper
 */
@Mapper
public interface ActivityRegistrationMapper extends BaseMapper<ActivityRegistration> {
}
