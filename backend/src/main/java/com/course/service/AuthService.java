package com.course.service;

import com.course.dto.request.LoginRequest;
import com.course.dto.response.LoginResponse;

/**
 * 认证服务接口
 */
public interface AuthService {
    
    /**
     * 学号密码登录
     */
    LoginResponse login(LoginRequest request);
    
    /**
     * 微信登录
     */
    LoginResponse wechatLogin(String code);
    
    /**
     * 管理员登录
     */
    LoginResponse adminLogin(LoginRequest request);
    
    /**
     * 刷新 Token
     */
    String refreshToken(String refreshToken);
    
    /**
     * 退出登录
     */
    void logout(String token);
}
