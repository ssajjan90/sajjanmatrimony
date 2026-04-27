package com.sajjanmatrimony.mapper;

import com.sajjanmatrimony.dto.response.UserResponse;
import com.sajjanmatrimony.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobile(user.getMobile())
                .role(user.getRole().name())
                .emailVerified(user.isEmailVerified())
                .mobileVerified(user.isMobileVerified())
                .blocked(user.isBlocked())
                .active(user.isActive())
                .build();
    }
}
