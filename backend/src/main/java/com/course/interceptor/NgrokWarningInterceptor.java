package com.course.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * Ngrok 浏览器警告跳过拦截器
 * 为所有响应添加 ngrok-skip-browser-warning 头
 */
@Component
public class NgrokWarningInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 添加响应头跳过 ngrok 浏览器警告
        response.setHeader("ngrok-skip-browser-warning", "true");
        return true;
    }
}
