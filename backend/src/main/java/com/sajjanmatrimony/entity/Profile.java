package com.sajjanmatrimony.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "profiles")
@CompoundIndexes({
    @CompoundIndex(name = "search_idx", def = "{'gender': 1, 'age': 1, 'city': 1, 'approved': 1}"),
    @CompoundIndex(name = "edu_occ_idx", def = "{'education': 1, 'occupation': 1}")
})
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Profile {

    @Id
    private String id;

    @Indexed
    private String userId;

    private String fullName;

    @Indexed
    private String gender;

    private LocalDate dateOfBirth;

    @Indexed
    private Integer age;

    private String height;

    @Indexed
    private String maritalStatus;

    private String motherTongue;

    @Indexed
    @Builder.Default
    private String caste = "Sajjan";

    @Indexed
    private String education;

    @Indexed
    private String occupation;

    private String annualIncome;

    @Indexed
    private String city;

    private String nativePlace;
    private String aboutMe;

    private Map<String, Object> partnerPreferences;

    @Builder.Default
    private List<String> photoUrls = new ArrayList<>();

    @Builder.Default
    private boolean approved = false;

    @Builder.Default
    private boolean active = true;

    // Flexible key-value store for dynamic/optional fields
    @Builder.Default
    private Map<String, Object> additionalDetails = new HashMap<>();

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;
}
