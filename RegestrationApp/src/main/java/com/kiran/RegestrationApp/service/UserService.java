package com.kiran.RegestrationApp.service;
import com.kiran.RegestrationApp.entity.Role;
import com.kiran.RegestrationApp.entity.User;
import com.kiran.RegestrationApp.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.kiran.RegestrationApp.dto.UserSummary;
import java.util.List;
@Service
public class UserService {
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        user.setRole(Role.USER);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);
        try {
            emailService.sendWelcomeMail(saved.getEmail(), saved.getName());
        } catch (Exception e) {
            System.out.println("Mail failed: " + e.getMessage());
        }
        return saved;
    }
    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Wrong password");
        }
        return user;
    }
    public List<UserSummary> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserSummary(u.getId(), u.getName(), u.getEmail(), u.getPhone(), u.getRole()))
                .toList();
    }

    public UserSummary changeRole(Long id, String role, String currentEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getEmail().equalsIgnoreCase(currentEmail)) {
            throw new RuntimeException("You cannot change your own role");
        }
        try {
            user.setRole(Role.valueOf(role));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid role");
        }
        userRepository.save(user);
        return new UserSummary(user.getId(), user.getName(), user.getEmail(), user.getPhone(), user.getRole());
    }
}