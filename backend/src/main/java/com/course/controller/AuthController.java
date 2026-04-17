package com.course.controller;

import com.course.common.Result;
import com.course.dto.request.LoginRequest;
import com.course.dto.response.LoginResponse;
import com.course.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 认证控制器
 */
@Tag(name = "认证管理", description = "用户登录、Token刷新等接口")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(summary = "学号密码登录", description = "学员和学术主任使用学号密码登录")
    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return Result.success(response);
    }

    @Operation(summary = "微信登录", description = "微信授权快速登录")
    @PostMapping("/wechat-login")
    public Result<LoginResponse> wechatLogin(@RequestParam String code) {
        LoginResponse response = authService.wechatLogin(code);
        return Result.success(response);
    }

    @Operation(summary = "管理员登录", description = "运营人员和系统管理员登录")
    @PostMapping("/admin-login")
    public Result<LoginResponse> adminLogin(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.adminLogin(request);
        return Result.success(response);
    }

    @Operation(summary = "刷新Token", description = "使用Refresh Token获取新的Access Token")
    @PostMapping("/refresh")
    public Result<String> refresh(@RequestParam String refreshToken) {
        String newAccessToken = authService.refreshToken(refreshToken);
        return Result.success(newAccessToken);
    }

    @Operation(summary = "退出登录", description = "退出当前登录")
    @PostMapping("/logout")
    public Result<Void> logout(@RequestHeader("Authorization") String token) {
        authService.logout(token);
        return Result.success();
    }
}
