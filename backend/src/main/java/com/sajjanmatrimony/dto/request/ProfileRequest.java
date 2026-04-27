package com.sajjanmatrimony.dto.request;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.Map;

@Data
public class ProfileRequest {

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotNull(message = "Date of birth is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate dateOfBirth;

    private String height;

    @NotBlank(message = "Marital status is required")
    private String maritalStatus;

    private String motherTongue;
    private String caste;

    @NotBlank(message = "Education is required")
    private String education;

    @NotBlank(message = "Occupation is required")
    private String occupation;

    private String annualIncome;

    @NotBlank(message = "City is required")
    private String city;

    private String nativePlace;
    private String aboutMe;
    private Map<String, Object> partnerPreferences;

    // Flexible dynamic attributes: gotra, diet, hobbies, familyType, horoscope, etc.
    private Map<String, Object> additionalDetails;
}
