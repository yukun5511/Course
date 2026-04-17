package com.course.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * 用户查询请求
 */
@Data
public class UserQueryRequest {
    private String name;
    private String studentId;
    private String role;
    private Long classId;
    private String status;
    private Integer page = 1;
    private Integer size = 10;
}
