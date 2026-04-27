package com.sajjanmatrimony.service;

import com.sajjanmatrimony.dto.request.ProfileRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.util.PageResponse;
import org.springframework.data.domain.Pageable;

public interface ProfileService {
    ProfileResponse createProfile(String userId, ProfileRequest request);
    ProfileResponse updateProfile(String userId, ProfileRequest request);
    ProfileResponse getMyProfile(String userId);
    ProfileResponse getProfileById(String profileId);
    PageResponse<ProfileSummaryDto> searchProfiles(
            String gender, Integer minAge, Integer maxAge,
            String city, String education, String occupation,
            String maritalStatus, String caste, Pageable pageable);
}
