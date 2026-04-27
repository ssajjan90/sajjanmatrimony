package com.sajjanmatrimony.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private String id;
    private String fullName;
    private String email;
    private String mobile;
    private String role;
    private boolean emailVerified;
    private boolean mobileVerified;
    private boolean blocked;
    private boolean active;
}
