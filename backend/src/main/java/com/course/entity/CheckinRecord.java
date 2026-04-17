package com.course.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 打卡记录实体类
 */
@Data
@TableName("checkin_records")
public class CheckinRecord {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    private Long checkinId;
    
    private Long userId;
    
    private String userName;
    
    private LocalDateTime checkinTime;
    
    private String location;
    
    private String imageUrl;
    
    private String remark;
    
    private String status;
    
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;
}
