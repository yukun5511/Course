package com.course.utils;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

/**
 * JWT工具类单元测试
 */
class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // 设置测试配置
        ReflectionTestUtils.setField(jwtUtil, "secret", "test-secret-key-for-jwt-token-generation-must-be-long-enough");
        ReflectionTestUtils.setField(jwtUtil, "accessTokenExpiration", 3600000L); // 1小时
        ReflectionTestUtils.setField(jwtUtil, "refreshTokenExpiration", 86400000L); // 24小时
    }

    @Test
    void testGenerateAccessToken() {
        // 生成Access Token
        String token = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        
        // 验证Token不为空
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testGenerateRefreshToken() {
        // 生成Refresh Token
        String token = jwtUtil.generateRefreshToken(1L, "STU001");
        
        // 验证Token不为空
        assertNotNull(token);
        assertTrue(token.length() > 0);
    }

    @Test
    void testParseAccessToken() {
        // 生成并解析Access Token
        String token = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        
        // 验证解析成功
        assertDoesNotThrow(() -> jwtUtil.parseToken(token));
    }

    @Test
    void testValidateToken() {
        // 生成有效Token
        String validToken = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        
        // 验证Token有效
        assertTrue(jwtUtil.validateToken(validToken));
        
        // 验证无效Token
        String invalidToken = "invalid.token.here";
        assertFalse(jwtUtil.validateToken(invalidToken));
    }

    @Test
    void testGetUserIdFromToken() {
        // 生成Token
        String token = jwtUtil.generateAccessToken(123L, "STU001", "STUDENT");
        
        // 提取用户ID
        Long userId = jwtUtil.getUserIdFromToken(token);
        
        // 验证用户ID正确
        assertEquals(123L, userId);
    }

    @Test
    void testGetStudentIdFromToken() {
        // 生成Token
        String token = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        
        // 提取学号
        String studentId = jwtUtil.getStudentIdFromToken(token);
        
        // 验证学号正确
        assertEquals("STU001", studentId);
    }

    @Test
    void testGetRoleFromToken() {
        // 生成Token
        String token = jwtUtil.generateAccessToken(1L, "STU001", "ADMIN");
        
        // 提取角色
        String role = jwtUtil.getRoleFromToken(token);
        
        // 验证角色正确
        assertEquals("ADMIN", role);
    }

    @Test
    void testGetTokenType() {
        // 生成Access Token
        String accessToken = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        assertEquals("access", jwtUtil.getTokenType(accessToken));
        
        // 生成Refresh Token
        String refreshToken = jwtUtil.generateRefreshToken(1L, "STU001");
        assertEquals("refresh", jwtUtil.getTokenType(refreshToken));
    }

    @Test
    void testIsTokenExpired() {
        // 生成有效Token（未过期）
        String validToken = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        
        // 验证Token未过期
        assertFalse(jwtUtil.isTokenExpired(validToken));
        
        // 验证无效Token返回true（视为过期）
        String invalidToken = "invalid.token.here";
        assertTrue(jwtUtil.isTokenExpired(invalidToken));
    }

    @Test
    void testDifferentTokensHaveDifferentContent() {
        // 生成两个不同的Token
        String token1 = jwtUtil.generateAccessToken(1L, "STU001", "STUDENT");
        String token2 = jwtUtil.generateAccessToken(2L, "STU002", "TEACHER");
        
        // 验证Token不同
        assertNotEquals(token1, token2);
        
        // 验证内容不同
        assertNotEquals(jwtUtil.getUserIdFromToken(token1), jwtUtil.getUserIdFromToken(token2));
        assertNotEquals(jwtUtil.getStudentIdFromToken(token1), jwtUtil.getStudentIdFromToken(token2));
        assertNotEquals(jwtUtil.getRoleFromToken(token1), jwtUtil.getRoleFromToken(token2));
    }
}
