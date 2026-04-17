package com.course.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.course.entity.PopupMessage;
import org.apache.ibatis.annotations.Mapper;

/**
 * 弹窗消息 Mapper
 */
@Mapper
public interface PopupMessageMapper extends BaseMapper<PopupMessage> {
}
