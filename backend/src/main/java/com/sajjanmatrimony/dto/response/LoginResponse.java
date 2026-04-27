package com.sajjanmatrimony.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private UserResponse user;
}
