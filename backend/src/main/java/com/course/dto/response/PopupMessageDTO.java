package com.course.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * 弹窗消息响应DTO
 */
@Data
public class PopupMessageDTO {
    private Long id;
    private String title;
    private String content;
    private String image;
    private Integer published;
    private Long createdBy;
    private String creatorName;
    private Long publishedBy;
    private String publisherName;
    private LocalDateTime publishedAt;
    private LocalDateTime revokedAt;
    private LocalDateTime createdAt;
}
