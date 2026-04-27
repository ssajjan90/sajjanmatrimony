package com.sajjanmatrimony.service.impl;

import com.sajjanmatrimony.config.AppProperties;
import com.sajjanmatrimony.exception.AppException;
import com.sajjanmatrimony.exception.ResourceNotFoundException;
import com.sajjanmatrimony.repository.ProfileRepository;
import com.sajjanmatrimony.service.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final ProfileRepository profileRepository;
    private final AppProperties appProperties;

    private static final List<String> ALLOWED_TYPES = List.of("image/jpeg", "image/png", "image/webp");
    private static final long MAX_SIZE_BYTES = 5 * 1024 * 1024L;

    @Override
    public String uploadProfilePhoto(String userId, MultipartFile file) {
        validateFile(file);
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", userId));

        String ext = extractExtension(file.getOriginalFilename());
        String fileName = UUID.randomUUID() + "." + ext;
        Path uploadDir = Paths.get(appProperties.getUpload().getDir(), userId);

        try {
            Files.createDirectories(uploadDir);
            file.transferTo(uploadDir.resolve(fileName));
        } catch (IOException e) {
            throw new AppException("Failed to save photo", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        String relativePath = "/uploads/" + userId + "/" + fileName;
        profile.getPhotoUrls().add(relativePath);
        profileRepository.save(profile);
        return relativePath;
    }

    @Override
    public void deletePhoto(String userId, String fileName) {
        var profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", userId));

        String relativePath = "/uploads/" + userId + "/" + fileName;
        profile.getPhotoUrls().remove(relativePath);
        profileRepository.save(profile);

        try {
            Files.deleteIfExists(Paths.get(appProperties.getUpload().getDir(), userId, fileName));
        } catch (IOException e) {
            throw new AppException("Failed to delete photo", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) throw new AppException("File is empty", HttpStatus.BAD_REQUEST);
        if (file.getSize() > MAX_SIZE_BYTES) throw new AppException("File exceeds 5 MB limit", HttpStatus.BAD_REQUEST);
        if (!ALLOWED_TYPES.contains(file.getContentType()))
            throw new AppException("Only JPEG, PNG and WebP images are allowed", HttpStatus.BAD_REQUEST);
    }

    private String extractExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }
}
