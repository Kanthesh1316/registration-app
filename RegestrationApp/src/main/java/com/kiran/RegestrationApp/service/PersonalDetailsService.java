package com.kiran.RegestrationApp.service;

import com.kiran.RegestrationApp.entity.PersonalDetails;
import com.kiran.RegestrationApp.repository.PersonalDetailsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PersonalDetailsService {

    private final PersonalDetailsRepository repository;
    private final EmailService emailService;

    public PersonalDetailsService(PersonalDetailsRepository repository, EmailService emailService) {
        this.repository = repository;
        this.emailService = emailService;
    }

    public PersonalDetails submit(PersonalDetails details) {
        if (repository.existsByEmail(details.getEmail())) {
            throw new RuntimeException("Details already submitted with this email");
        }
        PersonalDetails saved = repository.save(details);
        try {
            emailService.sendSubmissionMail(saved.getEmail(), saved.getFullName());
        } catch (Exception e) {
            System.out.println("Mail failed: " + e.getMessage());
        }
        return saved;
    }

    public List<PersonalDetails> getAll() {
        return repository.findAll();
    }

    public PersonalDetails getProfile(String email) {
        return repository.findFirstByEmail(email).orElse(null);
    }

    public PersonalDetails saveProfile(String email, PersonalDetails incoming) {
        PersonalDetails existing = repository.findFirstByEmail(email).orElse(null);
        boolean isNew = existing == null;
        incoming.setEmail(email);
        incoming.setId(isNew ? null : existing.getId());
        PersonalDetails saved = repository.save(incoming);
        if (isNew) {
            try {
                emailService.sendSubmissionMail(saved.getEmail(), saved.getFullName());
            } catch (Exception e) {
                System.out.println("Mail failed: " + e.getMessage());
            }
        }
        return saved;
    }
}