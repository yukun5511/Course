package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 活动报名响应DTO
 */
@Data
public class ActivityRegistrationDTO {
    private Long id;
    private Long activityId;
    private String activityTitle;
    private Long userId;
    private String userName;
    private String studentId;
    private String company;
    private String position;
    private LocalDateTime registeredAt;
}
