package com.course.dto.response;

import lombok.Data;

/**
 * 登录响应 DTO
 */
@Data
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private UserDTO user;
}
