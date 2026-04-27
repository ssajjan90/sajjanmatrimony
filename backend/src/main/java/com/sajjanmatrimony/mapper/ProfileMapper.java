package com.sajjanmatrimony.mapper;

import com.sajjanmatrimony.dto.request.ProfileRequest;
import com.sajjanmatrimony.dto.response.ProfileResponse;
import com.sajjanmatrimony.dto.response.ProfileSummaryDto;
import com.sajjanmatrimony.entity.Profile;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.util.HashMap;

@Component
public class ProfileMapper {

    public Profile toEntity(ProfileRequest request) {
        return Profile.builder()
                .fullName(request.getFullName())
                .gender(request.getGender())
                .dateOfBirth(request.getDateOfBirth())
                .age(calculateAge(request.getDateOfBirth()))
                .height(request.getHeight())
                .maritalStatus(request.getMaritalStatus())
                .motherTongue(request.getMotherTongue())
                .caste(request.getCaste() != null ? request.getCaste() : "Sajjan")
                .education(request.getEducation())
                .occupation(request.getOccupation())
                .annualIncome(request.getAnnualIncome())
                .city(request.getCity())
                .nativePlace(request.getNativePlace())
                .aboutMe(request.getAboutMe())
                .partnerPreferences(request.getPartnerPreferences())
                .additionalDetails(request.getAdditionalDetails() != null
                        ? request.getAdditionalDetails() : new HashMap<>())
                .build();
    }

    public void updateEntity(Profile profile, ProfileRequest request) {
        profile.setFullName(request.getFullName());
        profile.setGender(request.getGender());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setAge(calculateAge(request.getDateOfBirth()));
        profile.setHeight(request.getHeight());
        profile.setMaritalStatus(request.getMaritalStatus());
        profile.setMotherTongue(request.getMotherTongue());
        profile.setCaste(request.getCaste() != null ? request.getCaste() : "Sajjan");
        profile.setEducation(request.getEducation());
        profile.setOccupation(request.getOccupation());
        profile.setAnnualIncome(request.getAnnualIncome());
        profile.setCity(request.getCity());
        profile.setNativePlace(request.getNativePlace());
        profile.setAboutMe(request.getAboutMe());
        profile.setPartnerPreferences(request.getPartnerPreferences());
        if (request.getAdditionalDetails() != null) {
            profile.setAdditionalDetails(request.getAdditionalDetails());
        }
        profile.setApproved(false); // edited profile needs re-approval
    }

    public ProfileResponse toResponse(Profile profile) {
        return ProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .dateOfBirth(profile.getDateOfBirth())
                .age(profile.getAge())
                .height(profile.getHeight())
                .maritalStatus(profile.getMaritalStatus())
                .motherTongue(profile.getMotherTongue())
                .caste(profile.getCaste())
                .education(profile.getEducation())
                .occupation(profile.getOccupation())
                .annualIncome(profile.getAnnualIncome())
                .city(profile.getCity())
                .nativePlace(profile.getNativePlace())
                .aboutMe(profile.getAboutMe())
                .partnerPreferences(profile.getPartnerPreferences())
                .photoUrls(profile.getPhotoUrls())
                .approved(profile.isApproved())
                .additionalDetails(profile.getAdditionalDetails())
                .createdAt(profile.getCreatedAt())
                .build();
    }

    public ProfileSummaryDto toSummary(Profile profile) {
        String photo = (profile.getPhotoUrls() != null && !profile.getPhotoUrls().isEmpty())
                ? profile.getPhotoUrls().get(0) : null;
        return ProfileSummaryDto.builder()
                .id(profile.getId())
                .fullName(profile.getFullName())
                .gender(profile.getGender())
                .age(profile.getAge())
                .height(profile.getHeight())
                .maritalStatus(profile.getMaritalStatus())
                .city(profile.getCity())
                .education(profile.getEducation())
                .occupation(profile.getOccupation())
                .caste(profile.getCaste())
                .profilePhoto(photo)
                .approved(profile.isApproved())
                .build();
    }

    private int calculateAge(LocalDate dateOfBirth) {
        return Period.between(dateOfBirth, LocalDate.now()).getYears();
    }
}
