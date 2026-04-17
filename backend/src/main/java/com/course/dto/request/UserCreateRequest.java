package com.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户创建请求
 */
@Data
public class UserCreateRequest {
    @NotBlank(message = "学号不能为空")
    private String studentId;
    
    @NotBlank(message = "姓名不能为空")
    private String name;
    
    private String password;
    private String avatar;
    private String company;
    private String position;
    private String tags;
    
    @NotBlank(message = "角色不能为空")
    private String role;
    
    private String phone;
    private String email;
    private Integer badges;
    private Integer points;
    private Integer currentPeriod;
    private Long classId;
    private String status;
}
