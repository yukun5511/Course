package com.course.interceptor;

import com.course.common.annotation.RequireRole;
import com.course.common.exception.BusinessException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;

/**
 * 角色权限拦截器
 */
@Slf4j
@Component
public class RoleInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 只处理方法级别的注解
        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);

        // 如果没有 @RequireRole 注解，放行
        if (requireRole == null) {
            return true;
        }

        // 获取用户角色
        String userRole = (String) request.getAttribute("role");
        if (userRole == null) {
            throw new BusinessException(401, "未认证用户");
        }

        // 检查用户角色是否在允许的角色列表中
        String[] allowedRoles = requireRole.value();
        boolean hasPermission = Arrays.asList(allowedRoles).contains(userRole);

        if (!hasPermission) {
            log.warn("用户角色 {} 无权访问 {}", userRole, request.getRequestURI());
            throw new BusinessException(403, "权限不足，无法访问");
        }

        log.debug("角色权限验证通过: role={}, uri={}", userRole, request.getRequestURI());
        return true;
    }
}
