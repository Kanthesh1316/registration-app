package com.kiran.RegestrationApp.dto;

import jakarta.validation.constraints.*;

public record TrialRequest(
        @NotBlank(message = "Name is required") String fullName,
        @Pattern(regexp = "\\d{10}", message = "Mobile must be 10 digits") String mobileNumber,
        @NotBlank(message = "Email is required") @Email(message = "Invalid email format") String email,
        @Pattern(regexp = "ONLINE|STUDIO", message = "Choose Online or Studio") String mode,
        String level) {
}