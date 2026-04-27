package com.sajjanmatrimony.service;

import com.sajjanmatrimony.dto.request.LoginRequest;
import com.sajjanmatrimony.dto.request.RegisterRequest;
import com.sajjanmatrimony.dto.response.LoginResponse;
import com.sajjanmatrimony.dto.response.UserResponse;

public interface AuthService {
    UserResponse register(RegisterRequest request);
    LoginResponse login(LoginRequest request);
    LoginResponse refreshToken(String refreshToken);
}
