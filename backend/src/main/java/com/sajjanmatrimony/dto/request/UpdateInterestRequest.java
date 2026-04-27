package com.sajjanmatrimony.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UpdateInterestRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACCEPTED|REJECTED", message = "Status must be ACCEPTED or REJECTED")
    private String status;
}
