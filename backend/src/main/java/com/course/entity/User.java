package com.course.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 用户实体类
 */
@Data
@TableName("users")
public class User {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String studentId;
    private String name;
    private String password;
    private String avatar;
    private String company;
    private String position;
    private String tags;
    private String role;
    private String phone;
    private String email;
    private Integer badges;
    private Integer points;
    private Integer currentPeriod;
    private Long classId;
    private String status;
    private Integer enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
