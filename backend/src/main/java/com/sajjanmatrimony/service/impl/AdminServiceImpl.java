package com.sajjanmatrimony.service.impl;

import com.sajjanmatrimony.dto.request.AdminActionRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.dto.response.UserResponse;
import com.sajjanmatrimony.entity.AdminApproval;
import com.sajjanmatrimony.entity.Profile;
import com.sajjanmatrimony.entity.User;
import com.sajjanmatrimony.entity.enums.ApprovalStatus;
import com.sajjanmatrimony.exception.ResourceNotFoundException;
import com.sajjanmatrimony.mapper.ProfileMapper;
import com.sajjanmatrimony.mapper.UserMapper;
import com.sajjanmatrimony.repository.AdminApprovalRepository;
import com.sajjanmatrimony.repository.ProfileRepository;
import com.sajjanmatrimony.repository.UserRepository;
import com.sajjanmatrimony.service.AdminService;
import com.sajjanmatrimony.util.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final ProfileRepository profileRepository;
    private final AdminApprovalRepository adminApprovalRepository;
    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;
    private final UserMapper userMapper;

    @Override
    public PageResponse<ProfileSummaryDto> getPendingProfiles(Pageable pageable) {
        Page<Profile> profiles = profileRepository.findByApprovedFalse(pageable);
        return PageResponse.from(profiles.map(profileMapper::toSummary));
    }

    @Override
    public ProfileResponse approveOrRejectProfile(String adminId, String profileId,
                                                   AdminActionRequest request) {
        Profile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", profileId));

        ApprovalStatus status = ApprovalStatus.valueOf(request.getStatus().toUpperCase());
        profile.setApproved(status == ApprovalStatus.APPROVED);
        profileRepository.save(profile);

        AdminApproval approval = adminApprovalRepository.findByProfileId(profileId)
                .orElse(AdminApproval.builder().profileId(profileId).build());
        approval.setAdminId(adminId);
        approval.setStatus(status);
        approval.setRemarks(request.getRemarks());
        adminApprovalRepository.save(approval);

        return profileMapper.toResponse(profile);
    }

    @Override
    public void blockUser(String adminId, String targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", targetUserId));
        user.setBlocked(true);
        userRepository.save(user);
    }

    @Override
    public void unblockUser(String adminId, String targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User", targetUserId));
        user.setBlocked(false);
        userRepository.save(user);
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return PageResponse.from(users.map(userMapper::toResponse));
    }
}
