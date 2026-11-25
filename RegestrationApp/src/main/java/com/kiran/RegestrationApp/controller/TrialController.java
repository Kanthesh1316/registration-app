package com.kiran.RegestrationApp.controller;

import com.kiran.RegestrationApp.dto.TrialRequest;
import com.kiran.RegestrationApp.entity.TrialBooking;
import com.kiran.RegestrationApp.service.TrialService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trial")
public class TrialController {

    private final TrialService service;

    public TrialController(TrialService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> book(@Valid @RequestBody TrialRequest request) {
        try {
            service.book(request);
            return ResponseEntity.ok("Trial class booked. We will contact you soon.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<TrialBooking> all() {
        return service.getAll();
    }
}