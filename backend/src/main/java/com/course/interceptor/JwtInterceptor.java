package com.course.interceptor;

import com.course.common.exception.BusinessException;
import com.course.utils.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * JWT 认证拦截器
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtInterceptor implements HandlerInterceptor {

    private final JwtUtil jwtUtil;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String requestURI = request.getRequestURI();
        log.debug("JWT拦截器处理请求: {} {}", request.getMethod(), requestURI);
        
        // OPTIONS 请求直接放行
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }
        
        // 排除公开接口（登录、刷新token等）
        if (requestURI.startsWith("/api/auth/login") || 
            requestURI.startsWith("/api/auth/wechat-login") || 
            requestURI.startsWith("/api/auth/admin-login") || 
            requestURI.startsWith("/api/auth/refresh") ||
            requestURI.startsWith("/api/test/")) {
            log.debug("公开接口，跳过认证: {}", requestURI);
            return true;
        }

        // 获取 Authorization header
        String authorization = request.getHeader("Authorization");
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            log.warn("未提供认证令牌: {} {}", request.getMethod(), requestURI);
            throw new BusinessException(401, "未提供认证令牌");
        }

        String token = authorization.substring(7);

        // 验证 Token
        if (!jwtUtil.validateToken(token)) {
            throw new BusinessException(401, "认证令牌无效或已过期");
        }

        // 检查是否为 Access Token
        String tokenType = jwtUtil.getTokenType(token);
        if (!"access".equals(tokenType)) {
            throw new BusinessException(401, "无效的令牌类型");
        }

        // 将用户信息存入 request attribute
        Long userId = jwtUtil.getUserIdFromToken(token);
        String studentId = jwtUtil.getStudentIdFromToken(token);
        String role = jwtUtil.getRoleFromToken(token);

        request.setAttribute("userId", userId);
        request.setAttribute("studentId", studentId);
        request.setAttribute("role", role);

        log.debug("用户认证通过: userId={}, studentId={}, role={}", userId, studentId, role);
        return true;
    }
}
