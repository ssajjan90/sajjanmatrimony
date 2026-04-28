package com.sajjanmatrimony.controller;

import com.sajjanmatrimony.dto.request.AdminActionRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.dto.response.UserResponse;
import com.sajjanmatrimony.service.AdminService;
import com.sajjanmatrimony.util.ApiResponse;
import com.sajjanmatrimony.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Admin", description = "Admin dashboard: approvals, user management")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/profiles/pending")
    @Operation(summary = "Get profiles pending approval")
    public ResponseEntity<ApiResponse<PageResponse<ProfileSummaryDto>>> pending(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                adminService.getPendingProfiles(
                        PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }

    @PatchMapping("/profiles/{profileId}/action")
    @Operation(summary = "Approve or reject a profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> action(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String profileId,
            @Valid @RequestBody AdminActionRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Action applied",
                adminService.approveOrRejectProfile(
                        userDetails.getUsername(), profileId, request)));
    }

    @PatchMapping("/users/{userId}/block")
    @Operation(summary = "Block a user")
    public ResponseEntity<ApiResponse<Void>> block(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String userId) {
        adminService.blockUser(userDetails.getUsername(), userId);
        return ResponseEntity.ok(ApiResponse.success("User blocked", null));
    }

    @PatchMapping("/users/{userId}/unblock")
    @Operation(summary = "Unblock a user")
    public ResponseEntity<ApiResponse<Void>> unblock(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String userId) {
        adminService.unblockUser(userDetails.getUsername(), userId);
        return ResponseEntity.ok(ApiResponse.success("User unblocked", null));
    }

    @GetMapping("/users")
    @Operation(summary = "List all users (paginated)")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> users(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                adminService.getAllUsers(PageRequest.of(page, size))));
    }
}
