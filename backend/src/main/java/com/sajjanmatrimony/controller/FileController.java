package com.sajjanmatrimony.controller;

import com.sajjanmatrimony.service.FileService;
import com.sajjanmatrimony.util.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Files", description = "Upload and delete profile photos")
public class FileController {

    private final FileService fileService;

    @PostMapping("/photo")
    @Operation(summary = "Upload a profile photo (max 5 MB, JPEG/PNG/WebP)")
    public ResponseEntity<ApiResponse<String>> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Photo uploaded",
                fileService.uploadProfilePhoto(userDetails.getUsername(), file)));
    }

    @DeleteMapping("/photo/{fileName}")
    @Operation(summary = "Delete a profile photo by file name")
    public ResponseEntity<ApiResponse<Void>> delete(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String fileName) {
        fileService.deletePhoto(userDetails.getUsername(), fileName);
        return ResponseEntity.ok(ApiResponse.success("Photo deleted", null));
    }
}
