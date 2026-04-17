package com.course.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.dto.request.ExchangeRequest;
import com.course.dto.request.ShopItemCreateRequest;
import com.course.dto.request.ShopItemQueryRequest;
import com.course.dto.request.ShopItemUpdateRequest;
import com.course.dto.response.ExchangeRecordDTO;
import com.course.dto.response.ShopItemDTO;
import com.course.entity.ShopItem;
import com.course.entity.ExchangeRecord;
import com.course.mapper.ShopItemMapper;
import com.course.mapper.ExchangeRecordMapper;
import com.course.mapper.UserMapper;
import com.course.service.impl.ShopServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 积分商城服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class ShopServiceImplTest {

    @Mock
    private ShopItemMapper shopItemMapper;

    @Mock
    private ExchangeRecordMapper exchangeRecordMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private ShopServiceImpl shopService;

    private ShopItem testItem;
    private ShopItemCreateRequest createRequest;

    @BeforeEach
    void setUp() {
        // 准备测试数据
        testItem = new ShopItem();
        testItem.setId(1L);
        testItem.setName("测试商品");
        testItem.setType("course");
        testItem.setBadgeCost(100);
        testItem.setStock(50);
        testItem.setAvailable(1);
        testItem.setDescription("这是一个测试商品");
        testItem.setCreatedAt(LocalDateTime.now());

        createRequest = new ShopItemCreateRequest();
        createRequest.setName("新商品");
        createRequest.setType("badge");
        createRequest.setBadgeCost(50);
        createRequest.setStock(100);
        createRequest.setDescription("新商品描述");
    }

    @Test
    void testCreateItem() {
        // 模拟Mapper行为
        when(shopItemMapper.insert(any(ShopItem.class))).thenAnswer(invocation -> {
            ShopItem item = invocation.getArgument(0);
            item.setId(1L);
            return 1;
        });

        // 执行测试
        ShopItemDTO result = shopService.createItem(createRequest);

        // 验证结果
        assertNotNull(result);
        assertEquals("新商品", result.getName());
        assertEquals("badge", result.getType());
        assertEquals(50, result.getBadgeCost());
        assertEquals(100, result.getStock());

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).insert(any(ShopItem.class));
    }

    @Test
    void testGetItemById_Success() {
        // 模拟Mapper行为
        when(shopItemMapper.selectById(1L)).thenReturn(testItem);

        // 执行测试
        ShopItemDTO result = shopService.getItemById(1L);

        // 验证结果
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试商品", result.getName());
        assertEquals(100, result.getBadgeCost());

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).selectById(1L);
    }

    @Test
    void testGetItemById_NotFound() {
        // 模拟商品不存在
        when(shopItemMapper.selectById(999L)).thenReturn(null);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            shopService.getItemById(999L);
        });

        assertEquals("商品不存在", exception.getMessage());
    }

    @Test
    void testUpdateItem_Success() {
        // 准备更新请求
        ShopItemUpdateRequest updateRequest = new ShopItemUpdateRequest();
        updateRequest.setName("更新后的商品");
        updateRequest.setBadgeCost(200);
        updateRequest.setStock(30);
        updateRequest.setDescription("更新后的描述");

        // 模拟Mapper行为
        when(shopItemMapper.selectById(1L)).thenReturn(testItem);
        when(shopItemMapper.updateById(any(ShopItem.class))).thenReturn(1);

        // 执行测试
        ShopItemDTO result = shopService.updateItem(1L, updateRequest);

        // 验证结果
        assertNotNull(result);
        assertEquals("更新后的商品", result.getName());
        assertEquals(200, result.getBadgeCost());
        assertEquals(30, result.getStock());

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).selectById(1L);
        verify(shopItemMapper, times(1)).updateById(any(ShopItem.class));
    }

    @Test
    void testUpdateItem_NotFound() {
        // 模拟商品不存在
        when(shopItemMapper.selectById(999L)).thenReturn(null);

        ShopItemUpdateRequest updateRequest = new ShopItemUpdateRequest();
        updateRequest.setName("更新后的商品");

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            shopService.updateItem(999L, updateRequest);
        });

        assertEquals("商品不存在", exception.getMessage());
    }

    @Test
    void testDeleteItem_Success() {
        // 模拟Mapper行为
        when(shopItemMapper.selectById(1L)).thenReturn(testItem);
        when(shopItemMapper.deleteById(1L)).thenReturn(1);

        // 执行测试
        assertDoesNotThrow(() -> shopService.deleteItem(1L));

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).selectById(1L);
        verify(shopItemMapper, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteItem_NotFound() {
        // 模拟商品不存在
        when(shopItemMapper.selectById(999L)).thenReturn(null);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            shopService.deleteItem(999L);
        });

        assertEquals("商品不存在", exception.getMessage());
    }

    @Test
    void testUpdateAvailable() {
        // 模拟Mapper行为
        when(shopItemMapper.selectById(1L)).thenReturn(testItem);
        when(shopItemMapper.updateById(any(ShopItem.class))).thenReturn(1);

        // 执行测试 - 上架
        assertDoesNotThrow(() -> shopService.updateAvailable(1L, 1));

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).selectById(1L);
        verify(shopItemMapper, times(1)).updateById(any(ShopItem.class));
    }

    @Test
    void testGetItemList() {
        // 准备测试数据
        Page<ShopItem> itemPage = new Page<>(1, 10, 1);
        itemPage.setRecords(java.util.List.of(testItem));

        // 模拟Mapper行为
        when(shopItemMapper.selectPage(any(Page.class), any(LambdaQueryWrapper.class)))
                .thenReturn(itemPage);

        // 准备查询请求
        ShopItemQueryRequest query = new ShopItemQueryRequest();
        query.setPage(1);
        query.setSize(10);
        query.setName("测试");

        // 执行测试
        Page<ShopItemDTO> result = shopService.getItemList(query);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.getTotal());
        assertEquals(1, result.getRecords().size());
        assertEquals("测试商品", result.getRecords().get(0).getName());

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).selectPage(any(Page.class), any(LambdaQueryWrapper.class));
    }

    @Test
    void testExchangeItem_Success() {
        // 准备兑换请求
        ExchangeRequest request = new ExchangeRequest();
        request.setItemId(1L);
        request.setUserId(100L);

        // 模拟Mapper行为
        com.course.entity.User mockUser = new com.course.entity.User();
        mockUser.setId(100L);
        mockUser.setBadges(500);
        
        when(shopItemMapper.selectById(1L)).thenReturn(testItem);
        when(userMapper.selectById(100L)).thenReturn(mockUser);
        when(exchangeRecordMapper.insert(any(ExchangeRecord.class))).thenReturn(1);

        // 执行测试
        assertDoesNotThrow(() -> shopService.exchangeItem(request));

        // 验证Mapper被调用
        verify(shopItemMapper, times(1)).selectById(1L);
        verify(userMapper, times(1)).selectById(100L);
        verify(exchangeRecordMapper, times(1)).insert(any(ExchangeRecord.class));
    }

    @Test
    void testExchangeItem_NotFound() {
        // 模拟商品不存在
        when(shopItemMapper.selectById(999L)).thenReturn(null);

        ExchangeRequest request = new ExchangeRequest();
        request.setItemId(999L);
        request.setUserId(100L);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            shopService.exchangeItem(request);
        });

        assertEquals("商品不存在", exception.getMessage());
    }

    @Test
    void testExchangeItem_OutOfStock() {
        // 模拟库存不足
        ShopItem outOfStockItem = new ShopItem();
        outOfStockItem.setId(1L);
        outOfStockItem.setName("缺货商品");
        outOfStockItem.setStock(0);
        outOfStockItem.setAvailable(1);

        when(shopItemMapper.selectById(1L)).thenReturn(outOfStockItem);

        ExchangeRequest request = new ExchangeRequest();
        request.setItemId(1L);
        request.setUserId(100L);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            shopService.exchangeItem(request);
        });

        assertEquals("商品库存不足", exception.getMessage());
    }

    @Test
    void testExchangeItem_NotAvailable() {
        // 模拟商品已下架
        ShopItem unavailableItem = new ShopItem();
        unavailableItem.setId(1L);
        unavailableItem.setName("下架商品");
        unavailableItem.setStock(50);
        unavailableItem.setAvailable(0);

        when(shopItemMapper.selectById(1L)).thenReturn(unavailableItem);

        ExchangeRequest request = new ExchangeRequest();
        request.setItemId(1L);
        request.setUserId(100L);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            shopService.exchangeItem(request);
        });

        assertEquals("商品已下架", exception.getMessage());
    }
}
