package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.exception.BusinessException;
import com.course.dto.request.ExchangeRequest;
import com.course.dto.request.ShopItemCreateRequest;
import com.course.dto.request.ShopItemQueryRequest;
import com.course.dto.request.ShopItemUpdateRequest;
import com.course.dto.response.ExchangeRecordDTO;
import com.course.dto.response.ShopItemDTO;
import com.course.entity.Course;
import com.course.entity.ExchangeRecord;
import com.course.entity.ShopItem;
import com.course.entity.User;
import com.course.mapper.CourseMapper;
import com.course.mapper.ExchangeRecordMapper;
import com.course.mapper.ShopItemMapper;
import com.course.mapper.UserMapper;
import com.course.service.ShopService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

/**
 * 积分商城服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ShopServiceImpl implements ShopService {

    private final ShopItemMapper shopItemMapper;
    private final ExchangeRecordMapper exchangeRecordMapper;
    private final UserMapper userMapper;
    private final CourseMapper courseMapper;

    @Override
    public Page<ShopItemDTO> getItemList(ShopItemQueryRequest query) {
        LambdaQueryWrapper<ShopItem> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(query.getName())) {
            wrapper.like(ShopItem::getName, query.getName());
        }
        if (StringUtils.hasText(query.getType())) {
            wrapper.eq(ShopItem::getType, query.getType());
        }
        if (query.getAvailable() != null) {
            wrapper.eq(ShopItem::getAvailable, query.getAvailable());
        }
        
        wrapper.orderByDesc(ShopItem::getCreatedAt);
        
        Page<ShopItem> page = new Page<>(query.getPage(), query.getSize());
        Page<ShopItem> itemPage = shopItemMapper.selectPage(page, wrapper);
        
        // 转换为DTO并添加课程名称
        Page<ShopItemDTO> resultPage = new Page<>(query.getPage(), query.getSize(), itemPage.getTotal());
        List<ShopItemDTO> dtoList = itemPage.getRecords().stream().map(item -> {
            ShopItemDTO dto = convertToDTO(item);
            
            // 获取关联课程名称
            if (item.getCourseId() != null) {
                Course course = courseMapper.selectById(item.getCourseId());
                if (course != null) {
                    dto.setCourseName(course.getName());
                }
            }
            
            return dto;
        }).toList();
        
        resultPage.setRecords(dtoList);
        return resultPage;
    }

    @Override
    public ShopItemDTO getItemById(Long id) {
        ShopItem item = shopItemMapper.selectById(id);
        if (item == null) {
            throw new BusinessException("商品不存在");
        }
        
        ShopItemDTO dto = convertToDTO(item);
        
        // 获取关联课程名称
        if (item.getCourseId() != null) {
            Course course = courseMapper.selectById(item.getCourseId());
            if (course != null) {
                dto.setCourseName(course.getName());
            }
        }
        
        return dto;
    }

    @Override
    public ShopItemDTO createItem(ShopItemCreateRequest request) {
        ShopItem item = new ShopItem();
        BeanUtils.copyProperties(request, item);
        item.setAvailable(1);
        
        shopItemMapper.insert(item);
        log.info("创建商品成功: id={}, name={}", item.getId(), item.getName());
        return convertToDTO(item);
    }

    @Override
    public ShopItemDTO updateItem(Long id, ShopItemUpdateRequest request) {
        ShopItem item = shopItemMapper.selectById(id);
        if (item == null) {
            throw new BusinessException("商品不存在");
        }
        
        if (StringUtils.hasText(request.getName())) {
            item.setName(request.getName());
        }
        if (StringUtils.hasText(request.getType())) {
            item.setType(request.getType());
        }
        if (request.getImage() != null) {
            item.setImage(request.getImage());
        }
        if (request.getBadgeCost() != null) {
            item.setBadgeCost(request.getBadgeCost());
        }
        if (request.getStock() != null) {
            item.setStock(request.getStock());
        }
        if (request.getDescription() != null) {
            item.setDescription(request.getDescription());
        }
        if (request.getCourseId() != null) {
            item.setCourseId(request.getCourseId());
        }
        
        shopItemMapper.updateById(item);
        log.info("更新商品成功: id={}", id);
        return convertToDTO(item);
    }

    @Override
    public void deleteItem(Long id) {
        ShopItem item = shopItemMapper.selectById(id);
        if (item == null) {
            throw new BusinessException("商品不存在");
        }
        
        shopItemMapper.deleteById(id);
        log.info("删除商品成功: id={}", id);
    }

    @Override
    public void updateAvailable(Long id, Integer available) {
        ShopItem item = shopItemMapper.selectById(id);
        if (item == null) {
            throw new BusinessException("商品不存在");
        }
        
        item.setAvailable(available);
        shopItemMapper.updateById(item);
        log.info("更新商品状态成功: id={}, available={}", id, available);
    }

    @Override
    @Transactional
    public void exchangeItem(ExchangeRequest request) {
        // 检查商品是否存在
        ShopItem item = shopItemMapper.selectById(request.getItemId());
        if (item == null) {
            throw new BusinessException("商品不存在");
        }
        
        // 检查商品是否可用
        if (item.getAvailable() == 0) {
            throw new BusinessException("商品已下架");
        }
        
        // 检查库存
        if (item.getStock() <= 0) {
            throw new BusinessException("商品库存不足");
        }
        
        // 检查用户是否存在
        User user = userMapper.selectById(request.getUserId());
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        // 检查用户徽章数量
        if (user.getBadges() < item.getBadgeCost()) {
            throw new BusinessException("徽章数量不足");
        }
        
        // 扣除用户徽章
        user.setBadges(user.getBadges() - item.getBadgeCost());
        userMapper.updateById(user);
        
        // 减少库存
        item.setStock(item.getStock() - 1);
        shopItemMapper.updateById(item);
        
        // 创建兑换记录
        ExchangeRecord record = new ExchangeRecord();
        record.setUserId(request.getUserId());
        record.setItemId(request.getItemId());
        record.setItemName(item.getName());
        record.setBadgeCost(item.getBadgeCost());
        
        exchangeRecordMapper.insert(record);
        
        log.info("兑换商品成功: userId={}, itemId={}, badgeCost={}", 
            request.getUserId(), request.getItemId(), item.getBadgeCost());
    }

    @Override
    public Page<ExchangeRecordDTO> getExchangeRecords(Integer page, Integer size, Long userId) {
        LambdaQueryWrapper<ExchangeRecord> wrapper = new LambdaQueryWrapper<>();
        
        if (userId != null) {
            wrapper.eq(ExchangeRecord::getUserId, userId);
        }
        
        wrapper.orderByDesc(ExchangeRecord::getExchangedAt);
        
        Page<ExchangeRecord> recordPage = new Page<>(page, size);
        Page<ExchangeRecord> exchangePage = exchangeRecordMapper.selectPage(recordPage, wrapper);
        
        // 转换为DTO并添加用户信息
        Page<ExchangeRecordDTO> resultPage = new Page<>(page, size, exchangePage.getTotal());
        List<ExchangeRecordDTO> dtoList = exchangePage.getRecords().stream().map(record -> {
            ExchangeRecordDTO dto = convertToRecordDTO(record);
            
            // 获取用户信息
            User user = userMapper.selectById(record.getUserId());
            if (user != null) {
                dto.setUserName(user.getName());
                dto.setStudentId(user.getStudentId());
            }
            
            return dto;
        }).toList();
        
        resultPage.setRecords(dtoList);
        return resultPage;
    }

    private ShopItemDTO convertToDTO(ShopItem item) {
        ShopItemDTO dto = new ShopItemDTO();
        BeanUtils.copyProperties(item, dto);
        return dto;
    }

    private ExchangeRecordDTO convertToRecordDTO(ExchangeRecord record) {
        ExchangeRecordDTO dto = new ExchangeRecordDTO();
        BeanUtils.copyProperties(record, dto);
        return dto;
    }
}
