package com.kiran.RegestrationApp.dto;

import com.kiran.RegestrationApp.entity.Role;

public record UserSummary(Long id, String name, String email, String phone, Role role) {
}