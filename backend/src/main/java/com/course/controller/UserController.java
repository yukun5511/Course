package com.course.controller;

import com.course.common.PageResult;
import com.course.common.Result;
import com.course.common.annotation.RequireRole;
import com.course.dto.request.UserCreateRequest;
import com.course.dto.request.UserQueryRequest;
import com.course.dto.request.UserUpdateRequest;
import com.course.dto.response.UserDTO;
import com.course.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 用户管理控制器
 */
@Tag(name = "用户管理", description = "用户CRUD、状态管理、积分管理等接口")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @Operation(summary = "获取用户列表", description = "分页查询用户列表")
    @GetMapping
    @RequireRole({"admin", "operator"})
    public Result<PageResult<UserDTO>> getUserList(UserQueryRequest query) {
        PageResult<UserDTO> result = userService.getUserList(query);
        return Result.success(result);
    }

    @Operation(summary = "获取用户详情", description = "根据ID获取用户详情")
    @GetMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return Result.success(user);
    }

    @Operation(summary = "创建用户", description = "创建新用户")
    @PostMapping
    @RequireRole({"admin", "operator"})
    public Result<UserDTO> createUser(@Valid @RequestBody UserCreateRequest request) {
        UserDTO user = userService.createUser(request);
        return Result.success(user);
    }

    @Operation(summary = "更新用户信息", description = "更新用户基本信息")
    @PutMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<UserDTO> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        UserDTO user = userService.updateUser(id, request);
        return Result.success(user);
    }

    @Operation(summary = "删除用户", description = "删除用户")
    @DeleteMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return Result.success();
    }

    @Operation(summary = "更新用户状态", description = "更新用户状态（在读/结业/退学）")
    @PatchMapping("/{id}/status")
    @RequireRole({"admin", "operator"})
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody Map<String, String> params) {
        userService.updateStatus(id, params.get("status"));
        return Result.success();
    }

    @Operation(summary = "修改用户积分", description = "修改用户积分")
    @PatchMapping("/{id}/points")
    @RequireRole({"admin", "operator"})
    public Result<Void> updatePoints(@PathVariable Long id, @RequestBody Map<String, Integer> params) {
        userService.updatePoints(id, params.get("points"));
        return Result.success();
    }

    @Operation(summary = "启用/禁用账号", description = "启用或禁用用户账号")
    @PatchMapping("/{id}/enabled")
    @RequireRole({"admin", "operator"})
    public Result<Void> updateEnabled(@PathVariable Long id, @RequestBody Map<String, Integer> params) {
        userService.updateEnabled(id, params.get("enabled"));
        return Result.success();
    }

    @Operation(summary = "重置密码", description = "重置用户密码")
    @PostMapping("/{id}/reset-password")
    @RequireRole({"admin", "operator"})
    public Result<Void> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> params) {
        userService.resetPassword(id, params.get("newPassword"));
        return Result.success();
    }
}
