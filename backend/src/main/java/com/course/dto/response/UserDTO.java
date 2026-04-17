package com.course.dto.response;

import lombok.Data;

/**
 * 用户 DTO
 */
@Data
public class UserDTO {
    private Long id;
    private String studentId;
    private String name;
    private String avatar;
    private String company;
    private String position;
    private String tags;
    private String role;
    private String phone;
    private String email;
    private Integer badges;
    private Integer points;
    private Integer currentPeriod;
    private Long classId;
    private String status;
}
