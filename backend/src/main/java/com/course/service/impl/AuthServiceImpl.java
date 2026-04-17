package com.course.service.impl;

import com.course.common.exception.BusinessException;
import com.course.dto.request.LoginRequest;
import com.course.dto.response.LoginResponse;
import com.course.dto.response.UserDTO;
import com.course.entity.User;
import com.course.mapper.UserMapper;
import com.course.service.AuthService;
import com.course.utils.JwtUtil;
import com.course.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

/**
 * 认证服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @Override
    public LoginResponse login(LoginRequest request) {
        // 查询用户
        User user = userMapper.selectByStudentId(request.getStudentId());
        if (user == null) {
            throw new BusinessException(401, "学号或密码错误");
        }

        // 检查账号是否启用
        if (user.getEnabled() == null || user.getEnabled() == 0) {
            throw new BusinessException(403, "账号已被禁用");
        }

        // 验证密码（只允许学生角色使用此接口）
        if (!"student".equals(user.getRole()) && !"academic_director".equals(user.getRole())) {
            throw new BusinessException(403, "请使用管理员登录接口");
        }

        if (user.getPassword() == null || !PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(401, "学号或密码错误");
        }

        // 生成 Token
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getStudentId(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getStudentId());

        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(convertToUserDTO(user));

        log.info("用户登录成功: studentId={}, role={}", user.getStudentId(), user.getRole());
        return response;
    }

    @Override
    public LoginResponse wechatLogin(String code) {
        // TODO: 实现微信登录逻辑
        // 1. 使用 code 调用微信 API 获取 openid
        // 2. 根据 openid 查询用户或创建新用户
        // 3. 生成 Token
        
        throw new BusinessException("微信登录功能暂未实现");
    }

    @Override
    public LoginResponse adminLogin(LoginRequest request) {
        // 查询用户
        User user = userMapper.selectByStudentId(request.getStudentId());
        if (user == null) {
            throw new BusinessException(401, "账号或密码错误");
        }

        // 检查账号是否启用
        if (user.getEnabled() == null || user.getEnabled() == 0) {
            throw new BusinessException(403, "账号已被禁用");
        }

        // 验证角色（只允许 admin 和 operator 使用此接口）
        if (!"admin".equals(user.getRole()) && !"operator".equals(user.getRole())) {
            throw new BusinessException(403, "请使用学员登录接口");
        }

        // 验证密码
        if (user.getPassword() == null || !PasswordUtil.matches(request.getPassword(), user.getPassword())) {
            throw new BusinessException(401, "账号或密码错误");
        }

        // 生成 Token
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getStudentId(), user.getRole());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId(), user.getStudentId());

        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshToken);
        response.setUser(convertToUserDTO(user));

        log.info("管理员登录成功: studentId={}, role={}", user.getStudentId(), user.getRole());
        return response;
    }

    @Override
    public String refreshToken(String refreshToken) {
        // 验证 Refresh Token
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new BusinessException(401, "刷新令牌无效或已过期");
        }

        // 检查是否为 Refresh Token
        String tokenType = jwtUtil.getTokenType(refreshToken);
        if (!"refresh".equals(tokenType)) {
            throw new BusinessException(401, "无效的令牌类型");
        }

        // 生成新的 Access Token
        Long userId = jwtUtil.getUserIdFromToken(refreshToken);
        String studentId = jwtUtil.getStudentIdFromToken(refreshToken);
        String role = jwtUtil.getRoleFromToken(refreshToken);

        return jwtUtil.generateAccessToken(userId, studentId, role);
    }

    @Override
    public void logout(String token) {
        // TODO: 可以将 token 加入黑名单（需要 Redis 支持）
        // 目前简单实现，客户端删除 token 即可
        log.info("用户退出登录");
    }

    /**
     * 转换为 UserDTO
     */
    private UserDTO convertToUserDTO(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }
}
