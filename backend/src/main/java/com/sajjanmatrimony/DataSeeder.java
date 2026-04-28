package com.sajjanmatrimony;

import com.sajjanmatrimony.entity.Profile;
import com.sajjanmatrimony.entity.User;
import com.sajjanmatrimony.entity.enums.Role;
import com.sajjanmatrimony.repository.ProfileRepository;
import com.sajjanmatrimony.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(ApplicationArguments args) {
        seedAdmin();
        seedSampleProfiles();
    }

    private void seedAdmin() {
        if (userRepository.existsByEmail("admin@sajjanmatrimony.com")) return;

        userRepository.save(User.builder()
                .fullName("Admin")
                .email("admin@sajjanmatrimony.com")
                .mobile("9000000000")
                .password(passwordEncoder.encode("Admin@1234"))
                .role(Role.ROLE_ADMIN)
                .emailVerified(true)
                .mobileVerified(true)
                .build());

        log.info("=== Admin seeded: admin@sajjanmatrimony.com / Admin@1234 ===");
    }

    private void seedSampleProfiles() {
        if (profileRepository.count() > 0) return;

        User u1 = createUser("Ravi Sajjan", "ravi@example.com", "9111111111");
        User u2 = createUser("Priya Sajjan", "priya@example.com", "9222222222");
        User u3 = createUser("Kiran Sajjan", "kiran@example.com", "9333333333");

        saveProfile(u1, "Ravi Sajjan", "Male", LocalDate.of(1995, 6, 15),
                "5'10\"", "Never Married", "B.Tech", "Software Engineer", "Bangalore",
                Map.of("gotra", "Kashyapa", "diet", "Vegetarian",
                        "hobbies", List.of("Cricket", "Travel"), "familyType", "Nuclear"));

        saveProfile(u2, "Priya Sajjan", "Female", LocalDate.of(1997, 3, 22),
                "5'4\"", "Never Married", "MBA", "Marketing Manager", "Mysore",
                Map.of("gotra", "Bharadwaja", "diet", "Vegetarian",
                        "hobbies", List.of("Reading", "Cooking"), "familyType", "Nuclear"));

        saveProfile(u3, "Kiran Sajjan", "Male", LocalDate.of(1993, 11, 5),
                "5'8\"", "Never Married", "M.Com", "Chartered Accountant", "Hubli",
                Map.of("gotra", "Atri", "diet", "Vegetarian",
                        "hobbies", List.of("Music"), "familyType", "Joint"));

        log.info("=== Sample profiles seeded (3 profiles, approved) ===");
    }

    private User createUser(String name, String email, String mobile) {
        if (userRepository.existsByEmail(email)) {
            return userRepository.findByEmail(email).orElseThrow();
        }
        return userRepository.save(User.builder()
                .fullName(name)
                .email(email)
                .mobile(mobile)
                .password(passwordEncoder.encode("Test@1234"))
                .role(Role.ROLE_USER)
                .emailVerified(true)
                .build());
    }

    private void saveProfile(User user, String fullName, String gender, LocalDate dob,
                              String height, String maritalStatus, String education,
                              String occupation, String city,
                              Map<String, Object> additionalDetails) {
        int age = java.time.Period.between(dob, LocalDate.now()).getYears();
        profileRepository.save(Profile.builder()
                .userId(user.getId())
                .fullName(fullName)
                .gender(gender)
                .dateOfBirth(dob)
                .age(age)
                .height(height)
                .maritalStatus(maritalStatus)
                .motherTongue("Kannada")
                .caste("Sajjan")
                .education(education)
                .occupation(occupation)
                .city(city)
                .nativePlace("Karnataka")
                .aboutMe("I am a " + occupation + " from " + city + " looking for a compatible Sajjan match.")
                .approved(true)
                .additionalDetails(additionalDetails)
                .build());
    }
}
