package com.kiran.RegestrationApp.controller;
import java.util.List;
import com.kiran.RegestrationApp.entity.PersonalDetails;
import com.kiran.RegestrationApp.service.PersonalDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")

public class PersonalDetailsController {

    private final PersonalDetailsService service;

    public PersonalDetailsController(PersonalDetailsService service) {
        this.service = service;
    }

    @PostMapping("/details")
    public ResponseEntity<?> submit(@RequestBody PersonalDetails details) {
        try {
            service.submit(details);
            return ResponseEntity.ok("Data submitted successfully. We will contact you later.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }@GetMapping("/details")
    public List<PersonalDetails> getAll() {
        return service.getAll();
    }
}