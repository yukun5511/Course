package com.course.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.Result;
import com.course.common.annotation.RequireRole;
import com.course.dto.request.ExchangeRequest;
import com.course.dto.request.ShopItemCreateRequest;
import com.course.dto.request.ShopItemQueryRequest;
import com.course.dto.request.ShopItemUpdateRequest;
import com.course.dto.response.ExchangeRecordDTO;
import com.course.dto.response.ShopItemDTO;
import com.course.service.ShopService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 积分商城控制器
 */
@Tag(name = "积分商城管理", description = "商品管理、兑换管理、积分流水等接口")
@RestController
@RequestMapping("/api/shop")
@RequiredArgsConstructor
public class ShopController {

    private final ShopService shopService;

    @Operation(summary = "获取商品列表", description = "分页查询商品列表")
    @GetMapping("/items")
    public Result<Page<ShopItemDTO>> getItemList(ShopItemQueryRequest query) {
        Page<ShopItemDTO> result = shopService.getItemList(query);
        return Result.success(result);
    }

    @Operation(summary = "获取商品详情", description = "根据ID获取商品详情")
    @GetMapping("/items/{id}")
    public Result<ShopItemDTO> getItemById(@PathVariable Long id) {
        ShopItemDTO item = shopService.getItemById(id);
        return Result.success(item);
    }

    @Operation(summary = "创建商品", description = "创建新商品")
    @PostMapping("/items")
    @RequireRole({"admin", "operator"})
    public Result<ShopItemDTO> createItem(@Valid @RequestBody ShopItemCreateRequest request) {
        ShopItemDTO item = shopService.createItem(request);
        return Result.success(item);
    }

    @Operation(summary = "更新商品", description = "更新商品信息")
    @PutMapping("/items/{id}")
    @RequireRole({"admin", "operator"})
    public Result<ShopItemDTO> updateItem(@PathVariable Long id, @Valid @RequestBody ShopItemUpdateRequest request) {
        ShopItemDTO item = shopService.updateItem(id, request);
        return Result.success(item);
    }

    @Operation(summary = "删除商品", description = "删除商品")
    @DeleteMapping("/items/{id}")
    @RequireRole({"admin", "operator"})
    public Result<Void> deleteItem(@PathVariable Long id) {
        shopService.deleteItem(id);
        return Result.success();
    }

    @Operation(summary = "上架/下架商品", description = "更新商品可用状态")
    @PatchMapping("/items/{id}/available")
    @RequireRole({"admin", "operator"})
    public Result<Void> updateAvailable(@PathVariable Long id, @RequestBody Map<String, Integer> params) {
        shopService.updateAvailable(id, params.get("available"));
        return Result.success();
    }

    @Operation(summary = "兑换商品", description = "用户兑换商品")
    @PostMapping("/exchange")
    public Result<Void> exchangeItem(@Valid @RequestBody ExchangeRequest request) {
        shopService.exchangeItem(request);
        return Result.success();
    }

    @Operation(summary = "获取兑换记录", description = "获取兑换记录列表")
    @GetMapping("/exchanges")
    @RequireRole({"admin", "operator"})
    public Result<Page<ExchangeRecordDTO>> getExchangeRecords(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(required = false) Long userId) {
        Page<ExchangeRecordDTO> result = shopService.getExchangeRecords(page, size, userId);
        return Result.success(result);
    }
}
