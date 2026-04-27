package com.sajjanmatrimony.service.impl;

import com.sajjanmatrimony.dto.request.ProfileRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.entity.AdminApproval;
import com.sajjanmatrimony.entity.Profile;
import com.sajjanmatrimony.entity.enums.ApprovalStatus;
import com.sajjanmatrimony.exception.DuplicateResourceException;
import com.sajjanmatrimony.exception.ResourceNotFoundException;
import com.sajjanmatrimony.mapper.ProfileMapper;
import com.sajjanmatrimony.repository.AdminApprovalRepository;
import com.sajjanmatrimony.repository.ProfileRepository;
import com.sajjanmatrimony.service.ProfileService;
import com.sajjanmatrimony.util.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final AdminApprovalRepository adminApprovalRepository;
    private final ProfileMapper profileMapper;
    private final MongoTemplate mongoTemplate;

    @Override
    public ProfileResponse createProfile(String userId, ProfileRequest request) {
        if (profileRepository.existsByUserId(userId)) {
            throw new DuplicateResourceException("Profile already exists for this user");
        }
        Profile profile = profileMapper.toEntity(request);
        profile.setUserId(userId);
        profile = profileRepository.save(profile);

        adminApprovalRepository.save(AdminApproval.builder()
                .profileId(profile.getId())
                .status(ApprovalStatus.PENDING)
                .build());

        return profileMapper.toResponse(profile);
    }

    @Override
    public ProfileResponse updateProfile(String userId, ProfileRequest request) {
        Profile profile = profileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", userId));
        profileMapper.updateEntity(profile, request);
        return profileMapper.toResponse(profileRepository.save(profile));
    }

    @Override
    public ProfileResponse getMyProfile(String userId) {
        return profileMapper.toResponse(
                profileRepository.findByUserId(userId)
                        .orElseThrow(() -> new ResourceNotFoundException("Profile", userId)));
    }

    @Override
    public ProfileResponse getProfileById(String profileId) {
        return profileMapper.toResponse(
                profileRepository.findById(profileId)
                        .orElseThrow(() -> new ResourceNotFoundException("Profile", profileId)));
    }

    @Override
    public PageResponse<ProfileSummaryDto> searchProfiles(
            String gender, Integer minAge, Integer maxAge,
            String city, String education, String occupation,
            String maritalStatus, String caste, Pageable pageable) {

        List<Criteria> criteriaList = new ArrayList<>();
        criteriaList.add(Criteria.where("approved").is(true));
        criteriaList.add(Criteria.where("active").is(true));

        if (StringUtils.hasText(gender)) criteriaList.add(Criteria.where("gender").is(gender));
        if (minAge != null && maxAge != null) criteriaList.add(Criteria.where("age").gte(minAge).lte(maxAge));
        else if (minAge != null) criteriaList.add(Criteria.where("age").gte(minAge));
        else if (maxAge != null) criteriaList.add(Criteria.where("age").lte(maxAge));
        if (StringUtils.hasText(city)) criteriaList.add(Criteria.where("city").regex(city, "i"));
        if (StringUtils.hasText(education)) criteriaList.add(Criteria.where("education").regex(education, "i"));
        if (StringUtils.hasText(occupation)) criteriaList.add(Criteria.where("occupation").regex(occupation, "i"));
        if (StringUtils.hasText(maritalStatus)) criteriaList.add(Criteria.where("maritalStatus").is(maritalStatus));
        if (StringUtils.hasText(caste)) criteriaList.add(Criteria.where("caste").is(caste));

        Criteria combined = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        List<Profile> profiles = mongoTemplate.find(new Query(combined).with(pageable), Profile.class);
        long total = mongoTemplate.count(new Query(combined), Profile.class);

        List<ProfileSummaryDto> summaries = profiles.stream().map(profileMapper::toSummary).toList();
        return PageResponse.from(new PageImpl<>(summaries, pageable, total));
    }
}
