package com.course.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.Result;
import com.course.common.annotation.RequireRole;
import com.course.dto.request.PopupCreateRequest;
import com.course.dto.request.PopupQueryRequest;
import com.course.dto.request.PopupUpdateRequest;
import com.course.dto.response.PopupMessageDTO;
import com.course.service.PopupService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 弹窗消息控制器
 */
@Tag(name = "消息管理", description = "弹窗消息CRUD、发布、撤销等接口")
@RestController
@RequestMapping("/api/popups")
@RequiredArgsConstructor
public class PopupController {

    private final PopupService popupService;

    @Operation(summary = "获取弹窗列表", description = "分页查询弹窗列表")
    @GetMapping
    @RequireRole({"admin", "operator"})
    public Result<Page<PopupMessageDTO>> getPopupList(PopupQueryRequest query) {
        Page<PopupMessageDTO> result = popupService.getPopupList(query);
        return Result.success(result);
    }

    @Operation(summary = "获取弹窗详情", description = "根据ID获取弹窗详情")
    @GetMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<PopupMessageDTO> getPopupById(@PathVariable Long id) {
        PopupMessageDTO popup = popupService.getPopupById(id);
        return Result.success(popup);
    }

    @Operation(summary = "创建弹窗", description = "创建新弹窗消息")
    @PostMapping
    @RequireRole({"admin", "operator"})
    public Result<PopupMessageDTO> createPopup(@Valid @RequestBody PopupCreateRequest request) {
        PopupMessageDTO popup = popupService.createPopup(request);
        return Result.success(popup);
    }

    @Operation(summary = "更新弹窗", description = "更新弹窗消息")
    @PutMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<PopupMessageDTO> updatePopup(@PathVariable Long id, @Valid @RequestBody PopupUpdateRequest request) {
        PopupMessageDTO popup = popupService.updatePopup(id, request);
        return Result.success(popup);
    }

    @Operation(summary = "删除弹窗", description = "删除弹窗消息")
    @DeleteMapping("/{id}")
    @RequireRole({"admin", "operator"})
    public Result<Void> deletePopup(@PathVariable Long id) {
        popupService.deletePopup(id);
        return Result.success();
    }

    @Operation(summary = "发布弹窗", description = "发布弹窗消息")
    @PostMapping("/{id}/publish")
    @RequireRole({"admin", "operator"})
    public Result<Void> publishPopup(@PathVariable Long id, @RequestBody Map<String, Long> params) {
        Long userId = params.get("userId");
        popupService.publishPopup(id, userId);
        return Result.success();
    }

    @Operation(summary = "撤销弹窗", description = "撤销已发布的弹窗")
    @PostMapping("/{id}/revoke")
    @RequireRole({"admin", "operator"})
    public Result<Void> revokePopup(@PathVariable Long id) {
        popupService.revokePopup(id);
        return Result.success();
    }

    @Operation(summary = "获取已发布弹窗", description = "小程序端获取已发布的弹窗")
    @GetMapping("/published")
    public Result<Page<PopupMessageDTO>> getPublishedPopups(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        Page<PopupMessageDTO> result = popupService.getPublishedPopups(page, size);
        return Result.success(result);
    }
}
