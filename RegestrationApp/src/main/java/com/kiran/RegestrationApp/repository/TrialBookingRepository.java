package com.kiran.RegestrationApp.repository;

import com.kiran.RegestrationApp.entity.TrialBooking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrialBookingRepository extends JpaRepository<TrialBooking, Long> {
    boolean existsByEmail(String email);
    List<TrialBooking> findAllByOrderByCreatedAtDesc();
}