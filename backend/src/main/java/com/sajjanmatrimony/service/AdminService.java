package com.sajjanmatrimony.service;

import com.sajjanmatrimony.dto.request.AdminActionRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.dto.response.UserResponse;
import com.sajjanmatrimony.util.PageResponse;
import org.springframework.data.domain.Pageable;

public interface AdminService {
    PageResponse<ProfileSummaryDto> getPendingProfiles(Pageable pageable);
    ProfileResponse approveOrRejectProfile(String adminId, String profileId, AdminActionRequest request);
    void blockUser(String adminId, String targetUserId);
    void unblockUser(String adminId, String targetUserId);
    PageResponse<UserResponse> getAllUsers(Pageable pageable);
}
