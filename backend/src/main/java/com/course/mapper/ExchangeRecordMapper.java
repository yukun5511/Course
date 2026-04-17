package com.course.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.course.entity.ExchangeRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 兑换记录 Mapper
 */
@Mapper
public interface ExchangeRecordMapper extends BaseMapper<ExchangeRecord> {
}
