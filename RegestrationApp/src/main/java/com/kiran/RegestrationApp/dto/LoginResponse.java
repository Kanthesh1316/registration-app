package com.kiran.RegestrationApp.dto;

import com.kiran.RegestrationApp.entity.Role;

public record LoginResponse(String token, String name, String email, Role role) {
}