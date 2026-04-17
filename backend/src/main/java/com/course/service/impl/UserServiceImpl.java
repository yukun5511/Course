package com.course.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.course.common.PageResult;
import com.course.common.exception.BusinessException;
import com.course.dto.request.UserCreateRequest;
import com.course.dto.request.UserQueryRequest;
import com.course.dto.request.UserUpdateRequest;
import com.course.dto.response.UserDTO;
import com.course.entity.User;
import com.course.mapper.UserMapper;
import com.course.service.UserService;
import com.course.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

/**
 * 用户服务实现类
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Override
    public PageResult<UserDTO> getUserList(UserQueryRequest query) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        
        if (StringUtils.hasText(query.getName())) {
            wrapper.like(User::getName, query.getName());
        }
        if (StringUtils.hasText(query.getStudentId())) {
            wrapper.eq(User::getStudentId, query.getStudentId());
        }
        if (StringUtils.hasText(query.getRole())) {
            wrapper.eq(User::getRole, query.getRole());
        }
        if (query.getClassId() != null) {
            wrapper.eq(User::getClassId, query.getClassId());
        }
        if (StringUtils.hasText(query.getStatus())) {
            wrapper.eq(User::getStatus, query.getStatus());
        }
        
        wrapper.orderByDesc(User::getCreatedAt);
        
        Page<User> page = new Page<>(query.getPage(), query.getSize());
        Page<User> userPage = userMapper.selectPage(page, wrapper);
        
        return PageResult.of(
                userPage.getRecords().stream().map(this::convertToDTO).toList(),
                userPage.getTotal(),
                query.getPage(),
                query.getSize()
        );
    }

    @Override
    public UserDTO getUserById(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        return convertToDTO(user);
    }

    @Override
    public UserDTO createUser(UserCreateRequest request) {
        // 检查学号是否已存在
        User existUser = userMapper.selectByStudentId(request.getStudentId());
        if (existUser != null) {
            throw new BusinessException("学号已存在");
        }
        
        User user = new User();
        BeanUtils.copyProperties(request, user);
        
        // 加密密码
        if (StringUtils.hasText(request.getPassword())) {
            user.setPassword(PasswordUtil.encode(request.getPassword()));
        } else {
            user.setPassword(PasswordUtil.encode("123456")); // 默认密码
        }
        
        userMapper.insert(user);
        log.info("创建用户成功: id={}, studentId={}", user.getId(), user.getStudentId());
        return convertToDTO(user);
    }

    @Override
    public UserDTO updateUser(Long id, UserUpdateRequest request) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        BeanUtils.copyProperties(request, user);
        userMapper.updateById(user);
        
        log.info("更新用户成功: id={}", id);
        return convertToDTO(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        userMapper.deleteById(id);
        log.info("删除用户成功: id={}", id);
    }

    @Override
    public void updateStatus(Long id, String status) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setStatus(status);
        userMapper.updateById(user);
        
        log.info("更新用户状态成功: id={}, status={}", id, status);
    }

    @Override
    public void updatePoints(Long id, Integer points) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setPoints(user.getPoints() + points);
        userMapper.updateById(user);
        
        log.info("更新用户积分成功: id={}, points={}", id, points);
    }

    @Override
    public void updateEnabled(Long id, Integer enabled) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setEnabled(enabled);
        userMapper.updateById(user);
        
        log.info("更新用户启用状态成功: id={}, enabled={}", id, enabled);
    }

    @Override
    public void resetPassword(Long id, String newPassword) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new BusinessException("用户不存在");
        }
        
        user.setPassword(PasswordUtil.encode(newPassword));
        userMapper.updateById(user);
        
        log.info("重置用户密码成功: id={}", id);
    }

    private UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        BeanUtils.copyProperties(user, dto);
        return dto;
    }
}
