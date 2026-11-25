package com.kiran.RegestrationApp.service;

import com.kiran.RegestrationApp.dto.TrialRequest;
import com.kiran.RegestrationApp.entity.TrialBooking;
import com.kiran.RegestrationApp.repository.TrialBookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrialService {

    private final TrialBookingRepository repository;
    private final EmailService emailService;

    public TrialService(TrialBookingRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public TrialBooking book(TrialRequest request) {
        String email = request.email().trim().toLowerCase();
        if (repository.existsByEmail(email)) {
            throw new RuntimeException("A trial class is already booked with this email");
        }
        TrialBooking booking = new TrialBooking();
        booking.setFullName(request.fullName().trim());
        booking.setMobileNumber(request.mobileNumber());
        booking.setEmail(email);
        booking.setMode(request.mode());
        booking.setLevel(request.level() == null || request.level().isBlank() ? null : request.level());
        TrialBooking saved = repository.save(booking);
        try {
            emailService.sendTrialMail(saved.getEmail(), saved.getFullName());
        } catch (Exception e) {
            System.out.println("Mail failed: " + e.getMessage());
        }
        return saved;
    }

    public List<TrialBooking> getAll() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}