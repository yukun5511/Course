package com.course.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.Result;
import com.course.common.annotation.RequireRole;
import com.course.dto.request.ActivityCreateRequest;
import com.course.dto.request.ActivityQueryRequest;
import com.course.dto.request.ActivityUpdateRequest;
import com.course.dto.response.ActivityDTO;
import com.course.dto.response.ActivityRegistrationDTO;
import com.course.service.ActivityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 活动管理控制器
 */
@Tag(name = "活动管理", description = "活动CRUD、报名管理、名单导出等接口")
@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @Operation(summary = "获取活动列表", description = "分页查询活动列表")
    @GetMapping
    public Result<Page<ActivityDTO>> getActivityList(ActivityQueryRequest query) {
        Page<ActivityDTO> result = activityService.getActivityList(query);
        return Result.success(result);
    }

    @Operation(summary = "获取活动详情", description = "根据ID获取活动详情")
    @GetMapping("/{id}")
    public Result<ActivityDTO> getActivityById(@PathVariable Long id) {
        ActivityDTO activity = activityService.getActivityById(id);
        return Result.success(activity);
    }

    @Operation(summary = "创建活动", description = "创建新活动")
    @PostMapping
    @RequireRole({"admin", "operator"})
    public Result<ActivityDTO> createActivity(@Valid @RequestBody ActivityCreateRequest request) {
        ActivityDTO activity = activityService.createActivity(request);
        return Result.success(activity);
    }

    @Operation(summary = "更新活动", description = "更新活动信息")
    @PutMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<ActivityDTO> updateActivity(@PathVariable Long id, @Valid @RequestBody ActivityUpdateRequest request) {
        ActivityDTO activity = activityService.updateActivity(id, request);
        return Result.success(activity);
    }

    @Operation(summary = "删除活动", description = "删除活动")
    @DeleteMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<Void> deleteActivity(@PathVariable Long id) {
        activityService.deleteActivity(id);
        return Result.success();
    }

    @Operation(summary = "报名活动", description = "用户报名活动")
    @PostMapping("/{id}/register")
    public Result<Void> registerActivity(@PathVariable Long id, @RequestBody java.util.Map<String, Long> params) {
        Long userId = params.get("userId");
        activityService.registerActivity(id, userId);
        return Result.success();
    }

    @Operation(summary = "获取报名列表", description = "获取活动报名列表")
    @GetMapping("/{id}/registrations")
    @RequireRole({"admin", "operator"})
    public Result<Page<ActivityRegistrationDTO>> getRegistrationList(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<ActivityRegistrationDTO> result = activityService.getRegistrationList(id, page, size);
        return Result.success(result);
    }

    @Operation(summary = "导出报名名单", description = "导出活动报名名单")
    @GetMapping("/{id}/export")
    @RequireRole({"admin", "operator"})
    public Result<List<ActivityRegistrationDTO>> exportRegistrations(@PathVariable Long id) {
        List<ActivityRegistrationDTO> result = activityService.exportRegistrations(id);
        return Result.success(result);
    }
}
