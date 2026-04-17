package com.course.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.dto.request.PopupCreateRequest;
import com.course.dto.request.PopupQueryRequest;
import com.course.dto.request.PopupUpdateRequest;
import com.course.dto.response.PopupMessageDTO;

/**
 * 弹窗消息服务接口
 */
public interface PopupService {
    
    /**
     * 获取弹窗列表
     */
    Page<PopupMessageDTO> getPopupList(PopupQueryRequest query);
    
    /**
     * 获取弹窗详情
     */
    PopupMessageDTO getPopupById(Long id);
    
    /**
     * 创建弹窗
     */
    PopupMessageDTO createPopup(PopupCreateRequest request);
    
    /**
     * 更新弹窗
     */
    PopupMessageDTO updatePopup(Long id, PopupUpdateRequest request);
    
    /**
     * 删除弹窗
     */
    void deletePopup(Long id);
    
    /**
     * 发布弹窗
     */
    void publishPopup(Long id, Long userId);
    
    /**
     * 撤销弹窗
     */
    void revokePopup(Long id);
    
    /**
     * 获取已发布的弹窗（小程序端使用）
     */
    Page<PopupMessageDTO> getPublishedPopups(Integer page, Integer size);
}
