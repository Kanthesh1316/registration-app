package com.kiran.RegestrationApp.controller;

import com.kiran.RegestrationApp.entity.PersonalDetails;
import com.kiran.RegestrationApp.service.PersonalDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final PersonalDetailsService service;

    public ProfileController(PersonalDetailsService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<?> get(Authentication auth) {
        PersonalDetails profile = service.getProfile(auth.getName());
        if (profile == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(profile);
    }

    @PutMapping
    public ResponseEntity<?> save(@RequestBody PersonalDetails details, Authentication auth) {
        try {
            return ResponseEntity.ok(service.saveProfile(auth.getName(), details));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}