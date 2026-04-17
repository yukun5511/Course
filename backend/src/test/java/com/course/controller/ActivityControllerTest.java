package com.course.controller;

import com.course.dto.request.ActivityCreateRequest;
import com.course.dto.request.ActivityQueryRequest;
import com.course.dto.request.ActivityUpdateRequest;
import com.course.dto.response.ActivityDTO;
import com.course.dto.response.ActivityRegistrationDTO;
import com.course.service.ActivityService;
import com.course.common.exception.GlobalExceptionHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 活动管理Controller单元测试
 */
@ExtendWith(MockitoExtension.class)
class ActivityControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ActivityService activityService;

    @InjectMocks
    private ActivityController activityController;

    private ObjectMapper objectMapper;

    private ActivityDTO testActivityDTO;
    private ActivityCreateRequest createRequest;
    private ActivityUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        // 初始化MockMvc，注册全局异常处理器
        mockMvc = MockMvcBuilders.standaloneSetup(activityController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();
        
        // 准备测试数据
        testActivityDTO = new ActivityDTO();
        testActivityDTO.setId(1L);
        testActivityDTO.setTitle("测试活动");
        testActivityDTO.setContent("这是一个测试活动");
        testActivityDTO.setOnCarousel(1);
        testActivityDTO.setRegistrationCount(10);
        testActivityDTO.setCreatedAt(LocalDateTime.now());

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
    void testGetActivityList() throws Exception {
        // 模拟Service行为
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<ActivityDTO> page = 
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(1, 10, 1);
        page.setRecords(java.util.List.of(testActivityDTO));
        when(activityService.getActivityList(any(ActivityQueryRequest.class))).thenReturn(page);

        // 执行测试
        mockMvc.perform(get("/api/activities")
                .param("page", "1")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].title").value("测试活动"));

        // 验证Service被调用
        verify(activityService, times(1)).getActivityList(any(ActivityQueryRequest.class));
    }

    @Test
    void testGetActivityById() throws Exception {
        // 模拟Service行为
        when(activityService.getActivityById(1L)).thenReturn(testActivityDTO);

        // 执行测试
        mockMvc.perform(get("/api/activities/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.title").value("测试活动"));

        // 验证Service被调用
        verify(activityService, times(1)).getActivityById(1L);
    }

    @Test
    void testCreateActivity() throws Exception {
        // 模拟Service行为
        when(activityService.createActivity(any(ActivityCreateRequest.class))).thenReturn(testActivityDTO);

        // 执行测试
        mockMvc.perform(post("/api/activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(createRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.title").value("测试活动"));

        // 验证Service被调用
        verify(activityService, times(1)).createActivity(any(ActivityCreateRequest.class));
    }

    @Test
    void testUpdateActivity() throws Exception {
        // 模拟Service行为
        ActivityDTO updatedDTO = new ActivityDTO();
        updatedDTO.setId(1L);
        updatedDTO.setTitle("更新后的活动");
        updatedDTO.setContent("更新后的内容");
        updatedDTO.setOnCarousel(1);
        
        when(activityService.updateActivity(eq(1L), any(ActivityUpdateRequest.class)))
                .thenReturn(updatedDTO);

        // 执行测试
        mockMvc.perform(put("/api/activities/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.title").value("更新后的活动"));

        // 验证Service被调用
        verify(activityService, times(1)).updateActivity(eq(1L), any(ActivityUpdateRequest.class));
    }

    @Test
    void testDeleteActivity() throws Exception {
        // 模拟Service行为
        doNothing().when(activityService).deleteActivity(1L);

        // 执行测试
        mockMvc.perform(delete("/api/activities/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        // 验证Service被调用
        verify(activityService, times(1)).deleteActivity(1L);
    }

    @Test
    void testRegisterActivity() throws Exception {
        // 模拟Service行为
        doNothing().when(activityService).registerActivity(eq(1L), eq(100L));

        // 执行测试
        String requestBody = objectMapper.writeValueAsString(
                java.util.Map.of("userId", 100L));
        
        mockMvc.perform(post("/api/activities/1/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));

        // 验证Service被调用
        verify(activityService, times(1)).registerActivity(1L, 100L);
    }

    @Test
    void testGetActivityById_NotFound() throws Exception {
        // 模拟Service抛出异常
        when(activityService.getActivityById(999L))
                .thenThrow(new com.course.common.exception.BusinessException("活动不存在"));

        // 执行测试 - 异常会被全局异常处理器捕获
        mockMvc.perform(get("/api/activities/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(500))
                .andExpect(jsonPath("$.message").value("活动不存在"));
    }

    @Test
    void testCreateActivity_InvalidRequest() throws Exception {
        // 准备无效请求（缺少必填字段）
        ActivityCreateRequest invalidRequest = new ActivityCreateRequest();
        // title为空

        // 执行测试
        mockMvc.perform(post("/api/activities")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testGetRegistrationList() throws Exception {
        // 模拟Service行为
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<ActivityRegistrationDTO> page = 
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(1, 10, 1);
        
        ActivityRegistrationDTO registration = new ActivityRegistrationDTO();
        registration.setId(1L);
        registration.setActivityId(1L);
        registration.setUserId(100L);
        registration.setUserName("测试用户");
        registration.setRegisteredAt(LocalDateTime.now());
        
        page.setRecords(java.util.List.of(registration));
        when(activityService.getRegistrationList(eq(1L), eq(1), eq(10))).thenReturn(page);

        // 执行测试
        mockMvc.perform(get("/api/activities/1/registrations")
                .param("page", "1")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].userName").value("测试用户"));

        // 验证Service被调用
        verify(activityService, times(1)).getRegistrationList(1L, 1, 10);
    }
}
