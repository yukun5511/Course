package com.course.controller;

import com.course.common.Result;
import com.course.utils.PasswordUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 临时测试控制器 - 用于生成密码哈希
 * 注意：生产环境必须删除此控制器！
 */
@Tag(name = "测试工具", description = "临时测试接口")
@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    @Operation(summary = "健康检查", description = "测试API是否正常运行")
    @GetMapping("/ping")
    public Result<String> ping() {
        return Result.success("pong");
    }

    @Operation(summary = "生成密码哈希", description = "临时接口：生成BCrypt密码哈希")
    @GetMapping("/generate-password")
    public Result<String> generatePassword(@RequestParam String password) {
        String hash = PasswordUtil.encode(password);
        return Result.success(hash);
    }
    
    @Operation(summary = "验证密码", description = "临时接口：验证密码是否匹配")
    @GetMapping("/verify-password")
    public Result<Boolean> verifyPassword(
            @RequestParam String password,
            @RequestParam String hash) {
        boolean matches = PasswordUtil.matches(password, hash);
        return Result.success(matches);
    }
}
