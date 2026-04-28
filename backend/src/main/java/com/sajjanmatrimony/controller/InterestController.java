package com.sajjanmatrimony.controller;

import com.sajjanmatrimony.dto.request.UpdateInterestRequest;
import com.sajjanmatrimony.entity.Interest;
import com.sajjanmatrimony.service.InterestService;
import com.sajjanmatrimony.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/interests")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Interests", description = "Express, accept or reject interest")
public class InterestController {

    private final InterestService interestService;

    @PostMapping("/{profileId}")
    @Operation(summary = "Express interest in a profile")
    public ResponseEntity<ApiResponse<Interest>> express(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String profileId,
            @RequestParam(required = false) String message) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Interest sent",
                        interestService.expressInterest(
                                userDetails.getUsername(), profileId, message)));
    }

    @PatchMapping("/{interestId}")
    @Operation(summary = "Accept or reject a received interest")
    public ResponseEntity<ApiResponse<Interest>> update(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String interestId,
            @Valid @RequestBody UpdateInterestRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Interest updated",
                interestService.updateInterestStatus(
                        userDetails.getUsername(), interestId, request.getStatus())));
    }

    @GetMapping("/sent")
    @Operation(summary = "Get all interests I sent")
    public ResponseEntity<ApiResponse<List<Interest>>> sent(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                interestService.getSentInterests(userDetails.getUsername())));
    }

    @GetMapping("/received")
    @Operation(summary = "Get all interests I received")
    public ResponseEntity<ApiResponse<List<Interest>>> received(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(
                interestService.getReceivedInterests(userDetails.getUsername())));
    }
}
