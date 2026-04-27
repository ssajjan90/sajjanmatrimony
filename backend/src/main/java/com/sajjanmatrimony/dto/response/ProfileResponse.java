package com.sajjanmatrimony.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Data;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
public class ProfileResponse {
    private String id;
    private String userId;
    private String fullName;
    private String gender;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private Integer age;
    private String height;
    private String maritalStatus;
    private String motherTongue;
    private String caste;
    private String education;
    private String occupation;
    private String annualIncome;
    private String city;
    private String nativePlace;
    private String aboutMe;
    private Map<String, Object> partnerPreferences;
    private List<String> photoUrls;
    private boolean approved;
    private Map<String, Object> additionalDetails;
    private Instant createdAt;
}
