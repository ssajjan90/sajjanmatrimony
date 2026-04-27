package com.sajjanmatrimony.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ProfileSummaryDto {
    private String id;
    private String fullName;
    private String gender;
    private Integer age;
    private String height;
    private String maritalStatus;
    private String city;
    private String education;
    private String occupation;
    private String caste;
    private String profilePhoto;
    private boolean approved;
}
