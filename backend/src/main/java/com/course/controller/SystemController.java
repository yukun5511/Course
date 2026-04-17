package com.course.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.Result;
import com.course.common.annotation.RequireRole;
import com.course.entity.*;
import com.course.mapper.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 系统管理控制器
 */
@Tag(name = "系统管理", description = "角色、菜单、配置、日志管理接口")
@RestController
@RequestMapping("/api/system")
@RequiredArgsConstructor
public class SystemController {

    private final RoleMapper roleMapper;
    private final MenuMapper menuMapper;
    private final SystemConfigMapper configMapper;
    private final OperationLogMapper logMapper;

    // ==================== 角色管理 ====================

    @Operation(summary = "获取角色列表")
    @GetMapping("/roles")
    @RequireRole({"admin"})
    public Result<List<Role>> getRoles() {
        List<Role> roles = roleMapper.selectList(null);
        return Result.success(roles);
    }

    @Operation(summary = "创建角色")
    @PostMapping("/roles")
    @RequireRole({"admin"})
    public Result<Role> createRole(@RequestBody Role role) {
        role.setCreatedAt(LocalDateTime.now());
        roleMapper.insert(role);
        return Result.success(role);
    }

    @Operation(summary = "更新角色")
    @PutMapping("/roles/{id}")
    @RequireRole({"admin"})
    public Result<Role> updateRole(@PathVariable Long id, @RequestBody Role role) {
        role.setId(id);
        roleMapper.updateById(role);
        return Result.success(role);
    }

    @Operation(summary = "删除角色")
    @DeleteMapping("/roles/{id}")
    @RequireRole({"admin"})
    public Result<Void> deleteRole(@PathVariable Long id) {
        roleMapper.deleteById(id);
        return Result.success();
    }

    // ==================== 菜单管理 ====================

    @Operation(summary = "获取菜单列表")
    @GetMapping("/menus")
    @RequireRole({"admin"})
    public Result<List<Menu>> getMenus() {
        List<Menu> menus = menuMapper.selectList(null);
        return Result.success(menus);
    }

    @Operation(summary = "创建菜单")
    @PostMapping("/menus")
    @RequireRole({"admin"})
    public Result<Menu> createMenu(@RequestBody Menu menu) {
        menu.setCreatedAt(LocalDateTime.now());
        menuMapper.insert(menu);
        return Result.success(menu);
    }

    @Operation(summary = "更新菜单")
    @PutMapping("/menus/{id}")
    @RequireRole({"admin"})
    public Result<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        menu.setId(id);
        menuMapper.updateById(menu);
        return Result.success(menu);
    }

    @Operation(summary = "删除菜单")
    @DeleteMapping("/menus/{id}")
    @RequireRole({"admin"})
    public Result<Void> deleteMenu(@PathVariable Long id) {
        menuMapper.deleteById(id);
        return Result.success();
    }

    // ==================== 参数设置 ====================

    @Operation(summary = "获取系统配置列表")
    @GetMapping("/configs")
    @RequireRole({"admin"})
    public Result<List<SystemConfig>> getConfigs() {
        List<SystemConfig> configs = configMapper.selectList(null);
        return Result.success(configs);
    }

    @Operation(summary = "更新系统配置")
    @PutMapping("/configs/{key}")
    @RequireRole({"admin"})
    public Result<SystemConfig> updateConfig(@PathVariable String key, @RequestBody Map<String, String> params) {
        SystemConfig config = configMapper.selectOne(
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<SystemConfig>()
                .eq(SystemConfig::getKey, key)
        );
        
        if (config == null) {
            config = new SystemConfig();
            config.setKey(key);
        }
        
        config.setValue(params.get("value"));
        config.setDescription(params.get("description"));
        config.setUpdatedAt(LocalDateTime.now());
        
        if (config.getId() == null) {
            configMapper.insert(config);
        } else {
            configMapper.updateById(config);
        }
        
        return Result.success(config);
    }

    // ==================== 日志管理 ====================

    @Operation(summary = "获取操作日志列表")
    @GetMapping("/logs")
    @RequireRole({"admin"})
    public Result<Page<OperationLog>> getLogs(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String action) {
        
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<OperationLog> wrapper = 
            new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        
        if (userId != null) {
            wrapper.eq(OperationLog::getUserId, userId);
        }
        if (action != null && !action.isEmpty()) {
            wrapper.like(OperationLog::getAction, action);
        }
        
        wrapper.orderByDesc(OperationLog::getCreatedAt);
        
        Page<OperationLog> logPage = new Page<>(page, size);
        Page<OperationLog> result = logMapper.selectPage(logPage, wrapper);
        
        return Result.success(result);
    }

    @Operation(summary = "记录操作日志")
    @PostMapping("/logs")
    public Result<OperationLog> createLog(@RequestBody OperationLog log) {
        log.setCreatedAt(LocalDateTime.now());
        logMapper.insert(log);
        return Result.success(log);
    }
}
