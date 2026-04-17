package com.course.service;

import com.course.common.exception.BusinessException;
import com.course.dto.request.LoginRequest;
import com.course.dto.response.LoginResponse;
import com.course.entity.User;
import com.course.mapper.UserMapper;
import com.course.service.impl.AuthServiceImpl;
import com.course.utils.JwtUtil;
import com.course.utils.PasswordUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 认证服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private User testStudent;
    private User testAdmin;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // 准备学生用户
        testStudent = new User();
        testStudent.setId(1L);
        testStudent.setStudentId("STU001");
        testStudent.setName("测试学生");
        testStudent.setRole("student");
        testStudent.setPassword("$2a$10$hashedpassword"); // 模拟加密密码
        testStudent.setEnabled(1);
        testStudent.setCreatedAt(LocalDateTime.now());

        // 准备管理员用户
        testAdmin = new User();
        testAdmin.setId(2L);
        testAdmin.setStudentId("ADMIN001");
        testAdmin.setName("测试管理员");
        testAdmin.setRole("admin");
        testAdmin.setPassword("$2a$10$hashedpassword");
        testAdmin.setEnabled(1);
        testAdmin.setCreatedAt(LocalDateTime.now());

        // 准备登录请求
        loginRequest = new LoginRequest();
        loginRequest.setStudentId("STU001");
        loginRequest.setPassword("password123");
    }

    @Test
    void testStudentLogin_Success() {
        // 模拟Mapper和工具类行为
        when(userMapper.selectByStudentId("STU001")).thenReturn(testStudent);
        try (MockedStatic<PasswordUtil> mockedPasswordUtil = mockStatic(PasswordUtil.class)) {
            mockedPasswordUtil.when(() -> PasswordUtil.matches("password123", "$2a$10$hashedpassword"))
                    .thenReturn(true);
            when(jwtUtil.generateAccessToken(eq(1L), eq("STU001"), eq("student")))
                    .thenReturn("access-token");
            when(jwtUtil.generateRefreshToken(eq(1L), eq("STU001")))
                    .thenReturn("refresh-token");

            // 执行测试
            LoginRequest request = new LoginRequest();
            request.setStudentId("STU001");
            request.setPassword("password123");
            
            LoginResponse result = authService.login(request);

            // 验证结果
            assertNotNull(result);
            assertEquals("access-token", result.getAccessToken());
            assertEquals("refresh-token", result.getRefreshToken());
            assertNotNull(result.getUser());
            assertEquals("STU001", result.getUser().getStudentId());

            // 验证调用
            verify(userMapper, times(1)).selectByStudentId("STU001");
            verify(jwtUtil, times(1)).generateAccessToken(1L, "STU001", "student");
        }
    }

    @Test
    void testStudentLogin_UserNotFound() {
        // 模拟用户不存在
        when(userMapper.selectByStudentId("NOTEXIST")).thenReturn(null);

        // 执行测试并验证异常
        LoginRequest request = new LoginRequest();
        request.setStudentId("NOTEXIST");
        request.setPassword("password123");
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.login(request);
        });

        assertEquals("学号或密码错误", exception.getMessage());
    }

    @Test
    void testStudentLogin_UserDisabled() {
        // 模拟用户被禁用
        User disabledUser = new User();
        disabledUser.setId(1L);
        disabledUser.setStudentId("STU001");
        disabledUser.setRole("student");
        disabledUser.setEnabled(0);
        
        when(userMapper.selectByStudentId("STU001")).thenReturn(disabledUser);

        // 执行测试并验证异常
        LoginRequest request = new LoginRequest();
        request.setStudentId("STU001");
        request.setPassword("password123");
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.login(request);
        });

        assertEquals("账号已被禁用", exception.getMessage());
    }

    @Test
    void testStudentLogin_WrongRole() {
        // 模拟管理员使用学生登录接口
        when(userMapper.selectByStudentId("ADMIN001")).thenReturn(testAdmin);

        // 执行测试并验证异常
        LoginRequest request = new LoginRequest();
        request.setStudentId("ADMIN001");
        request.setPassword("password123");
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.login(request);
        });

        assertEquals("请使用管理员登录接口", exception.getMessage());
    }

    @Test
    void testStudentLogin_WrongPassword() {
        // 模拟密码错误
        when(userMapper.selectByStudentId("STU001")).thenReturn(testStudent);
        try (MockedStatic<PasswordUtil> mockedPasswordUtil = mockStatic(PasswordUtil.class)) {
            mockedPasswordUtil.when(() -> PasswordUtil.matches("wrongpassword", "$2a$10$hashedpassword"))
                    .thenReturn(false);

            // 执行测试并验证异常
            LoginRequest request = new LoginRequest();
            request.setStudentId("STU001");
            request.setPassword("wrongpassword");
            
            BusinessException exception = assertThrows(BusinessException.class, () -> {
                authService.login(request);
            });

            assertEquals("学号或密码错误", exception.getMessage());
        }
    }

    @Test
    void testAdminLogin_Success() {
        // 模拟Mapper和工具类行为
        when(userMapper.selectByStudentId("ADMIN001")).thenReturn(testAdmin);
        try (MockedStatic<PasswordUtil> mockedPasswordUtil = mockStatic(PasswordUtil.class)) {
            mockedPasswordUtil.when(() -> PasswordUtil.matches("password123", "$2a$10$hashedpassword"))
                    .thenReturn(true);
            when(jwtUtil.generateAccessToken(eq(2L), eq("ADMIN001"), eq("admin")))
                    .thenReturn("admin-access-token");
            when(jwtUtil.generateRefreshToken(eq(2L), eq("ADMIN001")))
                    .thenReturn("admin-refresh-token");

            // 执行测试
            LoginRequest request = new LoginRequest();
            request.setStudentId("ADMIN001");
            request.setPassword("password123");
            
            LoginResponse result = authService.adminLogin(request);

            // 验证结果
            assertNotNull(result);
            assertEquals("admin-access-token", result.getAccessToken());
            assertEquals("admin-refresh-token", result.getRefreshToken());

            // 验证调用
            verify(userMapper, times(1)).selectByStudentId("ADMIN001");
            verify(jwtUtil, times(1)).generateAccessToken(2L, "ADMIN001", "admin");
        }
    }

    @Test
    void testAdminLogin_StudentUsingAdminInterface() {
        // 模拟学生使用管理员登录接口
        when(userMapper.selectByStudentId("STU001")).thenReturn(testStudent);

        // 执行测试并验证异常
        LoginRequest request = new LoginRequest();
        request.setStudentId("STU001");
        request.setPassword("password123");
        
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.adminLogin(request);
        });

        assertEquals("请使用学员登录接口", exception.getMessage());
    }

    @Test
    void testWechatLogin_NotImplemented() {
        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            authService.wechatLogin("wechat-code");
        });

        assertEquals("微信登录功能暂未实现", exception.getMessage());
    }
}
