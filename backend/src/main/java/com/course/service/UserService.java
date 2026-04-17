package com.course.service;

import com.course.common.PageResult;
import com.course.dto.request.UserCreateRequest;
import com.course.dto.request.UserQueryRequest;
import com.course.dto.request.UserUpdateRequest;
import com.course.dto.response.UserDTO;

/**
 * 用户服务接口
 */
public interface UserService {
    
    PageResult<UserDTO> getUserList(UserQueryRequest query);
    
    UserDTO getUserById(Long id);
    
    UserDTO createUser(UserCreateRequest request);
    
    UserDTO updateUser(Long id, UserUpdateRequest request);
    
    void deleteUser(Long id);
    
    void updateStatus(Long id, String status);
    
    void updatePoints(Long id, Integer points);
    
    void updateEnabled(Long id, Integer enabled);
    
    void resetPassword(Long id, String newPassword);
}
