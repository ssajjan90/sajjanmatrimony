package com.sajjanmatrimony.service;

import org.springframework.web.multipart.MultipartFile;

public interface FileService {
    String uploadProfilePhoto(String userId, MultipartFile file);
    void deletePhoto(String userId, String fileName);
}
