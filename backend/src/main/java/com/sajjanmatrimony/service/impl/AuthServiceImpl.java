package com.sajjanmatrimony.service.impl;

import com.sajjanmatrimony.dto.request.LoginRequest;
import com.sajjanmatrimony.dto.request.RegisterRequest;
import com.sajjanmatrimony.dto.response.LoginResponse;
import com.sajjanmatrimony.dto.response.UserResponse;
import com.sajjanmatrimony.entity.User;
import com.sajjanmatrimony.entity.enums.Role;
import com.sajjanmatrimony.exception.AppException;
import com.sajjanmatrimony.exception.DuplicateResourceException;
import com.sajjanmatrimony.mapper.UserMapper;
import com.sajjanmatrimony.repository.UserRepository;
import com.sajjanmatrimony.security.JwtUtil;
import com.sajjanmatrimony.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final UserMapper userMapper;

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        if (userRepository.existsByMobile(request.getMobile())) {
            throw new DuplicateResourceException("Mobile number already registered");
        }
        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ROLE_USER)
                .build();
        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = userRepository
                .findByEmailOrMobile(request.getEmailOrMobile(), request.getEmailOrMobile())
                .orElseThrow(() -> new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED));

        if (user.isBlocked()) {
            throw new AppException("Account is blocked. Contact support.", HttpStatus.FORBIDDEN);
        }
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException("Invalid credentials", HttpStatus.UNAUTHORIZED);
        }

        String role = user.getRole().name();
        return LoginResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(user.getId(), role))
                .refreshToken(jwtUtil.generateRefreshToken(user.getId(), role))
                .tokenType("Bearer")
                .user(userMapper.toResponse(user))
                .build();
    }

    @Override
    public LoginResponse refreshToken(String refreshToken) {
        if (!jwtUtil.isTokenValid(refreshToken)) {
            throw new AppException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED);
        }
        String userId = jwtUtil.extractUserId(refreshToken);
        String role = jwtUtil.extractRole(refreshToken);
        return LoginResponse.builder()
                .accessToken(jwtUtil.generateAccessToken(userId, role))
                .refreshToken(jwtUtil.generateRefreshToken(userId, role))
                .tokenType("Bearer")
                .build();
    }
}
