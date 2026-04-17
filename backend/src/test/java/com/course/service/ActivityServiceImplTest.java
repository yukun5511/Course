package com.course.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.dto.request.ActivityCreateRequest;
import com.course.dto.request.ActivityQueryRequest;
import com.course.dto.request.ActivityUpdateRequest;
import com.course.dto.response.ActivityDTO;
import com.course.entity.Activity;
import com.course.entity.ActivityRegistration;
import com.course.mapper.ActivityMapper;
import com.course.mapper.ActivityRegistrationMapper;
import com.course.mapper.UserMapper;
import com.course.service.impl.ActivityServiceImpl;
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
 * 活动服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class ActivityServiceImplTest {

    @Mock
    private ActivityMapper activityMapper;

    @Mock
    private ActivityRegistrationMapper registrationMapper;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private ActivityServiceImpl activityService;

    private Activity testActivity;
    private ActivityCreateRequest createRequest;
    private ActivityUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        // 准备测试数据
        testActivity = new Activity();
        testActivity.setId(1L);
        testActivity.setTitle("测试活动");
        testActivity.setContent("这是一个测试活动");
        testActivity.setOnCarousel(1);
        testActivity.setCreatedBy(1L);
        testActivity.setCreatedAt(LocalDateTime.now());

        createRequest = new ActivityCreateRequest();
        createRequest.setTitle("新活动");
        createRequest.setContent("新活动内容");
        createRequest.setOnCarousel(0);

        updateRequest = new ActivityUpdateRequest();
        updateRequest.setTitle("更新后的活动");
        updateRequest.setContent("更新后的内容");
        updateRequest.setOnCarousel(1);
    }

    @Test
    void testCreateActivity() {
        // 模拟Mapper行为
        when(activityMapper.insert(any(Activity.class))).thenAnswer(invocation -> {
            Activity activity = invocation.getArgument(0);
            activity.setId(1L);
            return 1;
        });

        // 执行测试
        ActivityDTO result = activityService.createActivity(createRequest);

        // 验证结果
        assertNotNull(result);
        assertEquals("新活动", result.getTitle());
        assertEquals("新活动内容", result.getContent());
        assertEquals(0, result.getOnCarousel());

        // 验证Mapper被调用
        verify(activityMapper, times(1)).insert(any(Activity.class));
    }

    @Test
    void testGetActivityById_Success() {
        // 模拟Mapper行为
        when(activityMapper.selectById(1L)).thenReturn(testActivity);
        when(registrationMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(10L);

        // 执行测试
        ActivityDTO result = activityService.getActivityById(1L);

        // 验证结果
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试活动", result.getTitle());
        assertEquals(10, result.getRegistrationCount());

        // 验证Mapper被调用
        verify(activityMapper, times(1)).selectById(1L);
        verify(registrationMapper, times(1)).selectCount(any(LambdaQueryWrapper.class));
    }

    @Test
    void testGetActivityById_NotFound() {
        // 模拟活动不存在
        when(activityMapper.selectById(999L)).thenReturn(null);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            activityService.getActivityById(999L);
        });

        assertEquals("活动不存在", exception.getMessage());
    }

    @Test
    void testUpdateActivity_Success() {
        // 模拟Mapper行为
        when(activityMapper.selectById(1L)).thenReturn(testActivity);
        when(activityMapper.updateById(any(Activity.class))).thenReturn(1);

        // 执行测试
        ActivityDTO result = activityService.updateActivity(1L, updateRequest);

        // 验证结果
        assertNotNull(result);
        assertEquals("更新后的活动", result.getTitle());
        assertEquals("更新后的内容", result.getContent());
        assertEquals(1, result.getOnCarousel());

        // 验证Mapper被调用
        verify(activityMapper, times(1)).selectById(1L);
        verify(activityMapper, times(1)).updateById(any(Activity.class));
    }

    @Test
    void testUpdateActivity_NotFound() {
        // 模拟活动不存在
        when(activityMapper.selectById(999L)).thenReturn(null);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            activityService.updateActivity(999L, updateRequest);
        });

        assertEquals("活动不存在", exception.getMessage());
    }

    @Test
    void testDeleteActivity_Success() {
        // 模拟Mapper行为
        when(activityMapper.selectById(1L)).thenReturn(testActivity);
        when(activityMapper.deleteById(1L)).thenReturn(1);

        // 执行测试
        assertDoesNotThrow(() -> activityService.deleteActivity(1L));

        // 验证Mapper被调用
        verify(activityMapper, times(1)).selectById(1L);
        verify(activityMapper, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteActivity_NotFound() {
        // 模拟活动不存在
        when(activityMapper.selectById(999L)).thenReturn(null);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            activityService.deleteActivity(999L);
        });

        assertEquals("活动不存在", exception.getMessage());
    }

    @Test
    void testGetActivityList() {
        // 准备测试数据
        Page<Activity> activityPage = new Page<>(1, 10, 1);
        activityPage.setRecords(java.util.List.of(testActivity));

        // 模拟Mapper行为
        when(activityMapper.selectPage(any(Page.class), any(LambdaQueryWrapper.class)))
                .thenReturn(activityPage);
        when(registrationMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(5L);

        // 准备查询请求
        ActivityQueryRequest query = new ActivityQueryRequest();
        query.setPage(1);
        query.setSize(10);
        query.setTitle("测试");

        // 执行测试
        Page<ActivityDTO> result = activityService.getActivityList(query);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.getTotal());
        assertEquals(1, result.getRecords().size());
        assertEquals("测试活动", result.getRecords().get(0).getTitle());
        assertEquals(5, result.getRecords().get(0).getRegistrationCount());

        // 验证Mapper被调用
        verify(activityMapper, times(1)).selectPage(any(Page.class), any(LambdaQueryWrapper.class));
    }

    @Test
    void testRegisterActivity_Success() {
        // 模拟Mapper行为
        when(activityMapper.selectById(1L)).thenReturn(testActivity);
        when(registrationMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(0L);
        when(registrationMapper.insert(any(ActivityRegistration.class))).thenReturn(1);

        // 执行测试
        assertDoesNotThrow(() -> activityService.registerActivity(1L, 100L));

        // 验证Mapper被调用
        verify(activityMapper, times(1)).selectById(1L);
        verify(registrationMapper, times(1)).insert(any(ActivityRegistration.class));
    }

    @Test
    void testRegisterActivity_NotFound() {
        // 模拟活动不存在
        when(activityMapper.selectById(999L)).thenReturn(null);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            activityService.registerActivity(999L, 100L);
        });

        assertEquals("活动不存在", exception.getMessage());
    }

    @Test
    void testRegisterActivity_AlreadyRegistered() {
        // 模拟已报名
        when(activityMapper.selectById(1L)).thenReturn(testActivity);
        when(registrationMapper.selectCount(any(LambdaQueryWrapper.class))).thenReturn(1L);

        // 执行测试并验证异常
        BusinessException exception = assertThrows(BusinessException.class, () -> {
            activityService.registerActivity(1L, 100L);
        });

        assertEquals("已报名该活动", exception.getMessage());
    }
}
