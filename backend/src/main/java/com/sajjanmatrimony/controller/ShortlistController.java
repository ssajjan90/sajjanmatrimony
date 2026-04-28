package com.sajjanmatrimony.controller;

import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.service.ShortlistService;
import com.sajjanmatrimony.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shortlist")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Shortlist", description = "Save and manage favourite profiles")
public class ShortlistController {

    private final ShortlistService shortlistService;

    @PostMapping("/{profileId}")
    @Operation(summary = "Add profile to shortlist")
    public ResponseEntity<ApiResponse<Void>> add(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String profileId) {
        shortlistService.addToShortlist(userDetails.getUsername(), profileId);
        return ResponseEntity.ok(ApiResponse.success("Added to shortlist", null));
    }

    @DeleteMapping("/{profileId}")
    @Operation(summary = "Remove profile from shortlist")
    public ResponseEntity<ApiResponse<Void>> remove(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String profileId) {
        shortlistService.removeFromShortlist(userDetails.getUsername(), profileId);
        return ResponseEntity.ok(ApiResponse.success("Removed from shortlist", null));
    }

    @GetMapping
    @Operation(summary = "Get my shortlisted profiles")
    public ResponseEntity<ApiResponse<List<ProfileSummaryDto>>> get(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                shortlistService.getShortlist(userDetails.getUsername())));
    }
}
