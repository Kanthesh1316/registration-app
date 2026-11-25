package com.kiran.RegestrationApp.controller;

import com.kiran.RegestrationApp.dto.LoginResponse;
import com.kiran.RegestrationApp.entity.User;
import com.kiran.RegestrationApp.service.JwtService;
import com.kiran.RegestrationApp.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        try {
            userService.register(user);
            return ResponseEntity.ok("Registration successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            User found = userService.login(user.getEmail(), user.getPassword());
            return ResponseEntity.ok(new LoginResponse(
                    jwtService.generateToken(found),
                    found.getName(),
                    found.getEmail(),
                    found.getRole()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}