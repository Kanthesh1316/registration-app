package com.kiran.RegestrationApp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendWelcomeMail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Welcome to My App");
        message.setText("Hi " + name + ",\n\nThank you for registering. Welcome aboard!\n\nRegards,\nMy App Team");
        mailSender.send(message);
    }
    public void sendSubmissionMail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Data Submission Successful");
        message.setText("Hi " + name + ",\n\nYour data has been submitted successfully. We will contact you later.\n\nRegards,\nMy App Team");
        mailSender.send(message);
    }
    public void sendTrialMail(String to, String name) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject("Your free trial class request");
        message.setText("Hi " + name + ",\n\nThank you for booking a free trial class. We will contact you soon to confirm the details.\n\nRegards,\nMy App Team");
        mailSender.send(message);
    }
}