package com.sajjanmatrimony.service.impl;

import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.entity.Shortlist;
import com.sajjanmatrimony.exception.AppException;
import com.sajjanmatrimony.exception.DuplicateResourceException;
import com.sajjanmatrimony.exception.ResourceNotFoundException;
import com.sajjanmatrimony.mapper.ProfileMapper;
import com.sajjanmatrimony.repository.ProfileRepository;
import com.sajjanmatrimony.repository.ShortlistRepository;
import com.sajjanmatrimony.service.ShortlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShortlistServiceImpl implements ShortlistService {

    private final ShortlistRepository shortlistRepository;
    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    @Override
    public void addToShortlist(String userId, String profileId) {
        if (!profileRepository.existsById(profileId)) {
            throw new ResourceNotFoundException("Profile", profileId);
        }
        if (shortlistRepository.existsByUserIdAndProfileId(userId, profileId)) {
            throw new DuplicateResourceException("Profile already in shortlist");
        }
        shortlistRepository.save(Shortlist.builder()
                .userId(userId)
                .profileId(profileId)
                .build());
    }

    @Override
    public void removeFromShortlist(String userId, String profileId) {
        if (!shortlistRepository.existsByUserIdAndProfileId(userId, profileId)) {
            throw new AppException("Profile not found in shortlist", HttpStatus.NOT_FOUND);
        }
        shortlistRepository.deleteByUserIdAndProfileId(userId, profileId);
    }

    @Override
    public List<ProfileSummaryDto> getShortlist(String userId) {
        return shortlistRepository.findByUserId(userId).stream()
                .map(s -> profileRepository.findById(s.getProfileId()))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .map(profileMapper::toSummary)
                .toList();
    }
}
