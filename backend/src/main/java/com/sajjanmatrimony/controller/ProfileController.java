package com.sajjanmatrimony.controller;

import com.sajjanmatrimony.dto.request.ProfileRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.service.ProfileService;
import com.sajjanmatrimony.util.ApiResponse;
import com.sajjanmatrimony.util.PageResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@Tag(name = "Profiles", description = "Create, update, view and search matrimonial profiles")
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create my matrimonial profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> create(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Profile created",
                        profileService.createProfile(userDetails.getUsername(), request)));
    }

    @PutMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update my profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated",
                profileService.updateProfile(userDetails.getUsername(), request)));
    }

    @GetMapping("/me")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get my profile")
    public ResponseEntity<ApiResponse<ProfileResponse>> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                profileService.getMyProfile(userDetails.getUsername())));
    }

    @GetMapping("/{profileId}")
    @Operation(summary = "Get a profile by ID (public)")
    public ResponseEntity<ApiResponse<ProfileResponse>> getById(
            @PathVariable String profileId) {
        return ResponseEntity.ok(ApiResponse.success(
                profileService.getProfileById(profileId)));
    }

    @GetMapping("/search")
    @Operation(summary = "Search profiles with filters")
    public ResponseEntity<ApiResponse<PageResponse<ProfileSummaryDto>>> search(
            @RequestParam(required = false) String gender,
            @RequestParam(required = false) Integer minAge,
            @RequestParam(required = false) Integer maxAge,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String education,
            @RequestParam(required = false) String occupation,
            @RequestParam(required = false) String maritalStatus,
            @RequestParam(required = false) String caste,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success(
                profileService.searchProfiles(gender, minAge, maxAge, city, education,
                        occupation, maritalStatus, caste,
                        PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }
}
