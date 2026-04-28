package com.sajjanmatrimony.controller;

import com.sajjanmatrimony.dto.request.LoginRequest;
import com.sajjanmatrimony.dto.request.RegisterRequest;
import com.sajjanmatrimony.dto.response.LoginResponse;
import com.sajjanmatrimony.dto.response.UserResponse;
import com.sajjanmatrimony.service.AuthService;
import com.sajjanmatrimony.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Register, login, token refresh")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user")
    public ResponseEntity<ApiResponse<UserResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("User registered successfully",
                        authService.register(request)));
    }

    @PostMapping("/login")
    @Operation(summary = "Login with email/mobile and password")
    public ResponseEntity<ApiResponse<LoginResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Login successful",
                authService.login(request)));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Refresh access token using refresh token")
    public ResponseEntity<ApiResponse<LoginResponse>> refresh(
            @RequestParam String refreshToken) {
        return ResponseEntity.ok(ApiResponse.success("Token refreshed",
                authService.refreshToken(refreshToken)));
    }
}
