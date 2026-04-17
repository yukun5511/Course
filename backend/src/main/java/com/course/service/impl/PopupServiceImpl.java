package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.dto.request.PopupCreateRequest;
import com.course.dto.request.PopupQueryRequest;
import com.course.dto.request.PopupUpdateRequest;
import com.course.dto.response.PopupMessageDTO;
import com.course.entity.PopupMessage;
import com.course.entity.User;
import com.course.mapper.PopupMessageMapper;
import com.course.mapper.UserMapper;
import com.course.service.PopupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 弹窗消息服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PopupServiceImpl implements PopupService {

    private final PopupMessageMapper popupMessageMapper;
    private final UserMapper userMapper;

    @Override
    public Page<PopupMessageDTO> getPopupList(PopupQueryRequest query) {
        LambdaQueryWrapper<PopupMessage> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(query.getTitle())) {
            wrapper.like(PopupMessage::getTitle, query.getTitle());
        }
        if (query.getPublished() != null) {
            wrapper.eq(PopupMessage::getPublished, query.getPublished());
        }
        
        wrapper.orderByDesc(PopupMessage::getCreatedAt);
        
        Page<PopupMessage> page = new Page<>(query.getPage(), query.getSize());
        Page<PopupMessage> popupPage = popupMessageMapper.selectPage(page, wrapper);
        
        // 转换为DTO
        Page<PopupMessageDTO> resultPage = new Page<>(query.getPage(), query.getSize(), popupPage.getTotal());
        List<PopupMessageDTO> dtoList = popupPage.getRecords().stream().map(this::convertToDTO).toList();
        
        resultPage.setRecords(dtoList);
        return resultPage;
    }

    @Override
    public PopupMessageDTO getPopupById(Long id) {
        PopupMessage popup = popupMessageMapper.selectById(id);
        if (popup == null) {
            throw new BusinessException("弹窗消息不存在");
        }
        return convertToDTO(popup);
    }

    @Override
    public PopupMessageDTO createPopup(PopupCreateRequest request) {
        PopupMessage popup = new PopupMessage();
        BeanUtils.copyProperties(request, popup);
        popup.setPublished(0);
        // TODO: 从登录用户获取createdBy
        popup.setCreatedBy(1L);
        
        popupMessageMapper.insert(popup);
        log.info("创建弹窗消息成功: id={}, title={}", popup.getId(), popup.getTitle());
        return convertToDTO(popup);
    }

    @Override
    public PopupMessageDTO updatePopup(Long id, PopupUpdateRequest request) {
        PopupMessage popup = popupMessageMapper.selectById(id);
        if (popup == null) {
            throw new BusinessException("弹窗消息不存在");
        }
        
        if (StringUtils.hasText(request.getTitle())) {
            popup.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            popup.setContent(request.getContent());
        }
        if (request.getImage() != null) {
            popup.setImage(request.getImage());
        }
        
        popupMessageMapper.updateById(popup);
        log.info("更新弹窗消息成功: id={}", id);
        return convertToDTO(popup);
    }

    @Override
    public void deletePopup(Long id) {
        PopupMessage popup = popupMessageMapper.selectById(id);
        if (popup == null) {
            throw new BusinessException("弹窗消息不存在");
        }
        
        popupMessageMapper.deleteById(id);
        log.info("删除弹窗消息成功: id={}", id);
    }

    @Override
    public void publishPopup(Long id, Long userId) {
        PopupMessage popup = popupMessageMapper.selectById(id);
        if (popup == null) {
            throw new BusinessException("弹窗消息不存在");
        }
        
        popup.setPublished(1);
        popup.setPublishedBy(userId);
        popup.setPublishedAt(LocalDateTime.now());
        popup.setRevokedAt(null);
        
        popupMessageMapper.updateById(popup);
        log.info("发布弹窗消息成功: id={}, userId={}", id, userId);
    }

    @Override
    public void revokePopup(Long id) {
        PopupMessage popup = popupMessageMapper.selectById(id);
        if (popup == null) {
            throw new BusinessException("弹窗消息不存在");
        }
        
        if (popup.getPublished() == 0) {
            throw new BusinessException("弹窗消息未发布");
        }
        
        popup.setPublished(0);
        popup.setRevokedAt(LocalDateTime.now());
        
        popupMessageMapper.updateById(popup);
        log.info("撤销弹窗消息成功: id={}", id);
    }

    @Override
    public Page<PopupMessageDTO> getPublishedPopups(Integer page, Integer size) {
        LambdaQueryWrapper<PopupMessage> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(PopupMessage::getPublished, 1);
        wrapper.isNull(PopupMessage::getRevokedAt);
        wrapper.orderByDesc(PopupMessage::getPublishedAt);
        
        Page<PopupMessage> popupPage = new Page<>(page, size);
        Page<PopupMessage> resultPage = popupMessageMapper.selectPage(popupPage, wrapper);
        
        // 转换为DTO
        Page<PopupMessageDTO> dtoPage = new Page<>(page, size, resultPage.getTotal());
        List<PopupMessageDTO> dtoList = resultPage.getRecords().stream().map(this::convertToDTO).toList();
        
        dtoPage.setRecords(dtoList);
        return dtoPage;
    }

    private PopupMessageDTO convertToDTO(PopupMessage popup) {
        PopupMessageDTO dto = new PopupMessageDTO();
        BeanUtils.copyProperties(popup, dto);
        
        // 获取创建人姓名
        if (popup.getCreatedBy() != null) {
            User creator = userMapper.selectById(popup.getCreatedBy());
            if (creator != null) {
                dto.setCreatorName(creator.getName());
            }
        }
        
        // 获取发布人姓名
        if (popup.getPublishedBy() != null) {
            User publisher = userMapper.selectById(popup.getPublishedBy());
            if (publisher != null) {
                dto.setPublisherName(publisher.getName());
            }
        }
        
        return dto;
    }
}
