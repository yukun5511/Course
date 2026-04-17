package com.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 登录请求 DTO
 */
@Data
public class LoginRequest {
    @NotBlank(message = "学号不能为空")
    private String studentId;
    
    @NotBlank(message = "密码不能为空")
    private String password;
}
