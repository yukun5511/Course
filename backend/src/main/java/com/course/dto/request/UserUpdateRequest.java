package com.course.dto.request;

import lombok.Data;

/**
 * 用户更新请求
 */
@Data
public class UserUpdateRequest {
    private String name;
    private String avatar;
    private String company;
    private String position;
    private String tags;
    private String phone;
    private String email;
    private Integer currentPeriod;
    private Long classId;
    private String status;
}
